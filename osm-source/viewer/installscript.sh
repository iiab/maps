#!/bin/bash
#A simple install script

echo "Getting Webpack Config File"
cp -f ../generate-regions/pack/webpack.config.js ./webpack.config.js 

echo "Getting new Assets containing bootstrap-typeahead.min.js and other bootstrap files"
cp -f ../../generate-regions/ol-parcel-bundler/assets/* ./assets/

echo "Install Node"
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get install nodejs

echo "Installing Packages"

chmod 777 *

npm init -y

sudo npm install --unsafe-perm=true --allow-root

echo "Install Complete."

echo "Ready to build!"

chmod u+x up.sh





