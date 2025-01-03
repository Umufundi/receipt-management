@echo off
echo Pushing updates to GitHub...

git add .
git commit -m "Update UI with modern design and holiday themes"
git push origin main

echo Updates pushed successfully!
pause 