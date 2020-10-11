#!/usr/bin/env node
// 2018 Apr example generating Central America subset from planet
// execute this js script via "node mk-mbtiles-subset"

var tilelive = require('tilelive');

var MBTiles = require('mbtiles');
MBTiles.registerProtocols(tilelive);
var util = require('util');

var options = {};
options.maxzoom = 14;
options.minzoom = 10;

//bounds for San-francisco
//options.bounds = [-122.7549,37.2289,-121.6645,38.2273]
//following bounds for central america
options.bounds = [-118.12,6.77,-59.14,32.85];
options.progress = report;

//var src = "MBTiles://./california_san_francisco.mbtiles";
var src = "MBTiles://./2017-07-03_planet_z0_z14.mbtiles";
var dst = 'MBTiles://./central-america_z10-14.mbtiles';

tilelive.copy(src, dst, options, function(err) {
    if (err) throw err;
    return 'Done';
});


// Report functions lifted from https://github.com/mapbox/tilelive/blob/master/test/copy.test.js
// Used for progress report
function report(stats, p) {
    console.log(util.format('\r\033[K[%s] %s%% %s/%s @ %s/s | ✓ %s □ %s | %s left',
        pad(formatDuration(process.uptime()), 4, true),
        pad((p.percentage).toFixed(4), 8, true),
        pad(formatNumber(p.transferred),6,true),
        pad(formatNumber(p.length),6,true),
        pad(formatNumber(p.speed),4,true),
        formatNumber(stats.done - stats.skipped),
        formatNumber(stats.skipped),
        formatDuration(p.eta)
    ));
}

function formatDuration(duration) {
    var seconds = duration % 60;
    duration -= seconds;
    var minutes = (duration % 3600) / 60;
    duration -= minutes * 60;
    var hours = (duration % 86400) / 3600;
    duration -= hours * 3600;
    var days = duration / 86400;

    return (days > 0 ? days + 'd ' : '') +
        (hours > 0 || days > 0 ? hours + 'h ' : '') +
        (minutes > 0 || hours > 0 || days > 0 ? minutes + 'm ' : '') +
        seconds + 's';
}

function pad(str, len, r) {
    while (str.length < len) str = r ? ' ' + str : str + ' ';
    return str;
}

function formatNumber(num) {
    num = num || 0;
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'm';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'k';
    } else {
        return num.toFixed(0);
    }
    return num.join('.');
}

function timeRemaining(progress) {
    return Math.floor(
        (process.uptime()) * (1 / progress) -
        (process.uptime())
    );
}
