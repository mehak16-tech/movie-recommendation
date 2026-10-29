
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from src.data_processing import load_movies, preprocess_movies


def build_genre_vocabulary(processed_movies):
    # Keep only movies that have genre information
    eligible_movies = processed_movies[
        processed_movies["has_genres"]
    ].copy()

    # Collect all unique genres across eligible movies
    genre_vocabulary = sorted(
        {
            genre
            for genres in eligible_movies["genre_list"]
            for genre in genres
            if genre != "(no genres listed)"
        }
    )

    return eligible_movies, genre_vocabulary




def build_genre_features(processed_movies):
    # Get movies with valid genre information
    eligible_movies, genre_vocabulary = build_genre_vocabulary(
        processed_movies
    )

    # Create the multi-hot encoder using our consistent vocabulary
    encoder = MultiLabelBinarizer(classes=genre_vocabulary)

    # Convert each movie's genre list into binary values
    feature_array = encoder.fit_transform(
        eligible_movies["genre_list"]
    )

    # Create a DataFrame with one column per genre
    genre_features = pd.DataFrame(
        feature_array,
        columns=genre_vocabulary,
        index=eligible_movies.index,
    )

    return eligible_movies, genre_features, genre_vocabulary


if __name__ == "__main__":
    raw_movies = load_movies()
    processed_movies, excluded_movies = preprocess_movies(raw_movies)

    eligible_movies, genre_features, genre_vocabulary = (
        build_genre_features(processed_movies)
    )

    print("Eligible movies:", len(eligible_movies))
    print("Number of genres:", len(genre_vocabulary))
    print("Feature matrix shape:", genre_features.shape)

    # Check that the catalogue and features have matching row counts
    print(
        "Row counts match:",
        len(eligible_movies) == len(genre_features),
    )

    # Check that the feature columns match the genre vocabulary
    print(
        "Columns match vocabulary:",
        genre_features.columns.tolist() == genre_vocabulary,
    )

    # Check that movie IDs are unique
    print(
        "Movie IDs are unique:",
        eligible_movies["movieId"].is_unique,
    )

    # Display a real movie and its active genres
    movie_index = eligible_movies.index[0]
    movie = eligible_movies.loc[movie_index]
    vector = genre_features.loc[movie_index]

    print("\nExample movie:")
    print("Movie ID:", movie["movieId"])
    print("Title:", movie["clean_title"])
    print("Genres:", movie["genre_list"])
    print("Vector:", vector.tolist())
    print(
        "Active genres:",
        vector[vector == 1].index.tolist(),
    )
