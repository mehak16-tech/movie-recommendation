# Task 6: KNN Recommendation Engine — Summary and Results

**Project:** KNN Movie Recommendation System  
**Dataset:** MovieLens Latest Small

## 1. Objective

The objective of Task 6 was to build a reusable KNN-based movie recommendation engine using the genre features created in Task 5.

The engine accepts a movie title, finds movies with similar genre vectors, excludes the selected movie, and returns up to five recommendations by default.

## 2. Implementation

Created `src/recommender.py` with a `MovieRecommender` class.

The implementation reuses:
- `load_movies()` from `src/data_processing.py`
- `preprocess_movies()` from `src/data_processing.py`
- `build_genre_features()` from `src/feature_engineering.py`

The model uses scikit-learn's `NearestNeighbors` with cosine distance and the brute-force search algorithm.

The model is fitted once during initialization and reused for subsequent recommendation requests.

## 3. Dataset and Feature Results

- Original movie records: 9,742
- Processed movie records: 9,742
- Eligible movies with listed genres: 9,708
- Movies without listed genres: 34
- Unique genre features: 19
- Feature matrix shape: `(9708, 19)`

Movies without listed genres remain in the processed metadata but are excluded from the initial genre-based recommendation catalogue.

## 4. Actual Recommendation Results

The following results were observed when running the recommendation engine.

### Toy Story (1995)

Five recommendations were returned:
- Antz (1998)
- The Tale of Despereaux (2008)
- Shrek the Third (2007)
- Adventures of Rocky and Bullwinkle, The (2000)
- The Good Dinosaur (2015)

All five recommendations had cosine distance `0.0`.

### Jumanji (1995)

Five recommendations were returned:
- Bridge to Terabithia (2007)
- Darby O'Gill and the Little People (1959)
- NeverEnding Story III, The (1994)
- NeverEnding Story, The (1984)
- Alice in Wonderland (1933)

All five recommendations had cosine distance `0.0`.

### Heat (1995)

Five recommendations were returned:
- Dirty Harry (1971)
- Assassins (1995)
- Eye for an Eye, An (1981)
- Brother (2000)
- Furious 7 (2015)

All five recommendations had cosine distance `0.0`.

These are observed model outputs, not hardcoded recommendation lists.

## 5. Interpretation

A cosine distance of zero indicates identical nonzero genre vectors for the selected movie and the recommended movie.

The results demonstrate that the model retrieves movies with matching genre features. They do not establish that the movies have similar plots, tone, quality, or audience appeal.

## 6. Input Handling

The recommendation function:
- Rejects empty or invalid titles.
- Raises an error when a movie title is unknown.
- Detects ambiguous titles instead of silently selecting the first match.
- Rejects non-integer, zero, and negative recommendation counts.
- Excludes the selected movie using its unique `movieId`.
- Returns a pandas DataFrame with `movieId`, `title`, `genres`, and `distance`.

## 7. Testing

The preprocessing, feature-engineering, and recommender test files were run together.

**Observed result:** 25 tests passed.

The tests cover movie selection, invalid inputs, recommendation counts, self-exclusion, distance ordering, and preservation of movie metadata.

## 8. Limitations

- Recommendations use genre features only.
- Identical genre vectors can produce distance zero for different movies.
- The model does not use ratings, plot descriptions, cast, or user preferences.
- Recommendation quality has not been formally evaluated against a benchmark.
- Cosine distance has not yet been compared experimentally with alternative metrics.

## 9. Conclusion

Task 6 implemented a reusable nearest-neighbor recommendation engine that builds on the existing preprocessing and feature-engineering pipeline.

The engine successfully generated recommendations for Toy Story (1995), Jumanji (1995), and Heat (1995), and the combined automated test run reported 25 passing tests.
