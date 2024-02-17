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
$a_inc = array(
	'lib/swamper.class.php',
	'inc/regional.inc',
	'inc/vars2.inc',
	'inc/pdo_mysql.inc',
	'inc/pdo_sqlite_cache.inc'
);
foreach ($a_inc as $v) {require_once $relpa . $v;}
class Search extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function prepare_query($s) {
		$s = trim($s);
		$s = $this->safe_str($s);
		$s = str_replace("_", " ", $s);
		$s = $this->remove_tags($s);
		$s = $this->ord_hypher($s);
		$s = $this->ord_space($s);
		return $s;
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
	public function wordwrap_mb_str($s, $length = '') {
		if (!empty($length) && (mb_strlen($s, mb_detect_encoding($s)) > $length)) {
			$s = html_entity_decode($s, ENT_QUOTES, 'UTF-8');
			$s = mb_substr($s, 0, ($length - 5), mb_detect_encoding($s)) . '&#8230;';
			$s = $this->safe_html($s);
			$s = $this->ensure_amp($s);
		}
		return $s;
	}
	public function db_table_exists($db_handler, $table) {
		return $r = $db_handler->query("SELECT count(*) from `" . $table . "`") ? true : false;
	}
	public function write_to_caching_db2($db_handler, $table, $marker, $q, $p) {
		if ($this->db_table_exists($db_handler, $table)) {
			$db_handler->exec("DELETE FROM " . $table . " WHERE `query`='" . $this->conv_symbs_to_ents($q) . "';");
			$SQL = "INSERT INTO `" . $table . "` ";
			$SQL .= "VALUES(null, :adddate, :query, :content);";
			$STH = $db_handler->prepare($SQL);
			$STH->bindValue(":adddate", $marker);
			$STH->bindValue(":query", $q);
			$STH->bindValue(":content", $p);
			$STH->execute();
		}
	}
}
if (!isset($Search) || empty($Search)) {
	$Search = new Search ();
}
$query = $Search->get_post('q') ? $Search->get_post('q') : ($Search->get_post('s') ? $Search->get_post('s') : '');
if (!$query) {$query = $Search->get_post('term') ? $Search->get_post('term') : ($Search->get_post('search') ? $Search->get_post('search') : '');}
if (!$query) {$query = $Search->get_post('query') ? $Search->get_post('query') : '';}
$query = $Search->prepare_query($query);
$length = $Search->get_post('length');
if(!$length) {$length = 255;}
$limit = $Search->get_post('limit');
if (!$limit) {$limit = 4;}
$ignore_length = 2;
$query_length = ($query_length0 = mb_strlen($query, mb_detect_encoding($query, "UTF-8, ASCII"))) ? $query_length0 : 0;
$table_name = $pt_pages_table_name;
$table_name1 = $options_more_movies_3gp_ipod_psp_table_name;
$table_name2 = $pt_search_history_table_name;
$table_name3 = $dict_enru_general_table_name;
$table_name4 = $dict_ruen_general_table_name;
$table_name5 = $options_downloads_table_name;
if (!empty($query) && $query_length > $ignore_length) {
 	$query_for_db = $Search->conv_symbs_to_ents($query);
	$r = '';
	$p = '';
	$from_cache = '';
	$cache_table_name = 'cache_search_autocomplete';
	$SQLITE_CACHE->exec("CREATE TABLE IF NOT EXISTS `" . $cache_table_name . "` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `adddate` INTEGER NOT NULL, `query` TEXT, `content` TEXT )");
	if ($Search->db_table_exists($SQLITE_CACHE, $cache_table_name)) {
		$SQL = "SELECT `id`, `adddate`, `query`, `content` ";
		$SQL .= "FROM `" . $cache_table_name . "` ";
		$SQL .= " WHERE `id`!='' AND `adddate`!='' AND `query`!='' AND `content`!='' AND `query`=:query LIMIT :limit;";
		$STH = $SQLITE_CACHE->prepare($SQL);
		$a = null;
		/**
		 * if-not-true-then-false.com/2012/php-pdo-sqlite3-example/
		 * php.net/manual/en/sqlite3stmt.bindvalue.php
		 */
		$a[]=array(":query", $query_for_db);
		$a[]=array(":limit", (int) 1);
		for ($i = 0;$i < count($a);$i++) {
			if (!empty($a[$i][0])) {
				$STH->bindValue($a[$i][0], $a[$i][1]);
			}
		}
		$STH->execute();
		while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
			if ($fr[0]) {
				$r = 1;
				if ($fr[1] > $vars2_start_time && $fr[1] < $vars2_end_time) {
					$from_cache = 1;
				}
				$p = $Search->conv_ents_to_json($fr[3]);
			}
		}
	}
	if (!$r) {
	
	/* code.drewwilson.com/entry/autosuggest-jquery-plugin */
	/* localhost/libs/autoSuggestv14/shimansky.biz/autocomplete/?q=fhtyf */
	/* [
		{"value":"\u0410\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u0438\u0439 \u0431\u0435\u0437 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438","name":"\/"},
		{"value":"\u0418\u0440\u043b\u0430\u043d\u0434\u0435\u0446 \/ Kill the Irishman (2011)","name":"http:\/\/narod.ru\/disk\/37237341001\/kill_the_irishman_480x272.mp4.html"},
		{"value":"man \u2014 \u0447\u0435\u043b\u043e\u0432\u0435\u043a","name":"\/search\/?query=man"},
		{"value":"man\u2013hour \u2014 \u0447\u0435\u043b\u043e\u0432\u0435\u043a\u043e\u2013\u0447\u0430\u0441","name":"\/search\/?query=man%26%238211%3Bhour"},
		{"value":"man\u2013made \u2014 \u0438\u0441\u043a\u0443\u0441\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439","name":"\/search\/?query=man%26%238211%3Bmade"},
		{"value":"man\u2013power \u2014 \u0440\u0430\u0431\u043e\u0447\u0430\u044f \u0441\u0438\u043b\u0430","name":"\/search\/?query=man%26%238211%3Bpower"}
	] */
		try {
			$p = '[';
			$suggestions = '';
			$data = '';
			if ($Search->db_table_exists($DBH, $table_name)) {
				$SQL = "SELECT `id`, `page_title`, `page_url`, `description`, `wordhash` ";
				$SQL .= "FROM `" . $table_name . "` ";
				$SQL .= " WHERE `page_title`!='' AND `page_url`!='' AND `description`!='' AND `wordhash`!='' AND `page_title` LIKE :query OR `description` LIKE :query OR `wordhash` LIKE :query ORDER BY `page_title` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[]=array(":query", '%' . $query_for_db . '%', PDO::PARAM_STR);
				$a[]=array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0;$i < count($a);$i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$suggestions .= '{"value":' . $Search->conv_ents_to_json(json_encode($Search->wordwrap_mb_str($Search->conv_symbs_to_ents($fr[3]), 46))) . ',"name":' . json_encode($Search->ensure_amp($fr[2])) . '},';
					}
				}
			}
			if ($Search->db_table_exists($DBH, $table_name1)) {
				$SQL = "SELECT `id`, `value`, `text` ";
				$SQL .= "FROM `" . $table_name1 . "` ";
				$SQL .= " WHERE `value`!='' AND `text`!='' AND `text` LIKE :query ORDER BY `text` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[]=array(":query", '%' . $query_for_db . '%', PDO::PARAM_STR);
				$a[]=array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0;$i < count($a);$i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$suggestions .= '{"value":' . $Search->conv_ents_to_json(json_encode($Search->wordwrap_mb_str($Search->conv_symbs_to_ents($fr[2]), 46))) . ',"name":' . json_encode($Search->ensure_amp($fr[1])) . '},';
					}
				}
			}
			if ($Search->db_table_exists($DBH, $table_name5)) {
				$SQL = "SELECT `id`, `value`, `text` ";
				$SQL .= "FROM `" . $table_name5 . "` ";
				$SQL .= " WHERE `value`!='' AND `text`!='' AND `text` LIKE :query ORDER BY `text` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[]=array(":query", '%' . $query_for_db . '%', PDO::PARAM_STR);
				$a[]=array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0;$i < count($a);$i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$suggestions .= '{"value":' . $Search->conv_ents_to_json(json_encode($Search->wordwrap_mb_str($Search->conv_symbs_to_ents($fr[2]), 46))) . ',"name":' . json_encode($Search->ensure_amp($fr[1])) . '},';
					}
				}
			}
			if ($Search->db_table_exists($DBH, $table_name3)) {
				$SQL = "SELECT `id`, `entry`, `description` ";
				$SQL .= "FROM `" . $table_name3 . "` ";
				$SQL .= " WHERE `entry`!='' AND `description`!='' AND `entry` LIKE :query ORDER BY `entry` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[]=array(":query", $query_for_db . '%', PDO::PARAM_STR);
				$a[]=array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0;$i < count($a);$i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$suggestions .= '{"value":' . $Search->conv_ents_to_json(json_encode($Search->wordwrap_mb_str($Search->conv_symbs_to_ents($fr[1]), 21) . ' &#8212; ' . $Search->wordwrap_mb_str($Search->conv_symbs_to_ents($fr[2]), 21))) . ',"name":""},';
					}
				}
			}
			if ($Search->db_table_exists($DBH, $table_name4)) {
				$SQL = "SELECT `id`, `entry`, `description` ";
				$SQL .= "FROM `" . $table_name4 . "` ";
				$SQL .= " WHERE `entry`!='' AND `description`!='' AND `entry` LIKE :query ORDER BY `entry` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[]=array(":query", $query_for_db . '%', PDO::PARAM_STR);
				$a[]=array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0;$i < count($a);$i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$suggestions .= '{"value":' . $Search->conv_ents_to_json(json_encode($Search->wordwrap_mb_str($Search->conv_symbs_to_ents($fr[1]), 21) . ' &#8212; ' . $Search->wordwrap_mb_str($Search->conv_symbs_to_ents($fr[2]), 21))) . ',"name":""},';
					}
				}
			}
			if (!$r) {
				$us_locale = array("q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "\"", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/");
				$ru_locale = array("й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ".");
				$q_typo = $query;
				if (preg_match("/[a-z]+/i", $query)) {
					$q_typo = str_replace($us_locale, $ru_locale, $query);
				} else {
					$q_typo = str_replace($ru_locale, $us_locale, $query);
				}
				$r = 1;
				$suggestions .= '{"value":' . $Search->conv_ents_to_json(json_encode($Search->wordwrap_mb_str($Search->conv_symbs_to_ents($q_typo), 21))) . ',"name":' . json_encode('/search/?q=' . urlencode($Search->conv_symbs_to_ents($q_typo))) . '},';
			}
			$p .= preg_replace("/\,$/", "", $suggestions) . ']' . "\n";
			if ($Search->db_table_exists($DBH, $table_name2)) {
				if ($query_length > $ignore_length) {
					$SQL = "DELETE FROM `" . $table_name2 . "` ";
					$SQL .= "WHERE `query`=:query;";
					$STH = $DBH->prepare($SQL);
					$a = null;
					/**
					 * php.net/manual/en/pdostatement.bindparam.php
					 * The CORRECT solution is to leave clean the placeholder like this:
					 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
					 * And then add the percentages to the php variable where you store the keyword:
					 * $keyword = "%".$keyword."%";
					 */
					$a[]=array(":query", $query_for_db, PDO::PARAM_STR);
					for ($i = 0;$i < count($a);$i++) {
						if (!empty($a[$i][0])) {
							$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
						}
					}
					$STH->execute();
					$SQL = "INSERT INTO `" . $table_name2 . "` ";
					$SQL .= "(`id`,`adddate`,`query`,`host`,`ip`) ";
					$SQL .= "VALUES (0, :adddate, :query, :host, :ip);";
					$STH = $DBH->prepare($SQL);
					$a = null;
					$a[]=array(":adddate", (int) $vars2_marker, PDO::PARAM_INT);
					$a[]=array(":query", $query_for_db, PDO::PARAM_STR);
					$a[]=array(":host", $Search->ensure_amp($vars2_http_x_forwarded_for), PDO::PARAM_STR);
					$a[]=array(":ip", $Search->ensure_amp($vars2_remote_address), PDO::PARAM_STR);
					for ($i = 0;$i < count($a);$i++) {
						if (!empty($a[$i][0])) {
							$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
						}
					}
					$STH->execute();
				}
			}
			$DBH = null;
		} catch(PDOException $e) {
			echo $e->getMessage();
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
		if (!$from_cache) {
			$Search->write_to_caching_db2($SQLITE_CACHE, $cache_table_name, $vars2_marker, $query_for_db, $p);
		}
		echo $Search->conv_ents_to_json($p) . "\n";
	} else {
		echo '[{"value":"\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E","name":"\/search\/"}]' . "\n";
	}
}
$SQLITE_CACHE = null;
