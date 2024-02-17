<?php

/**
 * $shimansky.biz
 *
 * Static web site core scripts
 * @package shimansky.biz
 * @author Serguei Shimansky <serguei@shimansky.biz>
 * @copyright Serguei Shimansky 10:07 24.06.2012
 * @access public
 * @version 0.2
 * @link https://bitbucket.org/englishextra/shimansky.biz
 * @link https://github.com/englishextra/shimansky.biz.git
 * @link https://gist.github.com/2981888
 * @link http://pastebin.com/y2Gs4bzE
 */
$relpa = ($relpa0 = preg_replace("/[\/]+/", "/", $_SERVER['DOCUMENT_ROOT'] . '/')) ? $relpa0 : '';

if (!isset($pt_regional) || empty($pt_regional)) {
	include $relpa . 'inc/regional.inc';
}

if (!defined('PGSQL_DB_HOST')) {
	define('PGSQL_DB_HOST', $pt_regional['pgsql_db_host']);
}
if (!defined('PGSQL_DB_USER')) {
	define('PGSQL_DB_USER', $pt_regional['pgsql_db_user']);
}
if (!defined('PGSQL_DB_PASS')) {
	define('PGSQL_DB_PASS', $pt_regional['pgsql_db_pass']);
}
if (!defined('PGSQL_DB_NAME')) {
	define('PGSQL_DB_NAME', $pt_regional['pgsql_db_name']);
}

/**
 * create user?!
 */
$conn_string = "host=" . PGSQL_DB_HOST .
		" port=5432 dbname=" . PGSQL_DB_NAME .
		" user=" . PGSQL_DB_USER .
		" password=" . PGSQL_DB_PASS .
		" options='--client_encoding=UTF8'";

$dbconn4 = pg_connect($conn_string) or die(pg_errormessage());
