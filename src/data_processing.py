import pandas as pd
from pathlib import Path
import re

def load_movies():
    project_root = Path(__file__).resolve().parent.parent
    file_path = project_root / "data" / "ml-latest-small" / "movies.csv"

    movies = pd.read_csv(file_path)

    required_columns = {"movieId", "title", "genres"}
    if not required_columns.issubset(movies.columns):
        raise ValueError("The movies.csv file is missing required columns.")

    return movies


def find_invalid_titles(movies):
    missing_titles = movies["title"].isna()
    blank_titles = movies["title"].str.strip().eq("").fillna(False)

    invalid_titles = missing_titles | blank_titles

    return movies[invalid_titles]



def clean_title_whitespace(movies):
    movies = movies.copy()
    movies["clean_title"] = movies["title"].str.strip()
    return movies



def identify_unlisted_genres(movies):
    return movies["genres"].eq("(no genres listed)")



def parse_genres(genres):
    if pd.isna(genres) or genres.strip() in ("", "(no genres listed)"):
        return []

    return [genre.strip() for genre in genres.split("|") if genre.strip()]



def parse_year(title):
    year = title.str.extract(r"\((\d{4})\)\s*$", expand=False)
    return year



def parse_year(title):
    if not isinstance(title, str):
        return None

    match = re.search(r"\((\d{4})\)\s*$", title)

    if match:
        return int(match.group(1))

    return None





def preprocess_movies(movies):
    movies = movies.copy()

    movies["clean_title"] = movies["title"].str.strip()
    movies["year"] = movies["clean_title"].apply(parse_year)
    movies["genre_list"] = movies["genres"].apply(parse_genres)
    movies["has_genres"] = movies["genre_list"].apply(bool)

    invalid_titles = (
        movies["clean_title"].isna()
        | movies["clean_title"].eq("")
    )

    excluded_movies = movies[invalid_titles].copy()
    excluded_movies["exclusion_reason"] = "Missing or blank title"

    processed_movies = movies[~invalid_titles].copy()

    return processed_movies, excluded_movies 