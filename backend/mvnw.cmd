@ECHO OFF
SETLOCAL
SET WRAPPER_DIR=%~dp0\.mvn\wrapper
SET JAR=%WRAPPER_DIR%\maven-wrapper.jar
SET PROPS=%WRAPPER_DIR%\maven-wrapper.properties

IF NOT EXIST "%JAR%" (
  ECHO Downloading Maven Wrapper JAR...
  FOR /F "tokens=1,* delims==" %%A IN ('findstr /R "^wrapperUrl=" "%PROPS%"') DO SET URL=%%B
  powershell -Command "(New-Object Net.WebClient).DownloadFile('%URL%', '%JAR%')"
)

SET JAVA_EXE=%JAVA_HOME%\bin\java.exe
IF NOT EXIST "%JAVA_EXE%" SET JAVA_EXE=java

"%JAVA_EXE%" -jar "%JAR%" %*
