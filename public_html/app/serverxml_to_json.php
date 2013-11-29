<?php
$ctx=stream_context_create(
	array('http'=>
    	array(
        	'timeout' => 5
    	),
    	'ssl' =>
    	array(
    		'timeout' => 5
    	)
	)
);

$urls = Array('http://crazy-tronners.com/grid/serverxml.php', 'https://wrtlprnft.net/serverlist/serverxml.php');

$resource = $_GET['resource'] || "0";

$fileContents = @file_get_contents($urls[$resource], false, $ctx);


if(!$fileContents) {
	http_response_code(503);
	die();
}
$simpleXml = simplexml_load_string($fileContents);


$json = Array();
$json['age'] = (int)$simpleXml['age'];
$json['playerstotal'] = 0;

foreach($simpleXml->Server as $server) {
	//if((int)$server['numplayers'] == 0)
	//	break;
	if((int)$server['numplayers'] > 0 && $_GET['needCountries']) {
		try {
			$data = json_decode(file_get_contents("http://ip-api.com/json/".$server['ip']), true);
			$country = $data['countryCode'];
		} catch(Exception $e) {
			$country = "XX";
		}
	} else
		$country = "00";

	$players = Array();

	foreach($server->Player as $player) {
		$players[] = Array(
			'name' => (string)$player['name'],
			'gid'  => (string)$player['global_id']
		);
	}

	$json['Servers'][] = Array(
		'name'            => (string)$server['name'],
		'plainname'       => (string)preg_replace('/0x(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})|RESETT|)/','', $server['name']),
		'ip'              => (string)$server['ip'],
		'port'            => (string)$server['port'],
		'description'     => (string)$server['description'],
		'numplayers'      => (string)$server['numplayers'],
		'maxplayers'      => (string)$server['maxplayers'],
		'url'             => (string)$server['url'],
		'country'		  => (string)strtolower($country),
		'Players'         => $players,
		'showDetails'	  => false
	);

	$json['playerstotal'] += (int)$server['numplayers'];
}

echo json_encode($json);
?>