export function processCsvString(csvString) {
  // * Split string into lines
  let fileLines = convertToLines(csvString);
  console.log("csvTools.processCsvStringString: First line = ", fileLines[0]);

  let xAxisLabelString = fileLines.splice(0, 1);
  let yAxisLabelString = fileLines.splice(0, 1);

  // Remove empty line
  fileLines.splice(0, 1);

  fileLines = removeEmptyLastLine(fileLines);

  let delimiter = detectDelimiter(fileLines[0]);

  let xAxisLabel = xAxisLabelString[0].split(delimiter)[1];
  let yAxisLabel = yAxisLabelString[0].split(delimiter)[1];
  let headerLine = fileLines.shift(); // * return and remove first element
  headerLine = convertHeaderValuesToString(headerLine, delimiter);

  if (delimiter === ";") fileLines = convertCommaDecimalToDot(fileLines);

  fileLines.unshift(headerLine); // * add headerLine to the beginning of the array

  csvString = fileLines.join("\r\n");

  return csvString;
}

// ** Tries to detect if delimiter is semicolon or comma
export function detectDelimiter(singleLineArray) {
  let firstLineCommaArray = singleLineArray.split(",");
  let firstLineSemiArray = singleLineArray.split(";");

  let delimiter = undefined;

  // * Split first line with both ; and ,
  // * The longest one is most likely the delimiter
  if (firstLineSemiArray.length > firstLineCommaArray.length) {
    delimiter = ";";
  } else {
    delimiter = ",";
  }

  return delimiter;
}

// ** Remove last line if empty
export function removeEmptyLastLine(linesArray) {
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

// * Replaces , with . in numbers
export function convertCommaDecimalToDot(linesArray) {
  return linesArray.map((line) => line.replace(",", "."));
}

// ** Header number fix/hack
// * Adds a space after each element, ensuring the keys of the resulting JSON object
// * gets sorted as strings, not numbers
// *
// * resources https://dirask.com/posts/JavaScript-how-to-split-string-by-newline-k1wEQp
// * https://wsvincent.com/javascript-convert-array-to-string/
export function convertHeaderValuesToString(singleLineArray, delimiter) {
  let firstLineArray = singleLineArray.split(delimiter);

  firstLineArray = firstLineArray.map((el) => {
    return el + " ";
  });
  return firstLineArray.join(delimiter);
}

export function convertToLines(csvString) {
  return csvString.split(/\r\n|\n\r|\n|\r/);
}
