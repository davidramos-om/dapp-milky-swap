# abort on errors
set -e

cd client
# build
npm run build

# navigate into the build output directory
cd build

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

git push -f git@github.com:davidramos-om/dapp-milky-swap.git main:gh-pages

cd -