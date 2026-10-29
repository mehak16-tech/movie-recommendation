
import pandas as pd
from sklearn.neighbors import NearestNeighbors

from src.data_processing import load_movies, preprocess_movies
from src.feature_engineering import build_genre_features


class MovieRecommender:
    def __init__(self):
        # Load and preprocess the dataset
        raw_movies = load_movies()
        processed_movies, _ = preprocess_movies(raw_movies)

        # Build the eligible movie catalogue and genre features
        (
            self.movies,
            self.genre_features,
            self.genre_vocabulary,
        ) = build_genre_features(processed_movies)

        # Fit the nearest-neighbor model once
        self.model = NearestNeighbors(
            metric="cosine",
            algorithm="brute",
        )
        self.model.fit(self.genre_features)

    def recommend_movies(self, title, n_recommendations=5):
        # Validate title
        if not isinstance(title, str) or not title.strip():
            raise ValueError("Title must be a non-empty string.")

        # Validate recommendation count
        if isinstance(n_recommendations, bool) or not isinstance(
            n_recommendations, int
        ):
            raise TypeError("n_recommendations must be an integer.")

        if n_recommendations <= 0:
            raise ValueError(
                "n_recommendations must be greater than zero."
            )

        # Match titles without case sensitivity
        normalized_title = title.strip().casefold()
        matching_movies = self.movies[
            self.movies["clean_title"].str.casefold()
            == normalized_title
        ]

        if matching_movies.empty:
            # Check whether the movie exists but has no listed genres
            all_movies = preprocess_movies(load_movies())[0]
            all_matches = all_movies[
                all_movies["clean_title"].str.casefold()
                == normalized_title
            ]

            if not all_matches.empty:
                raise ValueError(
                    f"Movie '{title}' has no listed genres and "
                    "is not eligible for genre-based recommendations."
                )

            raise ValueError(f"Movie not found: {title}")

        if len(matching_movies) > 1:
            raise ValueError(
                f"Multiple movies match this title: {title}. "
                "Use a more specific title."
            )

        # Find the query movie's row in the feature matrix
        movie_index = self.movies.index.get_loc(
            matching_movies.index[0]
        )
        query_features = self.genre_features.iloc[[movie_index]]
        selected_movie_id = matching_movies.iloc[0]["movieId"]

        # Request every eligible movie, ensuring sufficient results
        distances, indices = self.model.kneighbors(
            query_features,
            n_neighbors=len(self.movies),
        )

        recommendations = []

        for distance, index in zip(distances[0], indices[0]):
            candidate = self.movies.iloc[index]

            # Exclude only the selected movie
            if candidate["movieId"] == selected_movie_id:
                continue

            recommendations.append(
                {
                    "movieId": candidate["movieId"],
                    "title": candidate["clean_title"],
                    "genres": candidate["genres"],
                    "distance": float(distance),
                }
            )

            if len(recommendations) == n_recommendations:
                break

        return pd.DataFrame(
            recommendations,
            columns=["movieId", "title", "genres", "distance"],
        )


def main():
    recommender = MovieRecommender()

    test_titles = [
        "Toy Story (1995)",
        "Jumanji (1995)",
        "Heat (1995)",
    ]

    for title in test_titles:
        print(f"\nRecommendations for {title}:")

        try:
            results = recommender.recommend_movies(title)
            print(results.to_string(index=False))
        except ValueError as error:
            print("Error:", error)


if __name__ == "__main__":
    main()
