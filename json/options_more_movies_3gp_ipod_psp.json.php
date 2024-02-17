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
	'inc/pdo_mysql.inc',
	'inc/pdo_sqlite_cache.inc'
);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
/* this script should be utf encoded */
class JSONOptions extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function conv_symbs_to_ents($s) {
		return $s = str_replace(array(
"‘",
"‚",
"„",
"“",
"”",
"€",
"@",
"№",
"«",
"»",
"-",
"–",
"—",
"’",
"'",
"…"
), array(
"&#8216;",
"&#8218;",
"&#8222;",
"&#8220;",
"&#8221;",
"&#8364;",
"&#64;",
"&#8470;",
"&#171;",
"&#187;",
"&#8211;",
"&#8211;",
"&#8212;",
"&#39;",
"&#39;",
"&#8230;"
), $s);
	}
	public function conv_ents_to_json($s) {
		return $s = str_replace(array(
"&#8216;",
"&#8218;",
"&#8222;",
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
			$STH->bindValue(":content", $this->conv_symbs_to_ents($p));
			$STH->execute();
		}
	}
}
if (!isset($JSONOptions) || empty($JSONOptions)) {
	$JSONOptions = new JSONOptions ();
}
/* http://www.google.ru/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&ved=0CGEQFjAC&url=http%3A%2F%2Fshimansky.biz%2Fjson%2Foptions_more_movies_3gp_ipod_psp.json.php&ei=PK8uUO67CIyFhQeI_oH4Dg&usg=AFQjCNGsVayFDHlN_iPNQijbktuzmQA4GQ&sig2=jYX2mJgHP3DCxGqKl_NLWw&cad=rjt */
if (!preg_match("/(http\:\/\/|https\:\/\/)(" . preg_quote($vars2_site_root_printable) . ")/i", $vars2_http_referer)) {
	die();
}
$table_name = $options_more_movies_3gp_ipod_psp_table_name;
$DBH->exec("CREATE TABLE IF NOT EXISTS `" . $table_name . "` ( `id` mediumint(9) NOT NULL AUTO_INCREMENT, `value` varchar(255) NOT NULL DEFAULT '', `text` mediumtext NOT NULL, PRIMARY KEY (`id`), FULLTEXT KEY `text` (`text`)) ENGINE=MyISAM DEFAULT CHARSET=utf8;");
/**
 * read from hash file if exists one
 */
$cache_table_name = "cache_" . $options_more_movies_3gp_ipod_psp_table_name . "_json";
$SQLITE_CACHE->exec("CREATE TABLE IF NOT EXISTS `" . $cache_table_name . "` ( `adddate` INTEGER NOT NULL, `content` TEXT )");
$r = '';
$adddate = '';
$content = '';
/* read from cache */
if ($JSONOptions->db_table_exists($SQLITE_CACHE, $cache_table_name)) {
	$SQL = "SELECT `adddate`, `content` ";
	$SQL .= "FROM `" . $cache_table_name . "` ";
	$SQL .= " WHERE `adddate`!='' AND `content`!='' LIMIT :limit;";
	$STH = $SQLITE_CACHE->prepare($SQL);
	$a = null;
	/**
	 * http://www.if-not-true-then-false.com/2012/php-pdo-sqlite3-example/
	 * http://php.net/manual/en/sqlite3stmt.bindvalue.php
	 */
	$a[] = array(":limit", (int) 1);
	for ($i = 0; $i < count($a); $i++) {
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
if (
		$adddate
		&& $content
		&& ($adddate > $vars2_start_time && $adddate < $vars2_end_time)
) {
	$r = 1;
	echo $JSONOptions->conv_ents_to_json($content);
}
if (!$r) {
	/**
	 * http://www.devbridge.com/projects/autocomplete/jquery/
	 * {
	 *  query:'Li',
	 *  suggestions:['Liberia','Libyan Arab Jamahiriya','Liechtenstein','Lithuania'],
	 *  data:['LR','LY','LI','LT']
	 * }
	 */
	try {
		$p = '';
		if ($JSONOptions->db_table_exists($DBH, $table_name)) {
			$SQL = "SELECT `id`, `value`, `text` ";
			$SQL .= "FROM `" . $table_name . "` ";
			$SQL .= " WHERE `value`!='' AND `text`!='' ORDER BY `text` ASC;";
			$STH = $DBH->prepare($SQL);
			$STH->execute();
			if ($STH->rowCount() > 0) {
				$r = 1;
				$p = '{"' . $table_name . '": [' . "\n" .
					/* '{"value": "","text": "..."},' . */
					"\n";
				while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
					$p .= '{"value":' . json_encode($JSONOptions->ensure_amp($fr[1])) . ', "text":' . json_encode($JSONOptions->conv_symbs_to_ents($fr[2])) . '},' . "\n";
				}
				$p = preg_replace("/\,\n$/", "", $p) . "\n" . ' ]}' . "\n";
			}
		}
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');
		if (!empty($r)) {
			$p = str_replace(array("\r", "\0", "\x0B"), '', $p);
			/**
			 * cache output
			 */
			$JSONOptions->write_to_caching_db($SQLITE_CACHE, $cache_table_name, $vars2_marker, $p);
			echo $JSONOptions->conv_ents_to_json($p) . "\n";
		} else {
			echo '{' . json_encode($table_name) . ': [ {"value": "","text": "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E"} ]}' . "\n";
		}
		$DBH = null;
	} catch (PDOException $e) {
		echo $e->getMessage();
	}
}
$SQLITE_CACHE = null;
ob_end_flush();
