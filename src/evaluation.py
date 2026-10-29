
def genre_similarity(genres_a, genres_b):
    """Calculate Jaccard similarity between two genre collections."""
    set_a = set(genres_a)
    set_b = set(genres_b)

    union = set_a | set_b

    if not union:
        return 1.0

    intersection = set_a & set_b

    return len(intersection) / len(union)



def average_genre_similarity(selected_genres, recommended_genres):
    """Calculate average genre similarity for a recommendation list."""
    if not recommended_genres:
        return 0.0

    similarities = [
        genre_similarity(selected_genres, genres)
        for genres in recommended_genres
    ]

    return sum(similarities) / len(similarities)



def recommendation_diversity(recommended_genres):
    """Calculate average pairwise Jaccard distance among recommendations."""
    if len(recommended_genres) < 2:
        return 0.0

    distances = []

    for i in range(len(recommended_genres)):
        for j in range(i + 1, len(recommended_genres)):
            similarity = genre_similarity(
                recommended_genres[i],
                recommended_genres[j],
            )
            distances.append(1.0 - similarity)

    return sum(distances) / len(distances)


if __name__ == "__main__":
    from src.recommender import MovieRecommender

    recommender = MovieRecommender()

    test_titles = [
        "Toy Story (1995)",
        "Jumanji (1995)",
        "Heat (1995)",
    ]

    for title in test_titles:
        recommendations = recommender.recommend_movies(title)

        selected_movie = recommender.movies[
            recommender.movies["clean_title"] == title
        ].iloc[0]

        selected_genres = selected_movie["genre_list"]

        recommended_genres = [
            recommender.movies.loc[
                recommender.movies["movieId"] == movie_id,
                "genre_list",
            ].iloc[0]
            for movie_id in recommendations["movieId"]
        ]

        avg_similarity = average_genre_similarity(
            selected_genres,
            recommended_genres,
        )

        diversity = recommendation_diversity(recommended_genres)

        print(f"\nEvaluation for {title}")
        print(f"Recommendations evaluated: {len(recommendations)}")
        print(f"Average genre similarity: {avg_similarity:.3f}")
        print(f"Recommendation diversity: {diversity:.3f}")
