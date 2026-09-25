#!/data/data/com.termux/files/usr/bin/bash
set -e; cd ~/factory--force
git add -A; git commit -m "home: root/moss he/him + atlas xena deploy execyul" || true
git push origin main || echo "git remote add origin <url> first"
npx vercel --prod --yes || true
