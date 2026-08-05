# Excel Course - Learning Context

## Project Overview
Creating beautiful HTML chapter notes from an Excel for Data Analytics course transcript (dat nerds / Luke). The transcript is at `/home/amit/Desktop/Excel Course/transcript.txt`.

## The 8 Chapters (from transcript)

| # | Chapter | Topics |
|---|---------|--------|
| 1 | **Spreadsheets Intro** | Worksheets, cells, rows/columns, data entry, autofill, Boolean values, dates, copy/paste, formulas (=), cell references, ranges, workbooks, ribbon/home/insert/data/view tabs, freeze panes, shortcuts |
| 2 | **Formulas & Functions** | Math operators (+, -, *, /), comparison operators (=, >, <, >=, <=, <>), relative/absolute/mixed references ($), functions (AVERAGE, COUNT, COUNTIF, AND, SUM, etc.), function library, text/logical/lookup/math/date functions, order of operations, error troubleshooting |
| 3 | **Charts** | Line charts (trends over time), pie charts (proportions), bar/column charts, scatter plots, map charts, histograms, box & whisker, sparklines, chart elements (titles, axes, legends, data labels, trendlines), customization |
| 4 | **Advanced Spreadsheets** | Tables (Ctrl+T), structured references, table formulas (@column), totals row, slicers, conditional formatting, cell styles, collaboration, protection, dashboard building |
| 5 | **Pivot Tables** | Creating pivot tables, rows/columns/values/filters, aggregation (count, sum, avg), grouping, percentages of grand total, pivot charts, filtering, slicers with pivots |
| 6 | **Advanced Data Analysis** | Add-ins (Solver, Analysis ToolPak), forecasting sheets, what-if analysis (scenario manager, goal seek, data tables), statistical analysis, moving averages |
| 7 | **Power Query** | ETL (Extract, Transform, Load), connecting to data sources (Excel, web, CSV), power query editor, data cleaning/transformation, merging/combining queries, M language basics |
| 8 | **Power Pivot** | Data modeling, relationships between tables, DAX language (measures, calculated columns), KPIs, data model management, skills-per-job analysis |

## HTML Notes Format
- Dark theme with 7 colors (one per chapter)
- Tailwind CSS for styling
- Font Awesome for icons
- Fully responsive on mobile (no zoom needed)
- Excel cell visualizations rendered as HTML tables showing actual cell content
- Simple explanations in plain language
- Each chapter = one HTML file

## Output Location
`/home/amit/Desktop/Excel Course/notes/`

## File Naming
- `context.md` — this file
- `memory.db` — SQLite database for context
- `ch01-spreadsheets-intro.html` — Chapter 1
- `ch02-formulas-functions.html` — Chapter 2
- `ch03-charts-visualizations.html` — Chapter 3
- `ch04-advanced-spreadsheets.html` — Chapter 4
- `ch05-pivot-tables.html` — Chapter 5
- `ch06-advanced-data-analysis.html` — Chapter 6
- `ch07-power-query.html` — Chapter 7 *(not yet built)*
- `ch08-power-pivot.html` — Chapter 8 *(not yet built)*
- `ribbon-reference-interactive.html` — Interactive Ribbon reference (27 demos)
- `50-formulas.html` — 50 essential Excel formulas with interactive practice engine

## Cell Example Convention
Render Excel cells as HTML tables like:
```
| A | B | C |
|---|---|---|
| Skill | Difficulty | Formula |
| Excel | =B2*2 | 8 |
```
This helps visualize what the instructor is showing.
