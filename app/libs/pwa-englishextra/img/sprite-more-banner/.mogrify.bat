:: mogrify -format png -background rgba(0,0,0,0) *.svg
mogrify -format png -type palettealpha *.svg
:: mogrify -format png -type palettealpha -background rgba(0,0,0,0) *.svg
:: mogrify -format jpg -strip -interlace JPEG -colorspace sRGB -quality 80 *.svg
:: mogrify -format jpg -strip -interlace JPEG -colorspace sRGB -quality 80 *.jpg
