#!/usr/bin/env python3
"""Initialize the Master AWS course session database."""
import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "course-session.db")

con = sqlite3.connect(DB_PATH)
cur = con.cursor()

cur.executescript("""
CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS chapters (
    id         INTEGER PRIMARY KEY,
    num        INTEGER NOT NULL,
    title      TEXT NOT NULL,
    slug       TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'pending',  -- pending | in_progress | completed
    completed_at TEXT,
    notes      TEXT DEFAULT '',
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS session_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    ts         TEXT DEFAULT (datetime('now')),
    kind       TEXT NOT NULL,               -- action | concept | note | decision
    chapter_id INTEGER,
    message    TEXT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

CREATE TABLE IF NOT EXISTS next_steps (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    priority   INTEGER NOT NULL DEFAULT 0,  -- 0=low 1=med 2=high
    status     TEXT NOT NULL DEFAULT 'pending',  -- pending | done
    description TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    done_at    TEXT
);
""")

# ---- Seed meta ----
meta = {
    "course_title": "Master AWS - Complete DevOps Course (Floci Edition)",
    "source_video": "https://youtu.be/UcxXSHDDUE8",
    "source_video_title": "Full AWS DevOps Course for 2026 (Boot.dev / Zach Gates)",
    "emulator": "Floci 1.6.0 @ http://localhost:4566",
    "course_dir": "/home/amit/Desktop/aws-course",
    "local_server": "http://localhost:8899",
    "teaching_mode": "one chapter at a time, hands-on with Floci",
    "current_chapter": "1",
    "created": "2026-08-07",
}
for k, v in meta.items():
    cur.execute("INSERT OR IGNORE INTO meta (key, value) VALUES (?, ?)", (k, v))

# ---- Seed chapters ----
chapters = [
    (1,  "Cloud Computing",             "chapter-01", "completed",  "Created interactive HTML chapter with terminal sims; verified responsive (no x-scroll on mobile); ran live: floci status, aws sts get-caller-identity, aws s3 mb, aws s3 ls."),
    (2,  "Networking - VPC",            "chapter-02", "in_progress", "Next to teach. NOTE: Floci does NOT support VPC - must teach concept + real-AWS/LocalStack warning."),
    (3,  "EC2 - Elastic Compute Cloud", "chapter-03", "pending",    "Floci supports EC2 (real Docker containers, SSH keys, UserData, IMDS)."),
    (4,  "RDS - Relational Database",   "chapter-04", "pending",    "Floci supports RDS (Postgres/MySQL/MariaDB + IAM)."),
    (5,  "IAM - Identity & Access",     "chapter-05", "pending",    "Floci supports IAM (68+ ops)."),
    (6,  "Monitoring - CloudWatch",     "chapter-06", "pending",    "Floci supports CloudWatch Logs + Metrics."),
    (7,  "DNS - Route 53",              "chapter-07", "pending",    "Floci supports Route 53 (REST XML)."),
    (8,  "S3 - Object Storage",         "chapter-08", "pending",    "Floci fully supports S3."),
    (9,  "CDN - CloudFront",            "chapter-09", "pending",    "Floci supports CloudFront API (no real edge network)."),
    (10, "ECS - Containers",            "chapter-10", "pending",    "Floci supports ECS (real Docker containers)."),
    (11, "Lambda - Serverless",         "chapter-11", "pending",    "Floci supports Lambda (real Docker execution)."),
]
for num, title, slug, status, notes in chapters:
    cur.execute(
        "INSERT OR IGNORE INTO chapters (num, title, slug, status, notes) VALUES (?, ?, ?, ?, ?)",
        (num, title, slug, status, notes),
    )

# ---- Seed session log (history of what we did) ----
history = [
    (1, "Installed Floci CLI v0.2.0 to ~/.local/bin (via install.sh, FLOCI_INSTALL_DIR because /usr/local/bin needed sudo)"),
    (1, "Ran floci doctor - Docker ok, port 4566 free"),
    (1, "Ran floci start - pulled floci/floci:latest, started container, ready @ http://localhost:4566"),
    (1, "Checked video transcript availability - video has no public captions; using chapter structure + instructor knowledge"),
    (1, "Checked course compatibility: VPC not supported by Floci; all other chapters (2-11) work with caveats"),
    (1, "Built course site in ~/Desktop/aws-course: index.html, style.css, app.js, chapter-01.html"),
    (1, "Design: Tailwind CSS + Font Awesome 6 + dark theme + responsive + animated terminal simulators + quizzes"),
    (1, "Ran Chapter 1 commands live against Floci: health check, sts get-caller-identity, s3 mb my-first-bucket, s3 ls"),
    (1, "Fixed mobile responsive bug: grid items had min-width:auto causing x-scroll; added min-width:0, overflow-wrap, body overflow-x:hidden"),
    (1, "Verified no horizontal overflow at 320/390/1280px; sim animations + mobile nav burger work"),
    (1, "Started local HTTP server on port 8899 for viewing the course"),
]
for ch, msg in history:
    cur.execute(
        "INSERT INTO session_log (kind, chapter_id, message) VALUES ('action', ?, ?)",
        (ch, msg),
    )

# ---- Seed next steps ----
steps = [
    (2, 2, "Teach Chapter 1 recap - confirm student satisfied, then build Chapter 2 (Networking - VPC) HTML + teach hands-on"),
    (1, 1, "Remind student of course URL http://localhost:8899 and how to open on phone (use LAN IP for phone access)"),
    (1, 2, "For Chapter 2 (VPC): Floci lacks VPC support - present concept + alternatives (real AWS free tier / LocalStack)"),
]
for pri, status, desc in steps:
    cur.execute(
        "INSERT INTO next_steps (priority, status, description) VALUES (?, ?, ?)",
        (pri, "pending", desc),
    )

con.commit()

# ---- Print summary ----
print("=== DATABASE CREATED:", DB_PATH, "===\n")
print("--- meta ---")
for row in cur.execute("SELECT key, value FROM meta"):
    print(f"  {row[0]}: {row[1]}")
print("\n--- chapters ---")
for row in cur.execute("SELECT num, title, status FROM chapters ORDER BY num"):
    print(f"  {row[0]:>2}. {row[1]:<32} {row[2]}")
print("\n--- session_log count ---")
print(" ", cur.execute("SELECT COUNT(*) FROM session_log").fetchone()[0], "entries")
print("\n--- next_steps (pending) ---")
for row in cur.execute("SELECT priority, description FROM next_steps WHERE status='pending' ORDER BY priority DESC"):
    print(f"  [{row[0]}] {row[1]}")

con.close()
