<?php
ob_start();
$indent = "&nbsp;&nbsp;&nbsp;";
$nl = "<br/>";
/*
echo 'Server Name: ' . $_SERVER[SERVER_NAME] . $nl;
if (isset($_SERVER['REQUEST_METHOD'])) {
    echo "REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD'] . $nl;
}

$paramCount = count($_GET);
echo $nl . "<strong>URL parameters ($paramCount)</strong>" . $nl;
if ($paramCount > 0) {
    foreach ($_GET as $i=>$v) {
        echo $indent . "$i => $v $nl";
    }  
    echo $nl;
}
*/

$postCount = count($_POST);
echo $nl . "<strong>POST data ($postCount)</strong>" . $nl;
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'POST') {
    foreach ($_POST as $i=>$v) {
        echo $indent . "$i (" . gettype($i) . ") => $v (" . gettype($v) . ") $nl";
    }
}
/*
$cookieCount = count($_COOKIE);
echo $nl . "<strong>Cookies ($cookieCount)</strong>" . $nl;
foreach ($_COOKIE as $i=>$v) {
    echo $indent . "$i  => $v $nl";
}
echo $nl;

if ((isset($_GET['setcookiekey']) && $_GET['setcookiekey'] != '') || (isset($_POST['setcookiekey']) && $_POST['setcookiekey'] != '')) {
    if ((isset($_GET['setcookievalue']) && $_GET['setcookievalue'] != '') || (isset($_POST['setcookievalue']) && $_POST['setcookievalue'] != '')) {
        if (isset($_GET['permanentcookie']) || isset($_POST['permanentcookie'])) {
            $expires = time() + 60*60*24*30;
        }
        else {
            $expires = 0;
        }
        if (isset($_GET['secure']) || isset($_POST['secure'])) {
            $secure = true;
        }
        else {
            $secure = false;
        }
        $key = (isset($_GET['setcookiekey']) && $_GET['setcookiekey'] != '' ? $_GET['setcookiekey'] : $_POST['setcookiekey']);
        if (isset($_GET['httponly']) || isset($_POST['httponly'])) {
            $httponly = true;
        }
        else {
            $httponly = false;
        }
        $value = (isset($_GET['setcookievalue']) && $_GET['setcookievalue'] != '' ? $_GET['setcookievalue'] : $_POST['setcookievalue']);
        $value = (isset($_GET['setcookievalue']) && $_GET['setcookievalue'] != '' ? $_GET['setcookievalue'] : $_POST['setcookievalue']);
        if (isset($_POST['domain']) || isset($_GET['domain'])) {
            $domain = (isset($_GET['domain']) ? $_GET['domain'] : $POST['domain']);
        }
        else {
            $domain = '';
        }
        if ($secure) {
            $path = '/; SameSite=none';
        }
        else {
            $path = '/';
        }
        $path = '/';
        setcookie($key, $value, $expires, $path, $domain, $secure, $httponly);
        echo $nl . "SET COOKIE " . $key . ' = ' .  $value . ($expires == 0 ? '(session)' : '(permanent)') . " path=$path" . ($domain == '' ? '' : " domain=$domain") . ($httponly ? ' httpOnly' : '') . $nl;
    }
    else {
        echo $nl . $nl . "<strong>ERROR: setcookievalue missing or empty</strong>" . $nl . $nl;
    }
}

if (isset($_GET['deletecookie']) && $_GET['deletecookie'] != '') {
    setcookie($_GET['deletecookie'], '', time() - 3600);
    echo $nl . $nl . "DELETE COOKIE " . $_GET['deletecookie'] . $nl . $nl;
}
*/
ob_flush();
?>