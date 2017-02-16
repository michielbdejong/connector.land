var nodes = [
  { "href": "https://kes-ilp.abdishakur.com",      "prefix": "ke.kes.kes-ilp.",          "owner": "abdishakur"     },
  { "href": "https://ilp.bigchaindb.com",          "prefix": "de.eur.bigchaindb.",       "owner": "dimitri"        },
  { "href": "https://zar-ilp.hopebailie.com",      "prefix": "za.zar.hopebailie.",       "owner": "adrian"         },
  { "href": "https://milton.ilp.network",          "prefix": "gb.gbp.milton.",           "owner": "javi"           },
  { "href": "https://pineapplesheep.ilp.rocks",    "prefix": "lu.eur.pineapplesheep.",   "owner": "pineapplesheep" },
  { "href": "https://usd.interledger.network",     "prefix": "us.usd.interledger.",      "owner": "winthan"        },
  { "href": "https://mmk.interledger.network",     "prefix": "mm.mmk.interledger.",      "owner": "nyeinminn"      },
  { "href": "https://interledger.kr",              "prefix": "kr.krw.interledgerkorea.", "owner": "mspark"         },
  { "href": "https://nexus.justmoon.com",          "prefix": "us.usd.nexus.",            "owner": "stefan"         },
  { "href": "https://gordon.mearnag.org",          "prefix": "us.usd.mearnag.gordon.",   "owner": "connie"         },
  { "href": "https://coins.paleorbglow.com",       "prefix": "us.usd.paleorbglow.",      "owner": "kanaan"         },
  { "href": "https://cornelius.sharafian.com",     "prefix": "us.usd.cornelius.",        "owner": "sharafian"      },
  { "href": "https://cygnus.vahehovhannisyan.com", "prefix": "us.usd.cygnus.",           "owner": "vahe"           },
  { "href": "https://grifiti.web-payments.net",    "prefix": "us.usd.grifiti.",          "owner": "pkrey"          },
  { "href": "https://hive.dennisappelt.com",       "prefix": "lu.eur.hive.",             "owner": "dennis"         },
  { "href": "https://payment.am",                  "prefix": "am.amd.payment.",          "owner": "mesrop"         },
  { "href": "https://ilp-kit.michielbdejong.com",  "prefix": "lu.eur.michiel.",          "owner": "michiel"        },
  { "href": "https://john.jpvbs.com",              "prefix": "",                         "owner": ""               },
  { "href": "https://royalcrypto.com",             "prefix": "ca.usd.royalcrypto.",      "owner": "twarden"        },
];

var rows = [];
for (var i=0; i<nodes.length; i++) {
  rows.push(`<tr><td>${nodes[i].href}</td><td${nodes[i].href}</td><td>>${nodes[i].href}</td></tr>`);
}
document.getElementById("nodes-list").innerHTML = rows.join('\n');
