@echo off
echo Generating environment.prod.ts from environment variable...
mkdir src\environments 2>nul
echo export const environment = {> src\environments\environment.prod.ts
echo   production: true,>> src\environments\environment.prod.ts
echo   apiUrl: "%API_URL%" >> src\environments\environment.prod.ts
echo };>> src\environments\environment.prod.ts
