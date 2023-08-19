/bin/bash -xe

rev=$(git rev-parse --short HEAD | tr -d "\n")

node build

git checkout gh-pages

cp -a dist/* .

git add -A .
git commit -m "Publish: '${rev}'"
git push git@github.com:forwardfeed/unc.git --force

git checkout main
