:: stackoverflow.com/questions/17063947/get-current-batchfile-directory
:: echo %~dp0 will return path to batch location. echo %~f0 will return path to the batch with filename

:: ruby -run -e httpd "%~dp0/" -p 8080
ruby -run -e httpd "%~dp0/" -p 8080
pause
