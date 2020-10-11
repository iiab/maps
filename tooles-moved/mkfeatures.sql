 create table features (
     geonameid integer primary key, name varchar(200), asciiname varchar(200),
     alternatenames varchar(10000), latitude float, longitude float,
     feature_class char(1), feature_code varchar(10), country_code char(2),
     cc2 varchar(200), admin1 varchar(20), admin2 varchar(20), admin3 varchar(20),
     admin4 varchar(20), population integer, elevation integer, dem varchar(20),
     timezone varchar(40), moddate varchar(10)
 );
