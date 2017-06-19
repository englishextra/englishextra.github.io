:: mogrify -format png -background rgba(0,0,0,0) *.svg
mogrify -format png -type palettealpha *.svg
:: mogrify -format png -type palettealpha -background rgba(0,0,0,0) *.svg
:: mogrify -format jpg -interlace plane -quality 74 *.svg
:: mogrify -format jpg -interlace plane -quality 74 *.jpg
