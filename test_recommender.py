
import pandas as pd
import pytest

from src.recommender import MovieRecommender


@pytest.fixture
def recommender():
    return MovieRecommender()


def test_known_movie_returns_recommendations(recommender):
    results = recommender.recommend_movies("Toy Story (1995)")

    assert len(results) == 5
    assert {"movieId", "title", "genres", "distance"}.issubset(
        results.columns
    )


def test_unknown_title_raises_error(recommender):
    with pytest.raises(ValueError, match="Movie not found"):
        recommender.recommend_movies("Unknown Movie (2099)")


def test_empty_title_raises_error(recommender):
    with pytest.raises(ValueError, match="non-empty"):
        recommender.recommend_movies("   ")


def test_non_string_title_raises_error(recommender):
    with pytest.raises(ValueError, match="non-empty"):
        recommender.recommend_movies(None)


def test_duplicate_title_raises_error(recommender):
    repeated = recommender.movies[
        recommender.movies["clean_title"].duplicated(keep=False)
    ]

    assert not repeated.empty

    title = repeated.iloc[0]["clean_title"]

    with pytest.raises(ValueError, match="Multiple movies match"):
        recommender.recommend_movies(title)


def test_one_recommendation(recommender):
    results = recommender.recommend_movies(
        "Toy Story (1995)",
        n_recommendations=1,
    )

    assert len(results) == 1


def test_five_recommendations(recommender):
    results = recommender.recommend_movies(
        "Jumanji (1995)",
        n_recommendations=5,
    )

    assert len(results) == 5


def test_large_request_returns_available_alternatives(recommender):
    # A request larger than the eligible catalogue should return
    # every eligible alternative, excluding the selected movie.
    title = "Toy Story (1995)"
    results = recommender.recommend_movies(
        title,
        n_recommendations=len(recommender.movies) + 10,
    )

    assert len(results) == len(recommender.movies) - 1
    assert title not in results["title"].values


@pytest.mark.parametrize("count", [0, -1])
def test_non_positive_count_raises_error(recommender, count):
    with pytest.raises(ValueError, match="greater than zero"):
        recommender.recommend_movies(
            "Toy Story (1995)",
            n_recommendations=count,
        )


@pytest.mark.parametrize("count", [1.5, "5", None, True])
def test_non_integer_count_raises_error(recommender, count):
    with pytest.raises(TypeError, match="must be an integer"):
        recommender.recommend_movies(
            "Toy Story (1995)",
            n_recommendations=count,
        )


def test_selected_movie_is_excluded(recommender):
    title = "Toy Story (1995)"
    selected_id = recommender.movies.loc[
        recommender.movies["clean_title"] == title,
        "movieId",
    ].iloc[0]

    results = recommender.recommend_movies(title)

    assert selected_id not in results["movieId"].values


def test_distances_are_sorted(recommender):
    results = recommender.recommend_movies("Heat (1995)")

    assert results["distance"].is_monotonic_increasing


def test_movie_ids_are_unique_in_catalogue(recommender):
    assert recommender.movies["movieId"].is_unique


def test_result_ids_and_titles_match_catalogue(recommender):
    results = recommender.recommend_movies("Toy Story (1995)")

    for _, movie in results.iterrows():
        catalogue_movie = recommender.movies.loc[
            recommender.movies["movieId"] == movie["movieId"]
        ].iloc[0]

        assert movie["title"] == catalogue_movie["clean_title"]
        assert movie["genres"] == catalogue_movie["genres"]


def test_identical_genre_vectors_can_have_zero_distance(recommender):
    title = "Toy Story (1995)"
    results = recommender.recommend_movies(title)

    selected_index = recommender.movies.index.get_loc(
        recommender.movies.index[
            recommender.movies["clean_title"] == title
        ][0]
    )
    selected_vector = recommender.genre_features.iloc[selected_index]

    for _, result in results.iterrows():
        result_index = recommender.movies.index.get_loc(
            recommender.movies.index[
                recommender.movies["movieId"] == result["movieId"]
            ][0]
        )
        result_vector = recommender.genre_features.iloc[result_index]

        if selected_vector.equals(result_vector):
            assert result["distance"] == pytest.approx(0.0)


def test_movie_without_genres_is_not_eligible(recommender):
    raw_movies = recommender.movies

    # Movies in this catalogue already have genre information.
    assert raw_movies["has_genres"].all()

