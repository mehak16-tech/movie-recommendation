
# Task 5: Feature Engineering — Summary and Results

## 1. Objective

Convert movie genre lists into numerical multi-hot feature vectors
for the KNN Movie Recommendation System.

## 2. Implementation

- Created `src/feature_engineering.py`.
- Reused the existing preprocessing pipeline.
- Used `MultiLabelBinarizer` from scikit-learn.
- Built a sorted, deterministic genre vocabulary.
- Kept movie IDs, titles, and release years separate from the
  numerical feature matrix.

## 3. Verified Results

- Original dataset records: 9,742.
- Eligible movies with genre information: 9,708.
- Movies without listed genres excluded from the feature matrix: 34.
- Unique genre features: 19.
- Feature matrix shape: (9708, 19).
- Feature values: 0 and 1 only.
- Movie IDs in the eligible catalogue: unique.

## 4. Genre Vocabulary

Action, Adventure, Animation, Children, Comedy, Crime, Documentary,
Drama, Fantasy, Film-Noir, Horror, IMAX, Musical, Mystery, Romance,
Sci-Fi, Thriller, War, Western.

## 5. Example: Toy Story (1995)

- Movie ID: 1.
- Genres: Adventure, Animation, Children, Comedy, Fantasy.
- Feature vector:
  [0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].

The vector follows the alphabetical genre vocabulary. A value of 1
indicates that the movie belongs to that genre; 0 indicates that it
does not.

## 6. Validation

The feature-engineering tests passed for:
- Binary feature values.
- Feature matrix dimensions.
- Correct genre encoding for Toy Story.
- Exclusion of movies without genres.
- Unique movie IDs.
- Reproducible encoding.
- Repeated titles remaining distinguishable.
- A manually constructed example.

## 7. Limitations

- Movies with identical genre lists can have identical feature vectors.
- Genre-only features do not capture plot, actors, directors, or user preferences.
- Correct encoding does not guarantee high-quality recommendations.
- KNN neighbor search and recommendation behavior are reserved for Task 6.

