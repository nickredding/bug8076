<?php
ob_start();
$indent = "&nbsp;&nbsp;&nbsp;";
$nl = "<br/>";
$postCount = count($_POST);
echo $nl . "POST data ($postCount)" . $nl;
var_export($_POST);
echo $nl;
ob_flush();
?>