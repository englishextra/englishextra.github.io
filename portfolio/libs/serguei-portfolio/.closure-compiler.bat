java -jar D:\WebTools\closure-compiler\compiler.jar --charset UTF-8 --js "%~dp0js\bundle.js" --create_source_map "%~dp0js\bundle.min.js.map" --source_map_format=V3 --js_output_file "%~dp0js\bundle.min.js"
echo.//# sourceMappingURL=bundle.min.js.map>>%~dp0js\bundle.min.js
