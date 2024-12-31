@echo off
echo Deploying to GitHub Pages...

:: Create and switch to gh-pages branch
git checkout -b gh-pages

:: Add all files
git add .

:: Commit changes
git commit -m "Deploy to GitHub Pages"

:: Push to GitHub
git push origin gh-pages

:: Switch back to main branch
git checkout main

echo.
echo Deployment completed!
echo Website should be available at: https://umufundi.github.io/receipt-management
echo Note: It may take a few minutes for the site to be accessible
echo.
echo Press any key to exit...
pause > nul 