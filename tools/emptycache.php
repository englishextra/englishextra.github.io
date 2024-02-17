<?php
/**
 * $shimansky.biz
 *
 * Static web site core scripts
 * @category PHP
 * @access public
 * @copyright (c) 2012 Shimansky.biz
 * @author Serguei Shimansky <serguei@shimansky.biz>
 * @license http://opensource.org/licenses/bsd-license.php
 * @package shimansky.biz
 * @link https://bitbucket.org/englishextra/shimansky.biz
 * @link https://github.com/englishextra/shimansky.biz.git
 */
$relpa = ($relpa0 = preg_replace("/[\/]+/", "/", $_SERVER['DOCUMENT_ROOT'] . '/')) ? $relpa0 : '';
ob_start();
$a_inc = array(
	'inc/regional.inc',
	'inc/adminauth.inc',
	'lib/swamper.class.php'
);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
class EmptyCache extends Swamper {
	function __construct() {
		parent::__construct();
	}
}
if (!isset($EmptyCache) || empty($EmptyCache)) {
	$EmptyCache = new EmptyCache ();
}
/**
 * This is the directory folder that the files reside in to be deleted.
 */
$cache_dir = 'temp/cache/';
$dir = $relpa . $cache_dir;
$EmptyCache->remove_dir_content($dir);
ob_end_flush();
