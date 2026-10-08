import os

# Render and cloud platforms dynamically assign $PORT (defaults to 10000 on Render)
port = os.environ.get("PORT", "10000")
bind = f"0.0.0.0:{port}"

# Worker processes and threads
workers = int(os.environ.get("WEB_CONCURRENCY", "2"))
threads = 4
timeout = 120

# Direct access & error logs to stdout/stderr so Render live console displays them immediately
accesslog = "-"
errorlog = "-"
loglevel = "info"
