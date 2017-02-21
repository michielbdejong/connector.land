while [ true ] ; do node testPsk.js ;node genPerfStats.js ; node probe.js ; pm2 restart statsServer.js ; sleep 600 ; done
