<?php 
$url = 'https://www.tethys.at/oai?verb=ListRecords&metadataPrefix=oai_datacite';
$rt = '';
$doiArr = array();
$id = 'x';
$nextRequest = True;
$tethys_js = 'const tethys = [';

while ($nextRequest) {
    $xmlObj = simplexml_load_file($url . '&resumptionToken=' . $rt);
    $xmlNode = $xmlObj->ListRecords;
    $rt = $xmlNode->resumptionToken;

    foreach ($xmlNode->record as $rNode) {
        $dc = $rNode->metadata->resource;
        $t = $dc->titles->title;
        $id = $dc->identifier;

        if (in_array(strval($id), $doiArr)) {
            $nextRequest = False;
            break;
        }

        array_push($doiArr, strval($id));

        $lang = $dc->titles->title->attributes("xml",True)->lang;

        if ($lang == 'en' and count($t) > 1) {
            $title = $t[1];
        } else {
            $title = $t[0];
        }

        $creator = '';
        foreach ($dc->creators->creator as $c) {
            foreach ($c->creatorName as $d) {
                if (count(explode(',',$d)) > 1) {
                    $creator .= explode(',',$d)[0] . ', ' . substr(explode(',',$d)[1],1,1) . '; ';
                } else {
                    $creator .= explode(',',$d)[0];
                }
                
            }
        }

        $contributor = '';
        #echo(gettype($dc->contributors->contributor));
        if (gettype($dc->contributors->contributor) != 'NULL') {
            foreach ($dc->contributors->contributor as $c) {
                foreach ($c->contributorName as $d) {
                    if (count(explode(' ',$d)) > 1) {
                        $contributor .= explode(' ',$d)[1] . ', ' . substr(explode(' ',$d)[0],0,1) . '; ';
                    } else {
                        $contributor .= explode(' ',$d)[0];
                    }
                    
                }
            }
        }
        
        $north = $dc->geoLocations->geoLocation->geoLocationBox->northBoundLatitude;
        $east = $dc->geoLocations->geoLocation->geoLocationBox->eastBoundLongitude;
        $south = $dc->geoLocations->geoLocation->geoLocationBox->southBoundLatitude;
        $west = $dc->geoLocations->geoLocation->geoLocationBox->westBoundLongitude;

        #$creator = json_encode($dc->creators);
        $subject = json_encode($dc->subjects->subject);
        #$coverage = $dc->coverage;
        $tethys_js .= '{doi:"' . $id . '", title:"' . htmlspecialchars($title, ENT_QUOTES) 
            . '", creator:"' . htmlspecialchars($creator, ENT_QUOTES) 
            . '", contributor:"' . htmlspecialchars($contributor, ENT_QUOTES) 
            . '", subject:"' . htmlspecialchars(implode(', ',(array)$dc->subjects->subject), ENT_QUOTES) 
            . '", north: ' . $north . ', south: ' . $south 
            . ', east: ' . $east . ', west: ' . $west . '},';


        echo('doi:"' . $id . '",<br>title:"' . $title . '",<br>creator:"'
        . $creator . '",<br>contributor:"'
        . $contributor . '",<br>subject:"'
        . implode(', ',(array)$dc->subjects->subject) . '",<br>north:'
        . $north . '",<br>south:"'
        . $south . '",<br>east:"'
        . $east . '",<br>west:"'
        . $west . '"<hr>');
        #break;
    }
    #break;
} 
$tethys_js = rtrim($tethys_js, ", ");
$tethys_js .= '];';
$tethys_js = str_replace("Ä","&#196;",$tethys_js);
$tethys_js = str_replace("Ö","&#214;",$tethys_js);
$tethys_js = str_replace("Ü","&#220;",$tethys_js);
$tethys_js = str_replace("ä","&#228;",$tethys_js);
$tethys_js = str_replace("ö","&#246;",$tethys_js);
$tethys_js = str_replace("ü","&#252;",$tethys_js);
$tethys_js = str_replace("ß","&#223;",$tethys_js);
#echo($tethys_js);
$file_pointer = 'tethysArr.js';
file_put_contents($file_pointer, $tethys_js);
?>

<!-- /*
#auf Dublin Core..
$url = 'https://www.tethys.at/oai?verb=ListRecords&metadataPrefix=oai_dc';
#$url = 'https://www.tethys.at/oai?verb=ListRecords&metadataPrefix=oai_datacite';

$rt = '';

for ($x = 0; $x <= 3; $x++) {
    $xmlObj = simplexml_load_file($url . '&resumptionToken=' . $rt);
    $xmlNode = $xmlObj->ListRecords;
    $rt = $xmlNode->resumptionToken;
    echo($rt . '<br>');
    
    foreach ($xmlNode->record as $rNode) {
        $dc = $rNode->metadata->children('oai_dc', 1)->dc->children('dc', 1);
        
        $t = $dc->title;
        $lang = $dc->title->attributes("xml",TRUE)->lang;

        if ($lang == 'en') {
            $title = ((array)$t)[1];
        } else {
            $title = ((array)$t)[0];
        }

        $creator = $dc->creator;
        $subject = $dc->subject;
        $coverage = $dc->coverage;
        echo($title . '<br>'
        . implode(', ',(array)$creator) . '<br>'
        . implode(', ',(array)$subject) . '<br>'
        . implode(', ',(array)$coverage)) 
        . '<hr>';

        break;
    } 
}
*/ -->




