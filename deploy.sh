#!/data/data/com.termux/files/usr/bin/bash
set -e; cd ~/factory--force
git add -A
git commit -m "home: root/moss he/him + atlas xena" || true
git push origin main || echo "need: git remote add origin <url>"
npx vercel --prod --yes || true
