export function cleanCsvString(csvString) {
  // ** Header number fix/hack start
  // * resources https://dirask.com/posts/JavaScript-how-to-split-string-by-newline-k1wEQp
  // * https://wsvincent.com/javascript-convert-array-to-string/

  let fileLines = csvString.split(/\r\n|\n\r|\n|\r/);
  console.log("csvTools.cleanCsvString: First line = ", fileLines[0]);
  let firstLineCommaArray = fileLines[0].split(",");
  console.log(
    "csvTools.cleanCsvString: first firstLineArray length = ",
    firstLineCommaArray.length
  );
  let firstLineSemiArray = fileLines[0].split(";");
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
  fileLines[0] = firstLineArray.join(delimiter);
  console.log("csvTools.cleanCsvString First line = ", fileLines[0]);

  // ** Remove last line if empty
  if (fileLines[fileLines.length - 1] == "") {
    console.log("csvTools.cleanCsvString: Last line is empty: Removing");
    fileLines.pop();
    console.log(
      "csvTools.cleanCsvString: last line after removing = ",
      fileLines[fileLines.length - 1]
    );
  }

  csvString = fileLines.join("\r\n");
  console.log("csvTools.cleanCsvString: firstLineArray = ", firstLineArray);
  // ** Header number fix/hack end

  return csvString;
}

export function convertToLines(csvString) {
  return csvString.split(/\r\n|\n\r|\n|\r/);
}
