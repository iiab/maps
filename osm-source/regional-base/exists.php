<?php
$db = $_GET['db'];

function summary(){
  global $db;
    // Open the database
  try {
    $conn = new PDO("sqlite:$db");
    $sql = 'select zoom_level, min(tile_column),max(tile_column),min(tile_row),max(tile_row), count(zoom_level) from tiles group by zoom_level;';
   $q = $conn->prepare($sql);
   if ( $q ) {
      $q->execute(); 
      $q->bindColumn(1, $zoom);
      $q->bindColumn(2, $xmin);
      $q->bindColumn(3, $xmax);
      $q->bindColumn(4, $ymin);
      $q->bindColumn(5, $ymax);
      $q->bindColumn(6, $count);
      while($q->fetch()) {
         echo $zoom." ".  $xmin." ".  $xmax." ".  $ymin ." ". $ymax ." ". $count;
         echo '<br>' ;
      }
   } else {
      print $sql;
      die("database $db did not open");
   }
  }
  catch(PDOException $e)
  {
    print 'Exception : '.$e->getMessage();
  }
}

function deg2num($lat, $lon, $zoom){ 
   $xtile = floor((($lon + 180) / 360) * pow(2, $zoom));
   $ytile = floor((1 - log(tan(deg2rad($lat)) + 1 / cos(deg2rad($lat))) / pi()) /2 * pow(2, $zoom));
   return array($xtile,$ytile);
}

if (isset($_GET['summary'])){
   summary();
   exit(1);
}
$zoom = $_GET['zoom'];
$lon = $_GET['lon'];
$lat = $_GET['lat'];
//echo "$lat  $lon $zoom\n";
$latlon = deg2num($lat, $lon, $zoom);
$tileX = $latlon[0];
$tileY = $latlon[1];
$tileY = (2 ** $zoom) - $tileY - 1;
//echo "x:$lon y:$lat\n";
  try
  {
    // Open the database
   $conn = new SQLite3($db);
    // Query the tiles view and echo out the returned image
   $sql = "SELECT * FROM tiles WHERE zoom_level = $zoom AND tile_column = $tileX AND tile_row = $tileY";
   $result= $conn->query($sql);
   $row = $result->fetchArray(SQLITE3_ASSOC);

   if ( $row) {
         header("Content-Type: application/json");
         echo '{"success": "true"}';
      } else if ($zoom > 14 ) {
         // zoom > 14 does not exist, but should be permitted
         $sql = 'select value from metadata where name = ?';
         $q = $conn->prepare($sql);
         if( $q ) {
            $q->bindValue(1,'bounds');
            $result = $q->execute();
            $row = $result->fetchArray(SQLITE3_ASSOC);
            $wsen = explode(',', $row['value']);
            header("Content-Type: application/json");
            //echo print_r($wsen,TRUE);
            //echo "lon:$lon lat:$lat"; 
            if ($zoom > 14 &&
                 $lon>= $wsen[0] &&
                 $lon<= $wsen[2] &&
                 $lat>= $wsen[1] &&
                 $lat<= $wsen[3] ){
                 $result = '{"success": "true"}';
            } else $result = '{"success": "false"}';
            echo $result;
         } else echo "FAilure to get bounds from metadata $sql";
      }
  }
  catch(PDOException $e)
  {
         header("Content-Type: application/json");
         echo '{"success": "false"}';
    print 'Exception : '.$e->getMessage();
  }

?>
