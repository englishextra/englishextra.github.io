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
	'lib/swamper.class.php',
	'inc/regional.inc',
	'inc/vars2.inc',
	'inc/pdo_sqlite_cache.inc'
);
foreach ($a_inc as $v) {require_once $relpa . $v;}
class GetJSON extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function conv_ents_to_json($s) {
		return $s = str_replace(array(
"&#8216;",
"&#8218;",
"?&#8222;",
"&#8220;",
"&#8221;",
"&#8364;",
"&#64;",
"&#8470;",
"&#171;",
"&#187;",
"&#45;",
"&#8211;",
"&#8212;",
"&#8217;",
"&#39;",
"&#8230;"
), array(
"\u2018",
"\u201A",
"\u0090\u201e",
"\u201C",
"\u201D",
"\u20AC",
"\x40",
"\u2116",
"\u00AB",
"\u00BB",
"\u2013",
"\u2013",
"\u2014",
"\x27",
"\x27",
"\u2026"
), $s);
	}
	public function db_table_exists($db_handler, $table) {
		return $r = $db_handler->query("SELECT count(*) from `" . $table . "`") ? true : false;
	}
	public function write_to_caching_db($db_handler, $table, $marker, $p) {
		if ($this->db_table_exists($db_handler, $table)) {
			$db_handler->exec("DELETE FROM " . $table . " WHERE 1;");
			$SQL = "INSERT INTO `" . $table . "` ";
			$SQL .= "VALUES(:adddate, :content);";
			$STH = $db_handler->prepare($SQL);
			$STH->bindValue(":adddate", $marker);
			/* $STH->bindValue(":content", $this->conv_symbs_to_ents($p)); */
			$STH->bindValue(":content", $p);
			$STH->execute();
		}
	}
}
if (!isset($GetJSON) || empty($GetJSON)) {
	$GetJSON = new GetJSON ();
}
/**
 * $load = 'https://sourceforge.net/projects/iv-scr-en-ru/files/stats/json?start_date=2010-06-05&end_date=2012-04-15';
 */
$load = $GetJSON->get_post('load');
/**
 * read from hash file if exists one
 */
$cache_table_name = $load ? "cache_getjson_" . md5($load) . "_json" : '';
$SQLITE_CACHE->exec("CREATE TABLE IF NOT EXISTS `" . $cache_table_name . "` ( `adddate` INTEGER NOT NULL, `content` TEXT )");
$r = '';
$adddate = '';
$content = '';
/* read from cache */
if ($GetJSON->db_table_exists($SQLITE_CACHE, $cache_table_name)) {
	$SQL = "SELECT `adddate`, `content` ";
	$SQL .= "FROM `" . $cache_table_name . "` ";
	$SQL .= " WHERE `adddate`!='' AND `content`!='' LIMIT :limit;";
	$STH = $SQLITE_CACHE->prepare($SQL);
	$a = null;
	/**
	 * http://www.if-not-true-then-false.com/2012/php-pdo-sqlite3-example/
	 * http://php.net/manual/en/sqlite3stmt.bindvalue.php
	 */
	$a[]=array(":limit", (int) 1);
	for ($i = 0;$i < count($a);$i++) {
		if (!empty($a[$i][0])) {
			$STH->bindValue($a[$i][0], $a[$i][1]);
		}
	}
	$STH->execute();
	while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
		$adddate = $fr[0];
		$content = $fr[1];
	}
}
if ($adddate
	&& $content
	&& ($adddate > $vars2_start_time && $adddate < $vars2_end_time)) {
	$r = 1;
	
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/json');	
	echo $GetJSON->conv_ents_to_json($content);
}
if (!$r) {
	$p = '';
	if (
		!empty($load)
		&& extension_loaded('openssl')
		) {
		/**
		 * ;extension=php_openssl.dll should be enabled in php.ini --
		 * if(extension_loaded('openssl')) {die("openssl");}
		 */
		$p = ( $p0 = @file_get_contents($load) ) ? $p0 : "";
		if ($p) {
			if (json_decode($p) === null) {
				$r = '';
			} else {
				$r = 1;
			}
		}
	}
	if (!empty($r)) {
		$p = str_replace(array("\r", "\0", "\x0B"), '', $p);
		/**
		 * cache output
		 */
		$GetJSON->write_to_caching_db($SQLITE_CACHE, $cache_table_name, $vars2_marker, $p);
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');
		echo $GetJSON->conv_ents_to_json($p). "\n";
	}
}
$SQLITE_CACHE = null;
ob_end_flush();
