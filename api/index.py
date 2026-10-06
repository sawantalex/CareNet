import sys
import os

# Absolute path to backend directory
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.abspath(os.path.join(root_dir, "backend"))

# Insert backend directory FIRST so 'from app.config import ...' resolves cleanly
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if root_dir not in sys.path:
    sys.path.insert(1, root_dir)

from app.main import app
