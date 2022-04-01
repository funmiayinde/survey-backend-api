#!/bin/bash

echo DB_URL: $DB_URL
[ "x$BUILD_TYPE" != "test" ] && pm2-runtime pm2.json --update-env -o ./out.log -e ./err.log
[ "x$BUILD_TYPE" = "test" ] && pm2 pm2.json  --update-env -o ./out.log -e ./err.log

