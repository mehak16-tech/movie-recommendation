
from backend.data_processing import load_movies, preprocess_movies


# Load the original movie dataset
raw_movies = load_movies()

# Run the existing preprocessing pipeline
processed_movies, excluded_movies = preprocess_movies(raw_movies)

# Display the shapes of the DataFrames
print("Raw dataset shape:", raw_movies.shape)
print("Processed dataset shape:", processed_movies.shape)
print("Excluded dataset shape:", excluded_movies.shape)

# Display the available columns
print("\nProcessed columns:")
print(processed_movies.columns.tolist())

# Display the data types
print("\nData types:")
print(processed_movies.dtypes)

# Display a few processed movies
print("\nSample processed movies:")
print(
    processed_movies[
        ["movieId", "clean_title", "genre_list", "has_genres"]
    ].head()
)

# Count movies without listed genres
print("\nMovies without genres:")
print((~processed_movies["has_genres"]).sum())
