var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('GET', './data.json', true);
xhr.onload = function() {
  var html = xhr.response.sort(function(a, b) {
    if ((a.settlements === 'HTTP <span style="color:red">404</span> response') && (b.settlements !== 'HTTP <span style="color:red">404</span> response')) { return 1; }
    if ((a.settlements !== 'HTTP <span style="color:red">404</span> response') && (b.settlements === 'HTTP <span style="color:red">404</span> response')) { return -1; }
    if ((a.health === 'OK') && (b.health !== 'OK')) { return -1; }
    if ((a.health !== 'OK') && (b.health === 'OK')) { return 1; }
    if ((a.ping) && (!b.ping)) { return -1; }
    if ((!a.ping) && (b.ping)) { return 1; }
    if ((a.settlements === 'None') && (b.settlements !== 'None')) { return 1; }
    if ((a.settlements !== 'None') && (b.settlements === 'None')) { return -1; }
    if (a.hostname < b.hostname) { return -1; }
    if (a.hostname > b.hostname) { return 1; }
    return 0;
  }).map(line =>
    `<tr><td><a href="https://${line.hostname}">${line.hostname}</a></td>` +
        `<td>${line.prefix}</td>` +
        `<td>${line.owner}</td>` +
        `<td>${line.settlements.slice(0, 50)}</td>` +
        `<td>${line.health.slice(0, 50)}</td>` +
        (line.ping?`<td style="color:green">&#x2713;</td>` : `<td style="color:red">&#x2716;</td>`) +
        `</tr>`
  ).join('\n');
  document.getElementById("nodes-list").innerHTML = html;
  document.getElementById("header-row").innerHTML = [
    '<th>ILP Kit URL</th>',
    '<th>Ledger Prefix</th>',
    '<th>Owner\'s Connector Account</th>',
    '<th>Settlement Methods</th>',
    '<th>Health</th>',
    '<th>Ping</th>',
  ].join('\n');
};
xhr.send();
