import os
import re

root = r"C:\Users\Administrator\WorkBuddy\2026-05-26-task-22\headshots-starter"

# Extended patterns - case insensitive
patterns = [
    (r"14-Day Money-Back Guarantee", "Satisfaction Guaranteed"),
    (r"14-day Money-Back Guarantee", "satisfaction guaranteed"),
    (r"14-Day Money Back Guarantee", "Satisfaction Guaranteed"),
    (r"14-day money-back guarantee", "satisfaction guaranteed"),
    (r"14-day unconditional refund guarantee", "satisfaction guaranteed"),
]

exts = {".tsx", ".ts", ".jsx", ".js", ".md", ".json"}
replaced_files = []

for dirpath, dirnames, filenames in os.walk(root):
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
                # Replace all case variations
                content = re.sub(re.escape(pattern), replacement, content, flags=re.IGNORECASE)
            
            if content != original:
                with open(fpath, "w", encoding="utf-8") as f:
                    f.write(content)
                replaced_files.append(fpath.replace(root, "").lstrip("\\"))
        except Exception as e:
            print(f"Error processing {fpath}: {e}")

print(f"Replaced in {len(replaced_files)} files:")
for f in replaced_files:
    print(f"  - {f}")
