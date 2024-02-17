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
foreach ($a_inc as $v) {require_once $relpa . $v;}
class RandomQuote extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function prepare_str($s) {
		$s = stripslashes($s);
		$a = array(
			'(' => "\(",
			')' => "\)",
			'"' => "'",
			"'" => "\'",//use this before '&#39;',"\'"
			'&#39;' => "\'",
			'&#8212;' => "—",
			'&#171;' => "\'",
			'&#187;' => "\'",
			'&quot;' => "\'",
			'&#8230;' => "\u2026",
			'&#64;' => "\x40"
		);
		foreach ($a as $k => $v) {
			$s = str_replace($k, $v, $s);
		}
		$s = $this->remove_ents($s);
		return $s ;
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
			/* $STH->bindValue(":content", str_replace(array("&#8212;", "&#8211;", "&#39;"), array("—", "-", "'"), $this->conv_symbs_to_ents($p))); */
			$STH->bindValue(":content", $p);
			$STH->execute();
		}
	}
}
if (!isset($RandomQuote) || empty($RandomQuote)) {
	$RandomQuote = new RandomQuote ();
}
$table_name = $dict_enen_quotations_table_name;
$cache_json_table_name = "cache_" . $dict_enen_quotations_table_name . "_json";
$cache_js_table_name = "cache_" . $dict_enen_quotations_table_name . "_js";
$SQLITE_CACHE->exec("CREATE TABLE IF NOT EXISTS `" . $cache_json_table_name . "` ( `adddate` INTEGER NOT NULL, `content` TEXT )");
$SQLITE_CACHE->exec("CREATE TABLE IF NOT EXISTS `" . $cache_js_table_name . "` ( `adddate` INTEGER NOT NULL, `content` TEXT )");
$type = $RandomQuote->get_post('type');
$code = $RandomQuote->get_post('code');
if ($code == "JSON") {
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/json');
} else {
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/x-javascript');
}
if (!$type || $type == 'random') {
	/**
	 * output as JSON
	 */
 	$p_json = '';
	$adddate_json = '';
	$content_json = '';
	if ($RandomQuote->db_table_exists($SQLITE_CACHE, $cache_json_table_name)) {
		$SQL = "SELECT `adddate`, `content` ";
		$SQL .= "FROM `" . $cache_json_table_name . "` ";
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
			$adddate_json = $fr[0];
			$content_json = $fr[1];
		}
	}
	if ($adddate_json
		&& $content_json
		&& ($adddate_json > $vars2_start_time && $adddate_json < $vars2_end_time)) {
		$p_json = $content_json;
	}
	/**
	 * output as inline javascript
	 */
 	$p_js = "";
	$adddate_js = '';
	$content_js = '';
	if ($RandomQuote->db_table_exists($SQLITE_CACHE, $cache_js_table_name)) {
		$SQL = "SELECT `adddate`, `content` ";
		$SQL .= "FROM `" . $cache_js_table_name . "` ";
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
			$adddate_js = $fr[0];
			$content_js = $fr[1];
		}
	}
	if ($adddate_js
			&& $content_js
			&& ($adddate_js > $vars2_start_time && $adddate_js < $vars2_end_time)) {
		$p_js = $content_js;
	}
	/**
	 * switcher: from cache else dynamic
	 */
	$r = '';
	if ($p_json && $p_js) {
		$r = 1;
	}
	if ($r) {
		if ($code == "JSON") {
			echo "\n" . $p_json;
		} else {
			echo "\n" . $p_js;
		}
		exit;
	}
	/**
	* dynamic, not from cache
	*/
	if (!$r) {
		/**
		 * try load DB table
		 */
		$re0 = '';
		$re1 = '';
		$re2 = '';
		$re3 = '';
		try {
			/**
			 * if table exists
			 */
			if ($RandomQuote->db_table_exists($DBH, $table_name)) {
				/**
				 * http://stackoverflow.com/questions/10439747/pdo-changing-old-mysql-fetch-object
				 */
				$offset_result = $DBH->query("SELECT FLOOR(RAND() * COUNT(*)) AS `offset` FROM `" . $table_name . "`;");
				$offset_row = $offset_result->fetch(PDO::FETCH_OBJ);
				$offset = $offset_row->offset;
				$SQL = "SELECT `id`, `entry`, `author`, `subject` ";
				$SQL .= "FROM `" . $table_name . "` ";
				$SQL .= "WHERE `id`!='' AND `entry`!='' LIMIT :offset, 1;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * http://www.if-not-true-then-false.com/2012/php-pdo-sqlite3-example/
				 * http://php.net/manual/en/sqlite3stmt.bindvalue.php
				 */
				/**
				 * Cast the value to an integer before passing it to the bind function. (int)
				 * http://stackoverflow.com/questions/2269840/php-pdo-bindvalue-in-limit
				 */
				$a[]=array(":offset", (int) $offset, PDO::PARAM_INT);
				for ($i = 0;$i < count($a);$i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				/**
				 * http://stackoverflow.com/questions/460010/work-around-for-php5s-pdo-rowcount-mysql-issue
				 * replaces: if (mysql_num_rows($query) > 0) {
				 */
				//if ($DBH->query("SELECT FOUND_ROWS()")->fetchColumn() > 0) {
				if ($STH->rowCount() > 0) {
					/**
					 * replaces while ($fr = mysql_fetch_row($query)) {
					 */
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$re0 = $fr[0];
						$re1 = $fr[1];
						$re2 = $fr[2];
						$re3 = $fr[3];
					}
				}
			}
			$DBH = null;
		} catch(PDOException $e) {
			echo $e->getMessage();
		}
		/**
		 * this is used to load via JSON
		 */
		$p_json = "";
		if ($re2) {
			$p_json .= "{\"random_quote\": [{\"quote\": \"" . $RandomQuote->prepare_str($re1) . "\",\"author\": \"" . $RandomQuote->prepare_str($re2) . "\",\"about\": \"" . $RandomQuote->prepare_str($re3) . "\"}]}\n";
		}
		/**
		 * this is used to load via JavaScript
		 * <div id="load_quote"></div>
		 * <script src="/scripts/random_quote/"></script>
		 */
		$p_js = "";
		if ($re2) {
			$p = "";
			$p .= '(function (span) {' . "\n";
			$p .= '	"use strict";' . "\n";
			$p .= '	if (span) {' . "\n";
			$p .= '		span.appendChild(document.createTextNode(\'' . $RandomQuote->prepare_str($re1) . '\'));' . "\n";
			$p .= '		span.appendChild(document.createElement("br"));' . "\n";
			$p .= '		var span2 = document.createElement("span"),' . "\n";
			$p .= '			span3 = document.createElement("span");' . "\n";
			$p .= '		span2.setAttribute("style", "/*font-size:smaller;*/font-style:italic;float:right;clear:both;");' . "\n";
			$p .= '		span2.appendChild(document.createTextNode(\' \u2014 ' . $RandomQuote->prepare_str($re2) . '\'));' . "\n";
			$p .= '		span3.setAttribute("style", "clear:both;display:block;padding:0;margin:0;");' . "\n";
			if ($re3) {
				$p .= '		span2.appendChild(document.createTextNode(" (on ' . $RandomQuote->prepare_str($re3) . ')"));' . "\n";
			}
			$p .= '		span.appendChild(span2);' . "\n";
			$p .= '		span.appendChild(span3);' . "\n";
			$p .= '	}' . "\n";
			$p .= '}' . "\n";
			$p .= '	(document.getElementById("load_quote") || ""));' . "\n";
			$p_js = $p;
		}
		/**
		 * cache as javascript and JSON
		 */
		if (! $adddate_json
			|| ! $adddate_js
			|| ! $content_json
			|| ! $content_js
			|| ($adddate_json < $vars2_start_time || $adddate_json > $vars2_end_time)
			|| ($adddate_js < $vars2_start_time || $adddate_js > $vars2_end_time)
			) {
			$p_json = str_replace(array("\r", "\0", "\x0B"), '', $p_json);
			$p_js = str_replace(array("\r", "\0", "\x0B"), '', $p_js);
			/**
			 * cache output
			 */
			$RandomQuote->write_to_caching_db($SQLITE_CACHE, $cache_json_table_name, $vars2_marker, $p_json);
			$RandomQuote->write_to_caching_db($SQLITE_CACHE, $cache_js_table_name, $vars2_marker, $p_js);
		}
		if ($code == "JSON") {
			echo $p_json;
		} else {
			echo $p_js;
		}
	}
}
$SQLITE_CACHE = null;
ob_end_flush();
