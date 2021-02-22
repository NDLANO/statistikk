# Lasting av CSV-filer

De predefinerte CSV-filene er definert i arrayen `datasets` i `config.js`. Hvert objekt i arrayen består av **name** og **filename**.

Når `mounted()` kjøres i `App.vue` vil filene lastes, parses og pushes til variabelen `datasets`.

## Parsing

[Papa Parse](https://www.papaparse.com/docs#config) brukes til parsing. Vi bruker første linje til headinger, så `header` er satt til true.

Vi har ikke definert delimiter. Default verdi er auto-detect. Dette er en fordel, siden norsk Excel eksporterer CSV-filer med `;` som delimiter.

### Header-problematikk

Under testing dukket det opp et uventet problem. Hvis man setter inn tall i headeren, f.eks. årstall, vil objektene bli sortert etter parsing til json. Dette betyr at hvis headeren er `Måned,1995,2005,2015, Siste år` så vil rekkefølgen på nøklene etter parsing bli `1995, 2005, 2015, Måned, Siste år`.

Det viser seg ta dette skyldes at keys i Javascript-objekter ikke har noen garantert rekkefølge ([ref](https://github.com/mholt/PapaParse/issues/46)). I Chrome og Firefox (ikke testet i andre nettlesere) vil keys som er nummer bli sortert før keys som er strenger.

Dette skaper problemer for oss som går ut fra at første kolonne er labels for X-aksen. Når Javascript endrer rekkefølgen vil ikke første kolonne nødvendigvis være første kolonne i json-objektet.

**Fiks**
Foreløpig er dette fikset med en ganske hacky løsning.

- Før parsing deles innholdet i filen opp i linjer.
- Første linje deles opp samtidig som det gjøres en enkel test for å prøve å finne ut om det er komma eller semikolon som er brukt som delimiter. (Linjen deles opp med både komma og semikolon og så går vi ut fra at den arrayen som er lengst er den som gjelder)
- Programmet looper gjennom alle elementene i arrayen og legger til et mellomrom til slutt. Dvs. `"1095"` blir `"1095 "`.
- Første linjen settes sammen igjen
- Linjene settes sammen igjen.

Dette gjør at tallene blir behandlet som strenger og ikke tall når de parses til keys.
