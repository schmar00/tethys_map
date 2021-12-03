<?php
$url = "https://www.tethys.at/oai?verb=ListRecords&metadataPrefix=oai_dc";
if(isset($_GET['resumptionToken']))
{
    $resumptionToken = '&resumptionToken=' . urlencode($_GET['resumptionToken']);
    $url = $url . $resumptionToken;
}
$curl = curl_init($url);
$resp = curl_exec($curl);
curl_close($curl);
?>