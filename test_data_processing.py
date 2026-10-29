
from src.data_processing import load_movies

movies = load_movies()

print(movies.head())
print("Dataset shape:", movies.shape)
print("Column names:", movies.columns.tolist())

from src.data_processing import find_invalid_titles

invalid_titles = find_invalid_titles(movies)

print("Invalid title count:", len(invalid_titles))
print(invalid_titles)



from src.data_processing import clean_title_whitespace

cleaned_movies = clean_title_whitespace(movies)

print("Titles changed:", (movies["title"] != cleaned_movies["clean_title"]).sum())
print(cleaned_movies[["title", "clean_title"]].head())




from src.data_processing import identify_unlisted_genres

unlisted_genres = identify_unlisted_genres(movies)

print("Movies with unlisted genres:", unlisted_genres.sum())



from src.data_processing import parse_genres

print(parse_genres("Adventure|Animation|Children"))
print(parse_genres("(no genres listed)"))



from src.data_processing import parse_year

print(parse_year("Toy Story (1995)"))
print(parse_year("Unknown Movie"))
print(parse_year("Movie (1995-1996)"))




from src.data_processing import preprocess_movies

processed_movies, excluded_movies = preprocess_movies(movies)
print("Original row count:", len(movies))
print("Processed row count:", len(processed_movies))
print("Movies with usable genres:", processed_movies["has_genres"].sum())
print("Movies without usable genres:", (~processed_movies["has_genres"]).sum())
print(processed_movies[["movieId", "clean_title", "year", "genre_list"]].head())
print("Duplicate movie IDs:", processed_movies["movieId"].duplicated().sum())
print("Repeated cleaned titles:", processed_movies["clean_title"].duplicated().sum())


repeated_titles = processed_movies[
    processed_movies["clean_title"].duplicated(keep=False)
].sort_values("clean_title")

print(repeated_titles[["movieId", "clean_title", "year", "genre_list"]])



import pandas as pd

sample_movies = pd.DataFrame({
    "movieId": [1, 2, 3, 4, 5, 6],
    "title": ["  Test Movie (2001)  ", None, "   ", "Same Title (2000)", "Same Title (2000)", "Unknown Movie"],
    "genres": ["Comedy|Drama", "Comedy", "Action", "(no genres listed)", "Romance", "Adventure"]
})

sample_processed, sample_excluded = preprocess_movies(sample_movies)

print(sample_processed[["movieId", "clean_title", "year", "genre_list", "has_genres"]])
print("Sample input rows:", len(sample_movies))
print("Sample output rows:", len(sample_processed))


print(sample_processed[["movieId", "clean_title", "year", "genre_list", "has_genres"]].to_string(index=False))
print("Repeated sample titles:", sample_processed["clean_title"].duplicated().sum())


print("Required columns present:", {"movieId", "title", "genres"}.issubset(processed_movies.columns))
print("Duplicate movie IDs:", processed_movies["movieId"].duplicated().sum())
print("Titles with surrounding whitespace:", (processed_movies["clean_title"] != processed_movies["clean_title"].str.strip()).sum())
print("Empty genre labels:", sum("" in genres for genres in processed_movies["genre_list"]))
print("Missing parsed years:", processed_movies["year"].isna().sum())



print("Original CSV row count:", len(movies))
print("Processed row count:", len(processed_movies))
print("Excluded row count:", len(movies) - len(processed_movies))


print("Processed movies:", len(processed_movies))
print("Excluded movies:", len(excluded_movies))
print("Exclusion reasons:")
print(excluded_movies)

print("Sample processed rows:", len(sample_processed))
print("Sample excluded rows:", len(sample_excluded))
print("Excluded movie IDs:", sample_excluded["movieId"].tolist())
print("Exclusion reasons:", sample_excluded["exclusion_reason"].tolist())