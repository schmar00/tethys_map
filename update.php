<?php
$json = $_POST['newData'];
$file_pointer = 'tethys_oai.js';
/* $open = "alles anders!"; */
file_put_contents($file_pointer, $json);
?>

