# Instruksjoner til NDLA

Det er lagt opp til at NDLA kan endre en del ting uten å måtte gjøre endringer i javascript-koden eller kjøre ut en ny build med Vue/Webpack.

## Endre datasett eller navn/linker knyttet til disse

I roten til leveransen ligger det en fil `config.js`. Her defineres navn, fil-lokasjon og link til kildehenvisning til alle datasettene som lastes ved oppstart. I skrivende stund er dette to stykker, men man kan definere flere om ønskelig. `config.js` lastes i HTML-filen.

Filen ser slik ut

```javascript
window.mfNdlaConfig = {
  datasets: [
    {
      name: "Arbeidsledighet",
      filename: "data/arbeidsledighet.csv",
      creditsLink:
        "https://www.ssb.no/statbank/table/08517/chartViewLine/?loadedQueryId=10047091&timeType=item",
    },
    {
      name: "BNP 1911 - 2011",
      filename: "data/bruttonasjonalprodukt.csv",
      creditsLink:
        "https://www.gapminder.org/tools/?from=world#$chart-type=bubbles",
    },
  ],
};
```

Ønsker man å legge til et nytt datasett kan man duplisere et av de eksisterende datasettene og endre verdiene. Man må ha med alt inklusive klammeparantesene

```javascript
{
  name: "Mitt nye datasett",
  filename: "data/mitt_nye_datasett.csv",
  creditsLink:
    "https://link.til.nettside.no",
},

```

`creditsLink` er valgfritt, men `name` og `filename` er påkrevd.

De eksisterende datasettene ligger i underkatalogen `data`. Det anbefales å også legge nye filer her, men det er ikke påkrevd.

## Instruksjons- og mal-fil

Trykker man på `Importer data` vil man i dialogen som åpnes få mulighet til å laste ned en instruksjonsfil og en mal/eksempel-fil som viser hvordan filen må organiseres.

Begge filene ligger i roten til leveransen. Instruksjonsfilen heter `instruksjoner.pdf`, malen `mal.xlsx`.

Ønsker man å oppdatere disses filene må man overskrive de gamle med nye filer med samme navn.

## Språkfiler

Ønsker man å endre noe av teksten i programmet kan dette gjøres ved å endre filene `nb_NO.js` (bokmål) og `nn_NO.js` (nynorsk).

De forskjellige ordene/setningene ligger med en nøkkelbetegnelse på engelsk på venstre side og teksten som faktisk blir brukt i programmet på høyre. Eks:

```javascript
reset: "Tilbakestill diagram",
saveGraph: "Last ned bilde av diagram",
```
