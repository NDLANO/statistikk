# Oppbygging og filstruktur

Prosjektet er satt opp vha Vue CLI og bruker PUG for HTML og SASS (node-sass) for CSS og bruker Vue Single File Components. Vue CLI bruker webpack behind the scenes for å bygge dev-server og builds.

Språkversjoner (nynorsk og bokmål) blir håndtert av [vue-i18n](https://kazupon.github.io/vue-i18n/).

## Filstruktur

- `/dist` - Builds
- `/docs` - Dokumentasjon
- `/public` - Statiske filer. Disse filene blir kopiert direkte over i `/dist` ved build. Disse inkluderer index.html, språkfiler og CSV-filer.
  - `/public/config.js` - Konfigurasjonsfil som brukes for å definere hvilke CSV-filer som skal lastes. Inneholder tittel og path til hver fil.
  - `/public/index.html` - Prosjektets index-fil. Her lastes også språkfilen og config-filen.
  - `/public/nb-NO.js` - Språkfil for bokmål. All tekst som skal brukes i programmet må ligge i separate språkfiler, en for hvert språk.
- `/src` - Kildefiler
  - `/src/App.vue` - Den første `.vue` filen som blir lastet av `main.js`.
  - `/src/main.js` - Startfilen. Her defineres også vue-i18n og vue-papa-parse.
- `deploy_dev_nb.js` - node-sftp-deploy-i script for å kopiere filene opp på FTP-server. For at denne skal fungere må man også ha filen `login_prefs.js` som inneholder brukernavn og passord (ikke en del av git repoet)

## Bruk av statiske filer

I dette prosjektet er en del filer som normalt ville vært inkludert i builden lagt som statiske filer. Dette inkluderer **språkfilene**, **CSV-filer** og tilhørende **config-fil**. Dette er gjort for at NDLA skal kunne endre innholdet i disse filene uten å bygge prosjektet på nytt.

### Hvordan språkfiler og config-filen blir aksessert.

Siden disse filene ikke er inkludert i builden må de lastes på en annen måte enn det man normalt ville gjort. Jeg har valgt å gjøre det ved å laste dem i headeren til HTML-filen, dvs. før Vue blir lastet. Innholdet i filene blir definert som Javascript-objekter under `window`.

``` javascript
window.statistikkDictionary = {
  general: {
    heading: "Statistikk (bokmål)",

    ...
```
``` javascript
window.mfNdlaConfig = {
  datasets: [
    {
      name: "Co2 utslipp",

    ...
```

I Vue assignes `window.statistikkDictionary` og `window.mfNdlaConfig` til variabler.

Et alternativ kunne vært å laste filene fra Vue, men metoden over har vist seg å fungere bra.



