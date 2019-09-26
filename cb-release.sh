#Read arguments
while getopts u:t:v: option
do
case "${option}"
in
u) username=${OPTARG};;
t) token=${OPTARG};;
v) version=${OPTARG};;

esac
done

if [ "$username" == "" ]; then
    echo "Missing username"
    exit 1
fi

if [ "$token" == "" ]; then
    echo "Missing token"
    exit 1
fi

if [ "$version" == "" ];
then
    echo "Missing version tag"

    # Get the last tag name
    tag=$(git describe --tags)

    # Get the full message associated with this tag
    message="$(git for-each-ref refs/tags/$tag --format='%(contents)')"

    # Get the title and the description as separated variables
    name=$(echo "$message" | head -n1)
    description=$(echo "$message" | tail -n +3)
    description=$(echo "$description" | sed 's/\n/\\n/g') # Escape line breaks to prevent json parsing problems

    echo " tag: $tag"
    echo " name: $name "
    echo " message $description"
else
    tag=$version
fi

# Publish on github
echo "Publishing on Github..."
repository="cryptobridge-ui"
PATH="build/binaries/"
APP="CryptoBridge"
ver=${tag/v/}
artifact_WIN="${APP}-${ver}-Setup.exe"
artifact_MAC="${APP}-${ver}.dmg"
artifact_LIN="${APP}-${ver}-amd64.deb"

echo "username $username"
echo "token $token"
echo "repository $repository"
echo "artifact_WIN $artifact_WIN"
echo "artifact_MAC $artifact_MAC"
echo "artifact_LIN $artifact_LIN"

# Create a release
release=$(curl -XPOST -H "Authorization:token $token" --data "{\"tag_name\": \"$tag\", \"target_commitish\": \"master\", \"name\": \"$name\", \"body\": \"$description\", \"draft\": false, \"prerelease\": false}" https://api.github.com/repos/$username/$repository/releases | jq -r '.upload_url')
echo " release: $release "

# Extract the upload path (including id) of the release from the creation response
upload_url="${release%\{*}"
echo " upload url $upload_url"

# Upload the artifact
curl -XPOST -H "Authorization:token $token" -H "Content-Type:application/octet-stream" --data-binary @"$PATH/$artifact_WIN" $upload_url?name=$artifact_WIN
curl -XPOST -H "Authorization:token $token" -H "Content-Type:application/octet-stream" --data-binary @"$PATH/$artifact_MAC" $upload_url?name=$artifact_MAC
curl -XPOST -H "Authorization:token $token" -H "Content-Type:application/octet-stream" --data-binary @"$PATH/$artifact_LIN" $upload_url?name=$artifact_LIN
