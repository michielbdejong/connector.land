# connector.land

[![Greenkeeper badge](https://badges.greenkeeper.io/michielbdejong/connector.land.svg)](https://greenkeeper.io/)

https://connector.land (builds out https://github.com/interledgerjs/ilp-kit/wiki/Known-ILP-Nodes)

To add yourself, edit [data/hosts.js](https://github.com/michielbdejong/connector.land/edit/master/data/hosts.js).

To update the list with latest probe data, on stats.connector.land, create a `passwords.js` file, and run:

````
npm install ; npm install -g pm2 ; cd scripts ; pm2 start statsServer.js ; sh ./everyTenMinutes.sh
````

Assuming you have the `passwords.js` file, containing the password for a 'connectorland' user on the source ledger, you can do for instance:
````
node scripts/testQuote.js hive.dennisappelt.com dennis john.jpvbs.com
````
to test quoting from connector 'dennis' on source ledger 'hive.dennisappelt.com' to destination ledger 'john.jpvbs.com'.

Make sure the stats server runs on https://stats.connector.land/, and the `data/graphs/` folder is served on https://stats.connector.land/graphs/.

DNS for connector.land, and by extension for stats.connector.land, is currently at CloudFlare (DNR is at Gandi.net) in @michielbdejong's account/handle.
Hosting for connector.land is github pages (served from the master branch). Hosting for stats.connector.land is at Vultr.com, on the same host where
ilp-kit.michielbdejong.com and the micmic connector are hosted. That's why they'll probably have an advantage in speed measurements, but otherwise it should
be a more or less level playing field.
