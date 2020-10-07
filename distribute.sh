tmp_dir=dist/tmp
mkdir -p $tmp_dir
cp images $tmp_dir
cp contentScript.js $tmp_dir
cp manifest.json $tmp_dir
tar -c -a -f dist/extension.zip $tmp_dir
rm -rf $tmp_dir
