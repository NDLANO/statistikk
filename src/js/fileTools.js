export function readFile(filename) {
  var request = new XMLHttpRequest();
  request.open("GET", filename, false);
  request.send(null);
  if (request.status == 200) {
    return request.responseText;
  }

  return null;
}
