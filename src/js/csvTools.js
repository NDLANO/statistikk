export function cleanCsvString(csvString) {
  // * Split string into lines
  let fileLines = convertToLines(csvString);
  console.log("csvTools.cleanCsvString: First line = ", fileLines[0]);

  fileLines[0] = convertHeaderValuesToString(fileLines[0]);
  console.log("csvTools.cleanCsvString First line = ", fileLines[0]);

  fileLines = removeEmptyLastElement(fileLines);

  csvString = fileLines.join("\r\n");

  return csvString;
}

// ** Remove last line if empty
export function removeEmptyLastElement(linesArray) {
  let tmpArray = [...linesArray];
  if (tmpArray[tmpArray.length - 1] == "") {
    console.log("csvTools.removeEmptyLastLine: Last line is empty: Removing");
    tmpArray.pop();
    console.log(
      "csvTools.removeEmptyLastLine: last line after removing = ",
      tmpArray[tmpArray.length - 1]
    );
  }

  return tmpArray;
}

// ** Header number fix/hack
// * Adds a space after each element, ensuring the keys of the resulting JSON object
// * gets sorted as strings, not numbers
// *
// * resources https://dirask.com/posts/JavaScript-how-to-split-string-by-newline-k1wEQp
// * https://wsvincent.com/javascript-convert-array-to-string/
export function convertHeaderValuesToString(singleLineArray) {
  // * Split first line with both ; and ,
  // * The longest one is most likely the delimiter
  let firstLineCommaArray = singleLineArray.split(",");
  let firstLineSemiArray = singleLineArray.split(";");
  let firstLineArray = undefined;
  let delimiter = undefined;
  if (firstLineSemiArray.length > firstLineCommaArray.length) {
    firstLineArray = firstLineSemiArray;
    delimiter = ";";
  } else {
    firstLineArray = firstLineCommaArray;
    delimiter = ",";
  }

  firstLineArray = firstLineArray.map((el) => {
    return el + " ";
  });
  return firstLineArray.join(delimiter);
}

export function convertToLines(csvString) {
  return csvString.split(/\r\n|\n\r|\n|\r/);
}