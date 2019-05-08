#!/bin/bash -x
# Set up parcel, extract programs, and tilelive, mk diretories, config
# The setenv.template is a model, -- setenv is not overriden, must handcode it

# first check that the environment has been set
MR=${MR_SSD}
if [ "$MR" == "" ];then
   echo "Have you set the environment variables via 'source ./setenv'"
   exit 1
fi

# there's an environment variable which should impact the TARGET directory --but
#  right now it is hard coded -- so keep it that way
TARGET_URL=/library/www/html/temp
mkdir -p $TARGET_URL/assets

# set up the output/input directors for pipeline
# all steps including generation of extracts done on SSD
mkdir -p $MR_SSD/output/stage1
mkdir -p $MR_SSD/output/stage2
# for stage3 and following, use hard disk
mkdir -p $MR_HARD_DISK/output/stage3
mkdir -p $MR_HARD_DISK/output/stage4

which node
if [ $? -ne 0 ]; then
   echo nodejs is required as a precondition for mapgen. -- quitting
   exit 1
fi

# make sure that parcel is installed and configured
#
if [ ! -d $MR_SSD/ol-parcel-bundler/node_modules ];then
  mkdir -p $MR_SSD/ol-parcel-bundler
  cd $MR_SSD/ol-parcel-bundler
  npm init -y
  npm install --save-dev parcel-bundler
  npm install --save ol 
  npm install --save ol-mapbox-style
  npm install --save popper
fi

# make sure that webpack is installed and configured
if [ ! -d "$MR_SSD/pack/node_modules" ];then
  mkdir -p $MR_SSD/pack
  cd $MR_SSD/pack
  npm init -y
  npm install --save-dev webpack babel-loader webpack-dev-server webpack-cli
  npm install --save-dev babel-preset-env copy-webpack-plugin
  npm install --save-dev html-webpack-plugin
  npm install --save-dev ol-mapbox-style ol babel/core
# add the following to package.json
  sed -i 's/.*test.*/"babel": "babel --presets es2015 .\/main.js -o .\/build\/main.bundle.js",\
     "start": "webpack-dev-server --mode=development",\
     "build": "webpack --mode=production"/' $MR_SSD/pack/package.json

  cat <<'EOF' >$MR_SSD/pack/webpack.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },
 mode: 'development',
 optimization: {
   usedExports: true
 },
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    clientLogLevel: 'none',
    //stats: 'verbose'
    stats: 'errors-only'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    //new CopyPlugin([{from: './assets', to: 'assets'}]),
    new HtmlPlugin({
      template: './index.html'
    })
  ]
};
EOF
# http://ccoenraets.github.io/es6-tutorial/setup-webpack/
fi

# the extract program is in github owned by openmmaptiles
if [ ! -d $MR_SSD/extracts ]; then
   git clone https://github.com/georgejhunt/extracts -b iiab
fi

# The extract program requires tilelive from mapbox
if [ ! -d $MR_SSD/tilelive/node_modules ]; then
   mkdir -p $MR_SSD/tilelive
   cd $MR_SSD/tilelive
   npm init -y
   npm install --save-dev @mapbox/tilelive
   npm install --save-dev @mapbox/mbtiles
fi

# create the csv file which is the spec for the regional extract stage2
$MR_SSD/../tools/mkcsv.py

# download the minumum resources to get the simple version of maps to work
wget http://download.iiab.io/content/OSM/vector-tiles/maplist/hidden/regional-resources/detail.mbtiles -P $TARGET_URL
cp -rp ../osm-source/regional-base/assets/* $TARGET_URL/assets/
cp -rp ../osm-source/regional-base/tileserver.php $TARGET_URL/
