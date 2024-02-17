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

if (!defined('MYSQL_DB_HOST')) {
	define('MYSQL_DB_HOST', $pt_regional['mysql_db_host']);
}
if (!defined('MYSQL_DB_USER')) {
	define('MYSQL_DB_USER', $pt_regional['mysql_db_user']);
}
if (!defined('MYSQL_DB_PASS')) {
	define('MYSQL_DB_PASS', $pt_regional['mysql_db_pass']);
}
if (!defined('MYSQL_DB_NAME')) {
	define('MYSQL_DB_NAME', $pt_regional['mysql_db_name']);
}

if (!isset($mysql_connect) || empty($mysql_connect)) {

	$mysql_connect = @mysql_connect(MYSQL_DB_HOST, MYSQL_DB_USER, MYSQL_DB_PASS) or die(@mysql_error());
	$mysql_select_db = @mysql_select_db(MYSQL_DB_NAME) or die(@mysql_error());
	@mysql_query("SET NAMES 'utf8'");
}
