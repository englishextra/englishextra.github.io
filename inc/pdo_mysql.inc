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

/**
 * http://habrahabr.ru/post/137664/
 * http://www.phpro.org/tutorials/Introduction-to-PHP-PDO.html#7.1
 * http://net.tutsplus.com/tutorials/php/why-you-should-be-using-phps-pdo-for-database-access/
 * http://wiki.hashphp.org/PDO_Tutorial_for_MySQL_Developers
 */
/*
  try {

  $DBH = new PDO("mysql:host=" . MYSQL_DB_HOST.";dbname=" . MYSQL_DB_NAME, MYSQL_DB_USER, MYSQL_DB_PASS,

  array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8', lc_time_names = 'ru_RU'")

  );

  $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

  } catch(PDOException $e) {

  echo $e->getMessage();
  }
 */

/**
 * http://code.google.com/p/digg/wiki/PDB
 */
require_once $relpa . 'lib/PDB.php';

try {
	$DBH = PDB::connect("mysql:host=" . MYSQL_DB_HOST .
					";dbname=" . MYSQL_DB_NAME, MYSQL_DB_USER, MYSQL_DB_PASS, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8', lc_time_names = 'ru_RU'")
	);

	$DBH->setFetchMode(PDO::FETCH_OBJ);
} catch (PDB_Exception $e) {

	/* die("Could not connect: " . $e->getMessage() . "\n"); */
	die("Could not connect: \n");
}
