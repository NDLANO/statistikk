# Lasting av CSV-filer

De predefinerte CSV-filene er definert i arrayen `datasets` i `config.js`. Hvert objekt i arrayen består av **name** og **filename**.

Når `mounted()` kjøres i `App.vue` vil filene lastes, parses og pushes til variabelen `datasets`.

## Parsing

[Papa Parse](https://www.papaparse.com/docs#config) brukes til parsing. Vi bruker første linje til headinger, så `header` er satt til true. 

Vi har ikke definert delimiter. Default verdi er auto-detect. Dette er en fordel, siden norsk Excel eksporterer CSV-filer med `;` som delimiter.