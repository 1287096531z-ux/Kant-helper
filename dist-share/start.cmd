@echo off
cd /d %~dp0
set HOSTNAME=0.0.0.0
if "%PORT%"=="" set PORT=3000
call node_modules\.bin\next.cmd start --hostname %HOSTNAME% --port %PORT%
