REM Instructions for the classpath values are at:
REM https://github.com/junit-team/junit4/wiki/Getting-started
@echo off
set JUC=-cp .;junit-4.13.2.jar;hamcrest-core-1.3.jar
set JUR=-cp .;junit-4.13.2.jar;hamcrest-core-1.3.jar org.junit.runner.JUnitCore
echo .
echo    JU variable is set for JUnit 4 testing.....
echo .
