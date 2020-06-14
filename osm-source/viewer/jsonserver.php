<?php

$file = glob('./data/geojson/*.geojson');
echo json_encode($file);    


?>
