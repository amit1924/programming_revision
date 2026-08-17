#!/usr/bin/env python3
import sqlite3
import os
import re
from html.parser import HTMLParser

AGENTS_DIR = "/home/amit/Desktop/Agentic-AI"
DB_PATH = os.path.join(AGENTS_DIR, "sqlite.db")

# Chapter ordering and structure
CHAPTER_FILES = [
    ("chapter-1-introduction-to-agents.html", "Chapter 1", "Introduction to Agents", 1, None),
    ("chapter-1-part2-models-async-realworld.html", "Chapter 1", "Models, Async & Real-World", 1, "Part 2"),
    ("chapter-1-part3-workflows-agents-architecture.html", "Chapter 1", "Workflows, Agents & Architecture", 1, "Part 3"),
    ("chapter-2-agentic-frameworks.html", "Chapter 2", "Agentic Frameworks", 2, None),
    ("chapter-2-part2-designing-agent-systems.html", "Chapter 2", "Designing Agent Systems", 2, "Part 2"),
    ("chapter-2-part3-tools-memory-orchestration.html", "Chapter 2", "Tools, Memory & Orchestration", 2, "Part 3"),
    ("chapter-3-ux-for-ai-agents.html", "Chapter 3", "UX for AI Agents", 3, None),
    ("chapter-3-part2-gui-voice-video.html", "Chapter 3", "GUI, Voice & Video", 3, "Part 2"),
    ("chapter-3-part3-combining-interfaces.html", "Chapter 3", "Combining Interfaces", 3, "Part 3"),
    ("chapter-4-tool-use.html", "Chapter 4", "Tool Use", 4, None),
    ("chapter-4-part2-mcp-security-advanced.html", "Chapter 4", "MCP, Security & Advanced Topics", 4, "Part 2"),
    ("chapter-5-orchestration.html", "Chapter 5", "Orchestration", 5, None),
]

CHAPTER_DESCRIPTIONS = {
    1: "What agents are, how they think, the models that power them, async patterns, and production deployment.",
    2: "Frameworks for building agents, system design patterns, tools integration, memory systems, and orchestration strategies.",
    3: "Designing interfaces for AI agents — GUI, voice, video, and combining multiple modalities.",
    4: "How agents use tools, the Model Context Protocol (MCP), security considerations, and advanced tool patterns.",
    5: "Orchestrating multi-agent systems, workflows, coordination patterns, and scalable architectures.",
}

CHAPTER_ICONS = {
    1: "fa-robot",
    2: "fa-layer-group",
    3: "fa-desktop",
    4: "fa-wrench",
    5: "fa-network-wired",
}

CHAPTER_COLORS = {
    1: ("#00d2ff", "#a855f7"),
    2: ("#f97316", "#f472b6"),
    3: ("#34d399", "#38bdf8"),
    4: ("#facc15", "#fb923c"),
    5: ("#c084fc", "#f472b6"),
}


class TopicExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.topics = []
        self.current_tag = None
        self.skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ("h1", "h2", "h3"):
            self.current_tag = tag
        if tag in ("script", "style"):
            self.skip = True

    def handle_endtag(self, tag):
        if tag in ("h1", "h2", "h3"):
            self.current_tag = None
        if tag in ("script", "style"):
            self.skip = False

    def handle_data(self, data):
        if self.current_tag in ("h2", "h3") and not self.skip:
            text = data.strip()
            if text and len(text) > 3:
                self.topics.append({"level": self.current_tag, "text": text})


def extract_topics(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        extractor = TopicExtractor()
        extractor.feed(content)
        return extractor.topics, content
    except Exception as e:
        print(f"  Error reading {filepath}: {e}")
        return [], ""


def create_database():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("""
        CREATE TABLE chapters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chapter_num INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            color_start TEXT,
            color_end TEXT,
            topic_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE parts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chapter_id INTEGER NOT NULL,
            part_label TEXT,
            title TEXT NOT NULL,
            filename TEXT NOT NULL,
            topic_count INTEGER DEFAULT 0,
            sort_order INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chapter_id) REFERENCES chapters(id)
        )
    """)

    c.execute("""
        CREATE TABLE topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            part_id INTEGER NOT NULL,
            level TEXT NOT NULL,
            text TEXT NOT NULL,
            sort_order INTEGER NOT NULL,
            FOREIGN KEY (part_id) REFERENCES parts(id)
        )
    """)

    # Insert chapters
    chapter_ids = {}
    for ch_num in sorted(CHAPTER_DESCRIPTIONS.keys()):
        c.execute(
            """INSERT INTO chapters (chapter_num, title, description, icon, color_start, color_end)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                ch_num,
                f"Chapter {ch_num}",
                CHAPTER_DESCRIPTIONS[ch_num],
                CHAPTER_ICONS[ch_num],
                CHAPTER_COLORS[ch_num][0],
                CHAPTER_COLORS[ch_num][1],
            ),
        )
        chapter_ids[ch_num] = c.lastrowid

    # Insert parts and topics
    for filename, ch_label, topic_title, ch_num, part_label in CHAPTER_FILES:
        filepath = os.path.join(AGENTS_DIR, filename)
        topics, raw_content = extract_topics(filepath)

        part_title = f"{ch_label}: {topic_title}"
        if part_label:
            part_title = f"{ch_label} {part_label} — {topic_title}"

        c.execute(
            """INSERT INTO parts (chapter_id, part_label, title, filename, topic_count, sort_order)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (chapter_ids[ch_num], part_label or "Part 1", part_title, filename, len(topics), 0),
        )
        part_id = c.lastrowid

        for i, t in enumerate(topics):
            c.execute(
                """INSERT INTO topics (part_id, level, text, sort_order) VALUES (?, ?, ?, ?)""",
                (part_id, t["level"], t["text"], i),
            )

    # Update topic counts
    c.execute("""
        UPDATE parts SET topic_count = (
            SELECT COUNT(*) FROM topics WHERE topics.part_id = parts.id
        )
    """)
    c.execute("""
        UPDATE chapters SET topic_count = (
            SELECT SUM(topic_count) FROM parts WHERE parts.chapter_id = chapters.id
        )
    """)

    # Update sort_order for parts
    c.execute("SELECT id, chapter_id FROM parts ORDER BY chapter_id, id")
    parts = c.fetchall()
    for i, (part_id, _) in enumerate(parts):
        c.execute("UPDATE parts SET sort_order = ? WHERE id = ?", (i, part_id))

    conn.commit()

    # Print summary
    c.execute("SELECT chapter_num, title, topic_count FROM chapters ORDER BY chapter_num")
    print("=== Chapters ===")
    for row in c.fetchall():
        print(f"  {row[0]}: {row[1]} ({row[2]} topics)")

    c.execute("""
        SELECT c.chapter_num, p.part_label, p.title, p.topic_count
        FROM parts p JOIN chapters c ON p.chapter_id = c.id
        ORDER BY c.chapter_num, p.sort_order
    """)
    print("\n=== Parts ===")
    for row in c.fetchall():
        print(f"  Ch{row[0]} [{row[1]}]: {row[2]} ({row[3]} topics)")

    c.execute("SELECT COUNT(*) FROM topics")
    total_topics = c.fetchone()[0]
    print(f"\nTotal: {len(CHAPTER_FILES)} parts, {total_topics} topics")

    conn.close()
    print(f"\nDatabase created: {DB_PATH}")


if __name__ == "__main__":
    create_database()
