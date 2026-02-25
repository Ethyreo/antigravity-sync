@echo off
set "SYNC_DIR=%~dp0"
set "EXT_DIR_WIN=%USERPROFILE%\.antigravity\extensions"
set "USER_DIR_WIN=%APPDATA%\Antigravity\User"

echo Syncing extensions...
mkdir "%SYNC_DIR%extensions" 2>nul
xcopy /E /I /Y "%EXT_DIR_WIN%\extensions.json" "%SYNC_DIR%extensions\"

echo Syncing user settings...
mkdir "%SYNC_DIR%User" 2>nul
xcopy /E /I /Y "%USER_DIR_WIN%\*" "%SYNC_DIR%User\"

echo Done!
