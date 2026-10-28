
import pandas as pd

# Load the movie dataset
movies = pd.read_csv("data/ml-latest-small/movies.csv")

# # Display the first five movies
# print("First five movies:")
# print(movies.head())

# # Display the number of rows and columns
# print("\nDataset shape:")
# print(movies.shape)

# # Display the column names
# print("\nColumn names:")
# print(movies.columns.tolist())



# # Display the data types of each column
# print("\nColumn data types:")
# print(movies.dtypes)


# # Count missing values in each column
# print("\nMissing values per column:")
# print(movies.isnull().sum())


# # Count duplicate rows
# print("\nDuplicate rows:")
# print(movies.duplicated().sum())


# # Count duplicate movie titles
# print("\nDuplicate movie titles:")
# print(movies["title"].duplicated().sum())


# # Display rows with duplicate titles
# duplicate_titles = movies[
#     movies["title"].duplicated(keep=False)
# ].sort_values("title")

# print("\nMovies with duplicate titles:")
# print(duplicate_titles)


# # Display the most common genre strings
# print("\nMost common genre combinations:")
# print(movies["genres"].value_counts().head(10))

# # Count empty or missing genre values
# print("\nEmpty genre strings:")
# print((movies["genres"].str.strip() == "").sum())

# print("\nMissing genre values:")
# print(movies["genres"].isnull().sum())


# # Display all unique genre labels
# all_genres = set()

# for genre_string in movies["genres"]:
#     for genre in genre_string.split("|"):
#         all_genres.add(genre)

# print("\nUnique genre labels:")
# print(sorted(all_genres))

# # Check for movies without listed genres
# print("\nMovies with no genres listed:")
# print((movies["genres"] == "(no genres listed)").sum())



# Check titles that do not end with a four-digit year in parentheses
year_pattern = r"\(\d{4}\)\s*$"

titles_without_year = movies[
    ~movies["title"].str.contains(year_pattern, regex=True, na=False)
]

print("\nTitles without a standard ending year:")
print("Count:", len(titles_without_year))
print(titles_without_year.head(20))




# Display complete titles flagged by the year check
print("\nComplete titles flagged by the year check:")

for title in titles_without_year["title"].head(10):
    print(repr(title))



# Count titles with leading or trailing whitespace
whitespace_count = (
    movies["title"] != movies["title"].str.strip()
).sum()

print("\nTitles with leading or trailing whitespace:")
print(whitespace_count)


# Check whether genre strings contain spaces around the pipe separator
genres_with_spaces = movies[
    movies["genres"].str.contains(r"\s+\||\|\s+", regex=True, na=False)
]

print("\nGenre strings with spaces around separators:")
print("Count:", len(genres_with_spaces))
print(genres_with_spaces.head(10))
