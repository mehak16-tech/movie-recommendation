
from src.data_processing import load_movies, preprocess_movies
from src.feature_engineering import build_genre_features


def get_feature_data():
    raw_movies = load_movies()
    processed_movies, excluded_movies = preprocess_movies(raw_movies)

    eligible_movies, genre_features, genre_vocabulary = (
        build_genre_features(processed_movies)
    )

    return eligible_movies, genre_features, genre_vocabulary



def test_feature_values_are_binary():
    _, genre_features, _ = get_feature_data()

    assert genre_features.isin([0, 1]).all().all()


def test_feature_matrix_shape():
    eligible_movies, genre_features, genre_vocabulary = get_feature_data()

    assert len(eligible_movies) == len(genre_features)
    assert genre_features.shape[1] == len(genre_vocabulary)



def test_movie_genres_are_encoded_correctly():
    eligible_movies, genre_features, _ = get_feature_data()

    # Find Toy Story using its movie ID
    movie = eligible_movies[
        eligible_movies["movieId"] == 1
    ].iloc[0]

    # Get its feature vector using the same row index
    vector = genre_features.loc[movie.name]

    # Find the genres that have a value of 1
    actual_genres = set(vector[vector == 1].index)

    # Compare them with the movie's original genre list
    expected_genres = set(movie["genre_list"])

    assert actual_genres == expected_genres



def test_repeated_titles_remain_distinguishable():
    eligible_movies, genre_features, _ = get_feature_data()

    repeated_titles = eligible_movies[
        eligible_movies["clean_title"].duplicated(keep=False)
    ]

    assert len(repeated_titles) > 0
    assert repeated_titles["movieId"].is_unique

    # Every repeated-title movie must retain its own feature row
    assert repeated_titles.index.isin(genre_features.index).all()



import pandas as pd


def test_small_manual_example():
    sample_movies = pd.DataFrame(
        {
            "movieId": [101, 102, 103],
            "title": ["Movie A", "Movie B", "Movie C"],
            "genres": [
                "Action|Comedy",
                "Drama|Romance",
                "(no genres listed)",
            ],
            "clean_title": ["Movie A", "Movie B", "Movie C"],
            "year": [2020, 2021, 2022],
            "genre_list": [
                ["Action", "Comedy"],
                ["Drama", "Romance"],
                [],
            ],
            "has_genres": [True, True, False],
        }
    )

    eligible, features, vocabulary = build_genre_features(sample_movies)

    assert eligible["movieId"].tolist() == [101, 102]
    assert vocabulary == ["Action", "Comedy", "Drama", "Romance"]
    assert features.loc[0].tolist() == [1, 1, 0, 0]
    assert features.loc[1].tolist() == [0, 0, 1, 1]
    assert len(features) == 2
