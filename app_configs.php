<?php
$params = $_SERVER['REQUEST_URI'];
if ($params) {
   $params = str_replace('/Store/', '', $params);
   echo file_get_contents('https://www.simicart.com/'.$params);
}
