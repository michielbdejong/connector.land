var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('GET', './data.json', true);
xhr.onload = function() {
  var html = xhr.response.map(line =>
    `<tr><td>${line.href}</td><td>${line.prefix}</td><td>${line.owner}</td></tr>`
  ).join('\n');
  document.getElementById("nodes-list").innerHTML = html;
};
xhr.send();
