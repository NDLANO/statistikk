export function readFile(filename) {
  var request = new XMLHttpRequest();
  request.open("GET", filename, false);
  request.send(null);
  if (request.status == 200) {
    return request.responseText;
  }

  return null;
}

export function readFileObject(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsText(file, "UTF-8");
  });
}
