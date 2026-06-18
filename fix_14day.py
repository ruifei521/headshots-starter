import os
import re

# Root directory
root = r"C:\Users\Administrator\WorkBuddy\2026-05-26-task-22\headshots-starter"

# Patterns to replace:
# "14-day satisfaction guarantee" -> "satisfaction guaranteed"
# "14-day guarantee" -> "satisfaction guaranteed"
# Also handle variations with different casing

patterns = [
    (r"14-day satisfaction guarantee", "satisfaction guaranteed"),
    (r"14-day guarantee", "satisfaction guaranteed"),
]

# File extensions to process
exts = {".tsx", ".ts", ".jsx", ".js", ".md", ".json"}

replaced_files = []

for dirpath, dirnames, filenames in os.walk(root):
    # Skip node_modules and .next
    dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".next", ".git", "out", "dist")]
    
    for fname in filenames:
        ext = os.path.splitext(fname)[1].lower()
        if ext not in exts:
            continue
        fpath = os.path.join(dirpath, fname)
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            
            original = content
            for pattern, replacement in patterns:
                content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
                # Also handle title case variations
                content = re.sub(pattern.title(), replacement.title(), content)
                content = re.sub(pattern.capitalize(), replacement.capitalize(), content)
            
            if content != original:
                with open(fpath, "w", encoding="utf-8") as f:
                    f.write(content)
                replaced_files.append(fpath.replace(root, "").lstrip("\\"))
        except Exception as e:
            print(f"Error processing {fpath}: {e}")

print(f"Replaced in {len(replaced_files)} files:")
for f in replaced_files:
    print(f"  - {f}")
