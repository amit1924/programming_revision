#!/usr/bin/env python3
"""CLI helper to update the Master AWS course session database.

Usage:
  python3 session.py log "message" [--ch N] [--kind action]
  python3 session.py chapter <num> <status> [--note "text"]
  python3 session.py step add <priority> "description"
  python3 session.py step done <id>
  python3 session.py show
  python3 session.py meta <key> <value>
"""
import sqlite3
import os
import sys

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "course-session.db")


def connect():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


def cmd_log(args):
    con = connect()
    msg = args[0]
    ch = None
    kind = "action"
    i = 1
    while i < len(args):
        if args[i] == "--ch" and i + 1 < len(args):
            ch = int(args[i + 1]); i += 2
        elif args[i] == "--kind" and i + 1 < len(args):
            kind = args[i + 1]; i += 2
        else:
            i += 1
    con.execute("INSERT INTO session_log (kind, chapter_id, message) VALUES (?, ?, ?)", (kind, ch, msg))
    con.commit()
    print(f"logged [{kind}] ch={ch}: {msg}")
    con.close()


def cmd_chapter(args):
    con = connect()
    num = int(args[0]); status = args[1]
    note = None
    if "--note" in args:
        note = args[args.index("--note") + 1]
    con.execute(
        "UPDATE chapters SET status=?, notes=COALESCE(?, notes), completed_at=CASE WHEN ?='completed' THEN datetime('now') ELSE completed_at END, updated_at=datetime('now') WHERE num=?",
        (status, note, status, num),
    )
    con.execute("UPDATE meta SET value=? WHERE key='current_chapter'", (num,))
    con.commit()
    row = con.execute("SELECT title FROM chapters WHERE num=?", (num,)).fetchone()
    print(f"chapter {num} ({row['title']}) -> {status}")
    con.close()


def cmd_step(args):
    con = connect()
    if args[0] == "add":
        pri = int(args[1]); desc = args[2]
        con.execute("INSERT INTO next_steps (priority, status, description) VALUES (?, 'pending', ?)", (pri, desc))
        print("step added")
    elif args[0] == "done":
        sid = int(args[1])
        con.execute("UPDATE next_steps SET status='done', done_at=datetime('now') WHERE id=?", (sid,))
        print(f"step {sid} done")
    con.commit()
    con.close()


def cmd_meta(args):
    con = connect()
    con.execute("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)", (args[0], args[1]))
    con.commit()
    print(f"meta {args[0]} = {args[1]}")
    con.close()


def cmd_show():
    con = connect()
    print("=" * 60)
    print("CURRENT COURSE STATE")
    print("=" * 60)
    print("\n-- meta --")
    for r in con.execute("SELECT key, value FROM meta"):
        print(f"  {r['key']}: {r['value']}")
    print("\n-- chapters --")
    cur_raw = con.execute("SELECT value FROM meta WHERE key='current_chapter'").fetchone()["value"]
    try:
        cur_num = int(cur_raw)
    except (TypeError, ValueError):
        cur_num = None
    for r in con.execute("SELECT num, title, status, notes FROM chapters ORDER BY num"):
        mark = ">" if (cur_num is not None and r["num"] == cur_num) else " "
        print(f"  {mark}{r['num']:>2}. {r['title']:<32} {r['status']}")
        if r["notes"]:
            print(f"      note: {r['notes']}")
    print("\n-- next steps --")
    for r in con.execute("SELECT id, priority, status, description FROM next_steps ORDER BY status, priority DESC, id"):
        print(f"  [{r['id']}] {'P'+str(r['priority']):<2} {r['status']:<8} {r['description']}")
    print("\n-- recent session log --")
    for r in con.execute("SELECT id, ts, kind, chapter_id, message FROM session_log ORDER BY id DESC LIMIT 10"):
        print(f"  {r['ts']} [{r['kind']}] ch{r['chapter_id'] or '-'}: {r['message']}")
    con.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    cmd = sys.argv[1]
    args = sys.argv[2:]
    if cmd == "log":
        cmd_log(args)
    elif cmd == "chapter":
        cmd_chapter(args)
    elif cmd == "step":
        cmd_step(args)
    elif cmd == "meta":
        cmd_meta(args)
    elif cmd == "show":
        cmd_show()
    else:
        print("unknown command"); sys.exit(1)
