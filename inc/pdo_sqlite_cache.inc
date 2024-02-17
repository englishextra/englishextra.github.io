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

if (!defined('SQLITE_CACHE_PATH')) {
	define('SQLITE_CACHE_PATH', $pt_regional['sqlite_cache_path']);
}

try {
	$SQLITE_CACHE = new PDO("sqlite:" . $relpa . SQLITE_CACHE_PATH);

	$SQLITE_CACHE->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDB_Exception $e) {

	die("Could not connect: " . $e->getMessage() . "\n");
}
