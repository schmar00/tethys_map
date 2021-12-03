<?php
$json = $_POST['newData'];
$file_pointer = 'tethys_oai.js';
file_put_contents($file_pointer, $json);
?>
