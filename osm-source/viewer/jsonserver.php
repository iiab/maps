<?php

$files = glob('./data/geojson/*.geojson');
echo json_encode($files);    


?>
