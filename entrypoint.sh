#!/bin/bash 

perl -pi -e "s/NETWORK = \"mainnet\"/NETWORK = \"${NETWORK}\";/g"  ./build/server/chunks/createDataLoader*.js

node build