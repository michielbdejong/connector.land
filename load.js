var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('GET', './data.json', true);
xhr.onload = function() {
  var html = xhr.response.map(line =>
    `<tr><td><a href="https://${line.hostname}">${line.hostname}</a></td>` +
        `<td>${line.prefix}</td>` +
        `<td>${line.owner}</td>` +
        (line.ping?`<td style="color:green">&#x2713;</td>` : `<td style="color:red">&#x2716;</td>`) +
        `<td>${line.health.slice(0, 50)}</td>` +
        `<td>${line.settlements.slice(0, 50)}</td>` +
        `</tr>`
  ).join('\n');
  document.getElementById("nodes-list").innerHTML = html;
  document.getElementById("header-row").innerHTML = [
    '<th>ILP Kit URL</th>',
    '<th>Ledger Prefix</th>',
    '<th>Owner\'s Connector Account</th>',
    '<th>Ping</th>',
    '<th>Health</th>',
    '<th>Settlement Methods</th>',
  ].join('\n');
};
xhr.send();
