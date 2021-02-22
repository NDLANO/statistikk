# 867 NDLA Statistikk

Mer utfyllende dokumentasjon ligger som markdown-filer under `/docs`.

Dokumentasjonen kan leses som vanlige MD-filer, men det er også lagt opp til bruk av [Docsify](https://docsify.js.org/#/). Det gjør at dokumentasjonen også kan leses som vanlige HTML-sider med en sidebar som organiserer innholdet. (Quick tip: Bruk [Live Server](https://github.com/ritwickdey/vscode-live-server) i VS Code, start serveren og naviger til `/docs`)

## Linkformat

For å velge mellom bokmål og nynorsk brukes et URL-parameter.

For å velge nynorsk må URLen i linken slutte på `/?lang=nn`.

Bokmål er standardspråk og trenger ikke noe parameter. Man kan evt. også legge parameter `/?lang=nb`.

## Project setup

Clone repository og kjør install vha. `npm`.

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
