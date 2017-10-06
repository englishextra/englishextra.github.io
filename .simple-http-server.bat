:: stackoverflow.com/questions/17063947/get-current-batchfile-directory
:: echo %~dp0 will return path to batch location. echo %~f0 will return path to the batch with filename

:: python -m SimpleHTTPServer 8080
cd "%~dp0" && python -m SimpleHTTPServer 8080
pause
