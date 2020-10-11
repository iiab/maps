#!/usr/bin/perl
use strict;
use warnings;
use DBI;

# beforehand:
# create table features (
#     geonameid integer primary key, name varchar(200), asciiname varchar(200),
#     alternatenames varchar(10000), latitude float, longitude float,
#     feature_class char(1), feature_code varchar(10), country_code char(2),
#     cc2 varchar(200), admin1 varchar(20), admin2 varchar(20), admin3 varchar(20),
#     admin4 varchar(20), population integer, elevation integer, dem varchar(20),
#     timezone varchar(40), moddate varchar(10)
# );

my $dbh = DBI->connect("dbi:SQLite:cities1000.sqlite","","");
$dbh->begin_work;

my $sth = $dbh->prepare("insert into features (geonameid, name, asciiname,
                         alternatenames, latitude, longitude, feature_class,
                         feature_code, country_code, cc2, admin1, admin2, admin3,
                         admin4, population, elevation, dem, timezone, moddate)
                         values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

open FILE, "cities1000.txt" or die $!;

while (my $line = <FILE>) {
    my @fields = split /\t/, $line;
    print "Inserting: $fields[1]\n";
    $sth->execute(@fields);
}

$dbh->commit;

#  0 geonameid         : integer id of record in geonames database
#  1 name              : name of geographical point (utf8) varchar(200)
#  2 asciiname         : name of geographical point in plain ascii characters, varchar(200)
#  3 alternatenames    : alternatenames, comma separated, ascii names automatically transliterated,
#                        convenience attribute from alternatename table, varchar(10000)
#  4 latitude          : latitude in decimal degrees (wgs84)
#  5 longitude         : longitude in decimal degrees (wgs84)
#  6 feature class     : see http://www.geonames.org/export/codes.html, char(1)
#                        A country, state, region,...
#                        H stream, lake, ...
#                           LK    lake
#                           LKC   crater lake
#                           LKN   salt lake   
#                           OCN   ocean
#                           RSV reservoir
#                           SEA sea
#                        L parks,area, ...
#                        P city, village,...
#                        R road, railroad
#                        S spot, building, farm
#                        T mountain,hill,rock,...
#                           MT   mountain
#                           MTS  mountains
#                           PK   peak
#                           PKS  peaks
#                           VLC  volcano
#                           CNYN canyon
#                        U undersea
#                        V forest,heath,...
#  7 feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
#  8 country code      : ISO-3166 2-letter country code, 2 characters
#  9 cc2               : alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
# 10 admin1 code       : fipscode (subject to change to iso code), see exceptions below,
#                        see file admin1Codes.txt for display names of this code; varchar(20)
# 11 admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80) 
# 12 admin3 code       : code for third level administrative division, varchar(20)
# 13 admin4 code       : code for fourth level administrative division, varchar(20)
# 14 population        : bigint (8 byte int) 
# 15 elevation         : in meters, integer
# 16 dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3''
#                        (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
# 17 timezone          : the timezone id (see file timeZone.txt) varchar(40)
# 18 modification date : date of last modification in yyyy-MM-dd format

__DATA__
2986043	Pic de Font Blanca	Pic de Font Blanca	Pic de Font Blanca,Pic du Port	42.64991	1.53335	T	PK	AD		00				0		2860	Europe/Andorra	2014-11-05
2993838	Pic de Mil-Menut	Pic de Mil-Menut	Pic de Mil-Menut	42.63333	1.65	T	PK	AD	AD,FR	B3	09	091	09024	0		2138	Europe/Andorra	2014-11-05
2994701	Roc Mélé	Roc Mele	Roc Mele,Roc Meler,Roc Mélé	42.58765	1.74028	T	MT	AD	AD,FR	00				0		2803	Europe/Andorra	2014-11-05
3007683	Pic des Langounelles	Pic des Langounelles	Pic des Langounelles	42.61203	1.47364	T	PK	AD	AD,FR	00				0		2685	Europe/Andorra	2014-11-05
3017832	Pic de les Abelletes	Pic de les Abelletes	Pic de la Font-Negre,Pic de la Font-Nègre,Pic de les Abelletes	42.52535	1.73343	T	PK	AD	FR	A9	66	663	66146	0		2411	Europe/Andorra	2014-11-05
3017833	Estany de les Abelletes	Estany de les Abelletes	Estany de les Abelletes,Etang de Font-Negre,Étang de Font-Nègre	42.52915	1.73362	H	LK	AD	FR	A9				0		2260	Europe/Andorra	2014-11-05
3023203	Port Vieux de la Coume d’Ose	Port Vieux de la Coume d'Ose	Port Vieux de Coume d'Ose,Port Vieux de Coume d’Ose,Port Vieux de la Coume d'Ose,Port Vieux de la Coume d’Ose	42.62568	1.61823	T	PASS	AD		00				0		2687	Europe/Andorra	2014-11-05
3029315	Port de la Cabanette	Port de la Cabanette	Port de la Cabanette,Porteille de la Cabanette	42.6	1.73333	T	PASS	AD	AD,FR	B3	09	091	09139	0		2379	Europe/Andorra	2014-11-05
3034945	Port Dret	Port Dret	Port Dret,Port de Bareites,Port de las Bareytes,Port des Bareytes	42.60172	1.45562	T	PASS	AD		00				0		2660	Europe/Andorra	2014-11-05
3038814	Costa de Xurius	Costa de Xurius		42.50692	1.47569	T	SLP	AD		07				0		1839	Europe/Andorra	2015-03-08
