# Task 4: Data Preprocessing

## Objective
Prepare the MovieLens Latest Small movie metadata for genre-based feature engineering while preserving movie identifiers and the original dataset.

## Preprocessing Decisions

- **Data loading:** Load `movies.csv` using a project-relative path and verify the required columns.
- **Title cleaning:** Remove leading and trailing whitespace into a separate `clean_title` column. Preserve the original `title`.
- **Invalid titles:** Exclude missing or blank titles from the processed catalogue and record their exclusion reason separately.
- **Release years:** Extract a four-digit year in parentheses at the end of a title. Unmatched years remain missing; no years are guessed.
- **Genres:** Split valid pipe-separated genre strings into individual labels. Missing, empty, and `(no genres listed)` values become empty genre lists.
- **Unlisted genres:** Retain these movies in the processed metadata and mark them with `has_genres = False`. They will be excluded from the initial genre-based recommendation catalogue.
- **Repeated titles:** Preserve records with different `movieId` values. Do not remove records based only on title similarity.
- **Raw data:** Keep the original CSV unchanged.

## Actual Results

- Original records: 9,742
- Processed records: 9,742
- Excluded records: 0
- Movies with usable genres: 9,708
- Movies without usable genres: 34
- Duplicate movie IDs: 0
- Repeated cleaned titles: 5
- Missing parsed years: 13

## Limitations

- Release-year extraction handles only four-digit years in parentheses at the end of a title.
- Title and year may not uniquely identify a movie; `movieId` remains the record identifier.
- Genre multi-hot encoding and the KNN recommendation model are deferred to Task 5 and later tasks.
