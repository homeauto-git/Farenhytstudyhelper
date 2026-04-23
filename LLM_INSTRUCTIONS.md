# LLM Instructions for Study Guide Site

These instructions are for any LLM modifying this project.
Follow them strictly.


## File handling rule
Read and use the existing `index.html` as the base. Modify it in place or refactor it carefully into the same project, but do not discard its structure and start over from a blank implementation unless that is absolutely necessary.


You are editing an existing GitHub Pages study-guide project from a provided zip file.

Your job is to **improve and expand the existing site** into a more complete study guide for a 3-day instructor-led Farenhyt course.

## Core objective

Use the files in the zip to build a stronger study-guide website that helps with:

* keynotes
* flashcards
* likely test questions and answers
* practical lab prep
* product understanding
* workflow understanding
* troubleshooting
* quick reference review

## Critical editing rule

* **Do not redesign or replace the current site from scratch.**
* Preserve Claude’s existing look, layout, theme, and overall interaction style as much as possible.
* Expand and improve the current site instead of rebuilding it.
* Keep the result recognizable as the same site, just much better and more complete.

## Project structure requirement

Use a clean separation between presentation and content.

### Required structure

* `index.html` = UI, layout, visible structure
* `data.json` = cleaned, structured study content
* `source-text.json` = deeper searchable source material derived from transcripts, manuals, slides, notes, and datasheets

You may also use:

* `app.js` for logic
* `style.css` for styling

Only split CSS or JS into separate files if it improves maintainability and does not break the existing site.

## Important technical rules

* **Do not use another HTML file as a database.**
* The content store must be JSON, not HTML.
* The site must remain fully static and compatible with GitHub Pages.
* No backend, no database server, and no build step required.
* Search must work client-side in the browser.

## What is in the zip

The zip contains source material such as:

* `index.html`

  * the existing study guide site

* `Instructor Led Sections/`

  * multiple section folders for course topics
  * these may include:

    * `Covered Slides/`
    * `SELF NOTES/`
    * `Transcripts/`

* `Data Sheets/`

  * product datasheets discussed during training

* `Manuals/`

  * manuals and product documents used in the course

## Meaning of the folders

Treat the material like this:

* `SELF NOTES`

  * my raw personal notes
  * highest signal for what I thought mattered

* `Transcripts`

  * speech-to-text lecture capture
  * useful for extra detail, explanations, repeated instructor emphasis, and likely testable content

* `Covered Slides`

  * official structure and topic sequencing

* `Manuals`

  * technical reference for accurate procedures and product details

* `Data Sheets`

  * quick specs, model comparisons, and product summaries

## Source priority

When extracting and generating study content, use sources in this priority order:

1. `SELF NOTES`
2. `Transcripts`
3. `Covered Slides`
4. `Manuals`
5. `Data Sheets`

## Original user intent

This site is based on this goal:

“I include my raw notes, transcript and the slides that were covered in this section. Can you make me some keynotes, flashcards, guess on what questions will be on the test and answers.

This is a three-day instructor-led virtual course.
The class covers introductions to the Farenhyt Series Black panels focusing on the IFP-2100, overview of the HFSS software, IFP Networking, and ECS products and programming for the IFP-2100ECS and IFP-300ECS.
Proficiency will be demonstrated by submitting 3 practical lab exercises to the instructor for evaluation and a multiple choice final exam that will be administered outside of the lecture.
Upon successful completion, attendees will receive a 1 year factory certification.”

Use that intent to guide the content.

## What to improve

The updated site should include significantly more useful study content, including:

* stronger section summaries
* cleaner keynotes
* more complete flashcards
* more likely exam questions
* answers with short explanations
* practical lab reminders
* troubleshooting notes
* quick-reference content
* product/model comparisons
* terminology and definitions
* procedure summaries
* common mistakes and exam traps
* memory aids where useful

## Course coverage

Do not focus on only one topic. Expand coverage across the course based on the folders present in the zip, including topics such as:

* Farenhyt Series Black overview
* IFP-2100
* HFSS software
* networking
* ECS
* IFP-2100ECS
* IFP-300ECS
* programming workflows
* any other clearly represented course sections in the provided material

## Content transformation rules

Do not dump raw notes into the page.

Instead:

* clean up rough notes into readable study content
* clean up speech-to-text transcript noise
* preserve technical meaning
* summarize repeated instructor emphasis into useful study points
* convert messy source material into polished exam-prep and field-reference content

