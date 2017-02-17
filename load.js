var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('GET', 'https://stats.connector.land', true);
xhr.onload = function() {
  document.getElementById("header-row").innerHTML = [
    '<th>ILP Kit URL</th>',
    '<th>Reliability (success rate)</th>',
    '<th>Speed (one transaction)</th>',
    '<th>Price (commission fee on a 0.01 EUR/USD transaction)</th>',
    '<th>ILP Kit Version</th>',
    '<th>Ledger Prefix</th>',
    '<th>Owner\'s Connector Account</th>',
    '<th>Settlement Methods</th>',
    '<th>Health</th>',
    '<th>Ping</th>',
  ].join('\n');
  document.getElementById("nodes-list").innerHTML = xhr.response.join('\n');
};
xhr.send();
