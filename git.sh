cd _book
git init
git add .
git commit -m 'update: 完善工作总结'
git push -f git@github.com:TOMGOU/work-summary.git master:gh-pages
cd ../

# git push origin `git subtree split --prefix _book master`:gh-pages --force 
