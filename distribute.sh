TMP_DIR=dist/tmp
OUTPUT_FILE=dist/extension.zip

rm -f $OUTPUT_FILE
mkdir -p $TMP_DIR
cp -r images $TMP_DIR
cp contentScript.js $TMP_DIR
cp manifest.json $TMP_DIR

# zipping
pushd $TMP_DIR
zip -r ../extension.zip .
popd
rm -rf $TMP_DIR
