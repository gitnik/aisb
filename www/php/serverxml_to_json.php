<?php

$memcached = new \Memcached;
$memcached->addServer('127.0.0.1', 11211);

// Cache time in seconds
$cacheTime = 60;
$cacheKey = "fullpage:{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";

$html = $memcached->get($cacheKey);

$status = 200;

if ( ! $html) {

    $urls = ['http://crazy-tronners.com/grid/serverxml.php', 'https://wrtlprnft.net/serverlist/serverxml.php'];

    try {
        $data = convertXmlToJson(
            getXmlFile($urls)
        );
    } catch (\RuntimeException $e) {
        $data = $e->getMessage();
        $status = 500;
    }

    $html = json_encode($data);

    $memcached->set($cacheKey, $html, $cacheTime);
}

http_response_code($status);
header('Content-type: application/json');
echo $html;


function getXmlFile(array $urls, $resourceId = 0) {

    $context = stream_context_create(
        [
            'http' => [
                    'timeout' => 5
                ],
            'ssl'  => [
                    'timeout' => 5
                ]
        ]
    );

    $fileContents = @file_get_contents($urls[$resourceId], false, $context);


    if ($fileContents === false) {
        /**
         * Try again with next resource
         */
        if($resourceId == 0) {
            return getXmlFile($urls, 1);
        }

        throw new \RuntimeException("Both resources seem to be down at the moment");
    }

    return $fileContents;
}

function convertXmlToJson($xmlFile) {

    $simpleXml = simplexml_load_string($xmlFile);

    $json                 = [];
    $json['age']          = (int)$simpleXml['age'];
    $json['playersTotal'] = 0;

    foreach ($simpleXml->Server as $server) {
        $players = [];

        foreach ($server->Player as $player) {
            $players[] = [
                'name' => (string)$player['name'],
                'gid'  => (string)$player['global_id']
            ];
        }

        $json['servers'][] = [
            'name'        => (string)$server['name'],
            'plainName'   => (string)preg_replace(
                    '/0x(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})|RESETT|)/',
                    '',
                    $server['name']
                ),
            'ip'          => (string)$server['ip'],
            'port'        => (string)$server['port'],
            'description' => (string)$server['description'],
            'numPlayers'  => (string)$server['numplayers'],
            'maxPlayers'  => (string)$server['maxplayers'],
            'url'         => (string)$server['url'],
            'country'     => "",
            'Players'     => $players,
            'showDetails' => false
        ];

        $json['playersTotal'] += (int)$server['numPlayers'];
    }

    return $json;
}