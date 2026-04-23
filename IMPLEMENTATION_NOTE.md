# Implementation note

Expanded the original single-file study guide into a static GitHub Pages-friendly project with:

- `index.html` for layout and visible structure
- `style.css` for the preserved dark technical styling
- `app.js` for client-side rendering and search logic
- `data.json` for cleaned, prioritized study material
- `source-text.json` for deeper searchable excerpts from notes, transcripts, slides, manuals, and datasheets

## What was expanded

- Added a real overview page
- Expanded section coverage across IFP keypad programming, HFSS, networking, ECS, product references, and certification prep
- Added more structured keynotes, flashcards, practice questions, lab checklists, troubleshooting notes, definitions, and quick-reference items
- Preserved the original interaction style: dark theme, tabbed layout, cards, search overlay, flashcards, and practice questions

## How normal search works

Default search queries `data.json` only.

It searches cleaned study-guide content such as:

- keynotes
- flashcards
- practice questions
- definitions
- workflows
- troubleshooting notes
- quick reference items
- keywords

This keeps the main study experience focused on high-value cleaned content instead of raw source text.

## How deep search works

Deep search queries `source-text.json`.

It surfaces broader source excerpts from:

- SELF NOTES
- transcripts
- covered slides
- manuals
- datasheets

Deep search results are clearly separated and labeled with their source type and source path.

## Most influential source folders

Primary influence followed the requested priority:

1. `Instructor Led Sections/THE BASICS OF PROGRAMMING/SELF NOTES`
2. `Instructor Led Sections/HFSS SOFTWARE/SELF NOTES`
3. `Instructor Led Sections/Networking/SELF NOTES`
4. related transcripts in those same section folders
5. covered slide PDFs for programming, HFSS, and networking
6. ECS manuals and datasheets
7. panel, SK-NIC, and expansion datasheets
