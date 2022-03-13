# Run with:
# $ bash ./logrocket-deploy.sh
#

# import local dotenv file
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

# declare the manifest semver from package.json
MANIFEST_SEMVER=$(node -p -e "require('./package.json').version")

# deploy a formal logrocket release
npx logrocket release "$MANIFEST_SEMVER" --apikey="$LOGROCKET_API_KEY"

# upload source_maps to logrocket release
npx logrocket upload iife --release="$MANIFEST_SEMVER" --apikey="$LOGROCKET_API_KEY"