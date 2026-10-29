
import pytest

from src.evaluation import genre_similarity
from src.evaluation import average_genre_similarity
from src.evaluation import recommendation_diversity


def test_identical_genres():
    assert genre_similarity(
        ["Action", "Comedy"],
        ["Action", "Comedy"],
    ) == 1.0


def test_completely_different_genres():
    assert genre_similarity(
        ["Action"],
        ["Drama"],
    ) == 0.0


def test_partially_overlapping_genres():
    result = genre_similarity(
        ["Action", "Comedy"],
        ["Action", "Drama"],
    )

    assert result == pytest.approx(1 / 3)


def test_both_genre_sets_empty():
    assert genre_similarity([], []) == 1.0


def test_one_genre_set_empty():
    assert genre_similarity(["Action"], []) == 0.0




def test_average_genre_similarity():
    result = average_genre_similarity(
        ["Action", "Comedy"],
        [
            ["Action", "Comedy"],
            ["Action", "Drama"],
            ["Horror"],
        ],
    )

    assert result == pytest.approx(4 / 9)


def test_average_similarity_with_no_recommendations():
    assert average_genre_similarity(
        ["Action"],
        [],
    ) == 0.0



def test_diversity_of_identical_genre_sets():
    result = recommendation_diversity(
        [
            ["Action", "Comedy"],
            ["Action", "Comedy"],
        ]
    )

    assert result == 0.0


def test_diversity_of_disjoint_genre_sets():
    result = recommendation_diversity(
        [
            ["Action"],
            ["Drama"],
        ]
    )

    assert result == 1.0


def test_diversity_of_partially_overlapping_genre_sets():
    result = recommendation_diversity(
        [
            ["Action", "Comedy"],
            ["Action", "Drama"],
        ]
    )

    assert result == pytest.approx(2 / 3)


def test_diversity_with_one_recommendation():
    assert recommendation_diversity([["Action"]]) == 0.0


def test_diversity_with_no_recommendations():
    assert recommendation_diversity([]) == 0.0
