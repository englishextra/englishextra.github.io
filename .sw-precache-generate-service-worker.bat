sw-precache --root=./ --config=./sw-precache-config.js --verbose && ren "%~dp0service-worker.js" "service-worker.min.js" && uglifyjs "%~dp0service-worker.min.js" --compress -o "%~dp0service-worker.min.js"

pause