When sources disagree:

* prefer the most accurate version supported by notes, slides, manuals, or datasheets
* do not invent facts
* if something is uncertain, phrase it cautiously

## Two-level search architecture

The site must support **two search modes**:

### 1. Default search

This should search `data.json` first and prioritize the clean study-guide material.

This is the primary experience and should be the default mode for the search bar.

It should search across:

* summaries
* keynotes
* flashcards
* exam questions
* definitions
* workflows
* troubleshooting notes
* product references
* tags
* keywords
* quick-reference items

### 2. Deep search

This should search `source-text.json` and provide broader matches from deeper source material.

Use this for:

* transcript-derived detail
* manual-derived detail
* slide-derived wording
* raw-note-derived detail
* datasheet-derived detail

Deep search should be available as a clear option, such as:

* a toggle
* a checkbox
* tabs
* a search mode switch

## Search priority behavior

The search experience must prioritize cleaned study material.

That means:

* the default search mode should search `data.json`
* results from `data.json` should be shown first
* deep source results from `source-text.json` should only appear when deep search is enabled, or should appear as a clearly separated secondary result group

Do not let raw transcript/manual results overwhelm the main study experience.

## Search behavior

The search should match and surface things like:

* section names
* product names
* model numbers
* terms and definitions
* procedures
* workflows
* flashcards
* likely exam questions
* troubleshooting notes
* lab reminders
* product references
* common mistakes

If possible, search results should:

* identify the match clearly
* label the source type
* reveal or navigate to the relevant section/tab/card
* feel useful and fast
* remain fully client-side

## Search implementation guidance

Use a static-site-friendly approach:

* load `data.json` and `source-text.json` in the browser with JavaScript
* query `data.json` for the main/default search
* query `source-text.json` only for deep search mode or as a secondary optional layer
* connect results back to the visible UI where possible

Do not rely only on searching visible DOM text.

## `data.json` expectations

`data.json` should contain the **cleaned, structured, high-value study content**.

It should not be a blind dump of raw source files.

Prefer content such as:

* section summaries
* notes
* flashcards
* exam questions
* answers and explanations
* key procedures
* troubleshooting items
* definitions
* comparison tables or comparison objects
* quick reference items
* keywords and tags

A section-oriented structure is preferred.

## `source-text.json` expectations

`source-text.json` should contain the **deeper searchable source material**.

This may include:

* lightly cleaned transcript excerpts
* manual excerpts
* slide-derived text
* raw-note-derived text
* datasheet excerpts
* instructor phrasing that may matter for exam prep
* exact terminology
* warnings
* settings
* procedural detail

This file can be broader and more text-heavy than `data.json`, but should still be organized and labeled.

Each entry should ideally include metadata such as:

* section
* source type
* topic
* product/model
* excerpt text
* keywords/tags if helpful

## Suggested data model

Use a structured model.

### Example content categories for `data.json`

* sections
* summaries
* keynotes
* flashcards
* examQuestions
* definitions
* workflows
* troubleshooting
* productReferences
* quickReference
* keywords
* tags

### Example content categories for `source-text.json`

* excerpts
* sourceType
* section
* topic
* model
* text
* keywords
* tags

## UI guidance

Preserve the current site style, but improve usefulness.

Good additions may include:

* “Most Testable Topics”
* “Lab Success Checklist”
* “Common Mistakes”
* “Workflow Cheat Sheet”
* “Terms You Must Know”
* “Model Comparison”
* “Quick Reference”
* “Practice Questions”
* “Flashcards”
* “Troubleshooting Notes”

## Styling rules

* Keep the current dark/technical/industrial feel if that is what the current site uses
* Do not do an unnecessary redesign
* Make the content easier to scan
* Prefer cards, grouped sections, accordions, tabs, and clean lists over giant text walls

## Output requirements

Return the updated project files needed for the static site, especially:

1. updated `index.html`
2. `data.json`
3. `source-text.json`
4. any supporting `app.js` and `style.css` only if needed

Also include a short implementation note describing:

* what you expanded
* how normal search works
* how deep search works
* which source folders most influenced the generated content

## Success criteria

The result is successful if it:

* keeps the current site recognizable
* significantly improves the depth and study value
* uses clean separation between UI and content
* uses `data.json` for prioritized clean study search
* uses `source-text.json` for optional deep search
* works as a fully static GitHub Pages site
* helps prepare for both lab submissions and the multiple-choice final exam
