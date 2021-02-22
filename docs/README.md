# NDLA Statistikk

Docsify-dokumentasjon for NDLA Statistikk.

MD-filene i `docs`-folderen kan ses rendret ved å åpne kjøre en webserver i folderen. Dette kan f.eks. gjøres ved å bruke [Live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) i VS Code.

Komponentene bruker Vues [Single File Components](https://vuejs.org/v2/guide/single-file-components.html)

HTML-sidene er bygget med [PUG](https://pugjs.org/api/getting-started.html), CSS med [SASS](https://sass-lang.com/)

## Node pakker brukt i klienten:

- [vue-i18n](https://github.com/kazupon/vue-i18n) - Språkversjoner
- [vue-chartjs](https://vue-chartjs.org/) og [chart.js](https://www.chartjs.org/) - Grafer
- [Vuetify](https://vuetifyjs.com/en/) - UI framework
- [VuePapaParse](https://github.com/twickstrom/vue-papa-parse) - Parsing av CSV-filer. _VuePapaParse_ er en wrapper for [Papa Parse](https://www.papaparse.com/)
- [Flatted](https://github.com/WebReflection/flatted) - Circular JSON parser
- [Vue-html2canvas](https://github.com/mycurelabs/vue-html2canvas) - For å generere bilde av grafene

## Build pakker

ESLint, Prettier, Sass, Pug satt opp vha [Vue CLI](https://cli.vuejs.org/)

- [Material Design Icons](https://materialdesignicons.com/) - Ikoner
- [node-sftp-deploy-i](https://www.npmjs.com/package/node-sftp-deploy-i) - For opplasting til [https://developer2.doublethink.no/ndla_statistikk/](https://developer2.doublethink.no/ndla_statistikk/)

## Linkformat

For å velge mellom bokmål og nynorsk brukes et URL-parameter.

For å velge nynorsk må URLen i linken slutte på `/?lang=nn`.

Bokmål er standardspråk og trenger ikke noe parameter. Man kan evt. også legge parameter `/?lang=nb`.
