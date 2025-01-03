Write-Host "Pushing updates to GitHub..."

git add .
git commit -m "Update UI with modern design and holiday themes"
git push origin main

Write-Host "`nUpdates pushed successfully!"
pause 