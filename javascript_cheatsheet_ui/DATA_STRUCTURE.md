# JavaScript Cheatsheet Data Structure

## questions.json
Root object with:
- `chapters`: Array of 10 chapter objects
- `allQuestions`: Flat array of all 478 questions

### Chapter object:
- `id` (string): chapter id ex: "ch01"
- `title` (string): chapter title
- `icon` (string): Font Awesome icon class
- `color` (string): theme color key
- `desc` (string): chapter description
- `start` / `end`: question index range
- `qStart` / `qEnd`: question number range
- `count`: number of questions
- `questions`: array of question objects

### Question object:
- `id` (number): question number (1-478)
- `text` (string): question text
- `answer` (string): detailed answer (Markdown-friendly)
- `code` (string): code example
- `demo` (object): demo configuration
  - `type` (string): demo type
  - `label` (string): button label
  - `options` (array): interactive options
