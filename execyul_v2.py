# ./factory--force / execyul_v2.py - ORIGINAL UNTOUCHED CORE
import json, time, subprocess
from pathlib import Path
HOME = Path(__file__).parent
MANIFEST = HOME / "root" / "manifest.json"
print("execyul> YYZ06 // ORIGINAL CORE ONLINE // RIGHT HAND")
LITTLE_ONES = ["gmail_watcher","telegram_bot","clone_mgr","tunnel_keeper"]
def root_learn(note):
    data = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else []
    data.append({"ts":time.time(),"note":note,"id":len(data)})
    MANIFEST.parent.mkdir(exist_ok=True)
    MANIFEST.write_text(json.dumps(data,indent=2))
    print(f"ROOT +1 particle // total {len(data)}")
if __name__ == "__main__":
    while True:
        try:
            c=input("execyul> ")
            if c in ("exit","quit"): break
            if c.startswith("learn "): root_learn(c[6:])
            else: print(f"VOID wrapping: {c} -> {LITTLE_ONES}")
        except: break
