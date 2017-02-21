# connector.land
https://connector.land (builds out https://github.com/interledgerjs/ilp-kit/wiki/Known-ILP-Nodes)

To add yourself, edit [data/hosts.json](https://github.com/michielbdejong/connector.land/edit/master/data/hosts.json).

To update the list with latest probe data, on stats.connector.land, create a `passwords.js` file, and run:

````
npm install ; npm install -g pm2 ; cd scripts ; pm2 start statsServer.js ; sh ./everyTenMinutes.sh
````

Make sure the stats server runs on https://stats.connector.land/, and the `data/graphs/` folder is served on https://stats.connector.land/graphs/.

DNS for connector.land, and by extension for stats.connector.land, is currently at CloudFlare (DNR is at Gandi.net) in @michielbdejong's account/handle.
Hosting for connector.land is github pages (served from the master branch). Hosting for stats.connector.land is at Vultr.com, on the same host where
ilp-kit.michielbdejong.com and the micmic connector are hosted. That's why they'll probably have an advantage in speed measurements, but otherwise it should
be a more or less level playing field.
