for value in 16x16 32x32 48x48 128x128
do
    magick images_raw/android-chrome-512x512.png -resize $value^ images/favicon-$value.png
done



