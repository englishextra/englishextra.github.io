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
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
/* this script should be utf encoded */
class Search extends Swamper {
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
/*"-",*/
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
/*"&#8211;",*/
"&#8211;",
"&#8212;",
"&#39;",
"&#39;",
"&#8230;"
), $s);
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
			$STH->bindValue(":query", $this->conv_symbs_to_ents($q));
			$STH->bindValue(":content", $this->conv_symbs_to_ents($p));
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
if (!$length) {
	$length = 255;
}
$limit = $Search->get_post('limit');
if (!$limit) {
	$limit = 4;
}
$ignore_length = 2;
$query_length = ($query_length0 = mb_strlen($query, mb_detect_encoding($query, "UTF-8, ASCII"))) ? $query_length0 : 0;
$table_name = $pt_pages_table_name;
$table_name1 = $options_more_movies_3gp_ipod_psp_table_name;
$table_name2 = $pt_search_history_table_name;
$table_name3 = $dict_enru_general_table_name;
$table_name4 = $dict_ruen_general_table_name;
$table_name5 = $options_downloads_table_name;
$r = '';
$p = '';
if (!empty($query) && $query_length > $ignore_length) {
	/* read from cache */
	$from_cache = '';
	$cache_table_name = 'cache_search';
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
		$a[] = array(":query", $Search->conv_symbs_to_ents($query));
		$a[] = array(":limit", (int) 1);
		for ($i = 0; $i < count($a); $i++) {
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
				$p = "\n\n" . "<!-- from " . $cache_table_name . " -->" . "\n\n" . $fr[3];
			}
		}
	}
	if (!$r) {
		try {
			/* $p = '<h2>&#1056;&#1077;&#1079;&#1091;&#1083;&#1100;&#1090;&#1072;&#1090;&#1099; &#1087;&#1086;&#1080;&#1089;&#1082;&#1072;</h2>' . "\n" . '<ol>' . "\n"; */
			/* $p = '<h2>&#1056;&#1077;&#1079;&#1091;&#1083;&#1100;&#1090;&#1072;&#1090;&#1099; &#1087;&#1086;&#1080;&#1089;&#1082;&#1072;</h2>' . "\n"; */
			$p .= '<ol class="jqm-list">' . "\n";
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
				$a[] = array(":query", '%' . $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li><a href="' . $Search->ensure_amp($fr[2]) . '" class="ui-link" data-ajax="false">' . $Search->safe_html($fr[3], 65) . '</a></li>' . "\n";
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
				$a[] = array(":query", '%' . $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li><a href="' . $Search->ensure_amp($fr[1]) . '" class="ui-link" data-ajax="false">' . $Search->safe_html($fr[2], 65) . '</a></li>' . "\n";
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
				$a[] = array(":query", '%' . $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li><a href="' . $Search->ensure_amp($fr[1]) . '" class="ui-link" data-ajax="false">' . $Search->safe_html($fr[2], 65) . '</a></li>' . "\n";
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
				$a[] = array(":query", $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li>' . $Search->safe_html($fr[1], 28) . '&#160;&#8212; ' . $Search->safe_html($fr[2], 28) . '</li>' . "\n";
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
				$a[] = array(":query", $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li>' . $Search->safe_html($fr[1], 28) . '&#160;&#8212; ' . $Search->safe_html($fr[2], 28) . '</li>' . "\n";
					}
				}
			}
			$p .= '</ol>' . "\n";
			/* write search history */
			if ($Search->db_table_exists($DBH, $table_name2)) {
				if (mb_strlen($query, mb_detect_encoding($query)) > $ignore_length) {
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
					$a[] = array(":query", $Search->conv_symbs_to_ents($query), PDO::PARAM_STR);
					for ($i = 0; $i < count($a); $i++) {
						if (!empty($a[$i][0])) {
							$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
						}
					}
					$STH->execute();
					/* switching the value to 0 workes for AUTO_INCREMENT field */
					$SQL = "INSERT INTO `" . $table_name2 . "` ";
					$SQL .= "(`id`,`adddate`,`query`,`host`,`ip`) ";
					$SQL .= "VALUES (0, :adddate, :query, :host, :ip);";
					$STH = $DBH->prepare($SQL);
					$a = null;
					$a[] = array(":adddate", (int) $vars2_marker, PDO::PARAM_INT);
					$a[] = array(":query", $Search->conv_symbs_to_ents($query), PDO::PARAM_STR);
					$a[] = array(":host", $Search->ensure_amp($vars2_http_x_forwarded_for), PDO::PARAM_STR);
					$a[] = array(":ip", $Search->ensure_amp($vars2_remote_address), PDO::PARAM_STR);
					for ($i = 0; $i < count($a); $i++) {
						if (!empty($a[$i][0])) {
							$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
						}
					}
					$STH->execute();
				}
			}
			if (!empty($r)) {
				if (!$from_cache) {
					$Search->write_to_caching_db2($SQLITE_CACHE, $cache_table_name, $vars2_marker, $query, $p);
				}
			}
			$DBH = null;
		} catch (PDOException $e) {
			echo $e->getMessage();
		}
	}
}
$SQLITE_CACHE = null;
?><!DOCTYPE html>
<!-- 1. use /tools/modularscale/index.html?15&px&1.25,1.125&web&text for font size and line height
2. lazyload images
3. remove font face, display block, opacity 1, visibility visible in critical inline css
4. set font display swap in font face in css -->
<html class="no-js" lang="ru">
	<head>
		<meta charset="utf-8" />
		<!-- <meta http-equiv="x-ua-compatible" content="ie=edge" /> -->
		<!-- https://content-security-policy.com/ --><meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' 'unsafe-inline' https:; frame-src 'self' https:; media-src 'self' https:; img-src 'self' 'unsafe-inline' https: data:" />
		<meta name="HandheldFriendly" content="True" />
		<meta name="MobileOptimized" content="320" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content="Поиск по сайту" /><title>Поиск</title>
		<style>
			body {
				font-family: "Roboto";
				color: transparent;
				background-color: #F0F0F0;
			}
			body,
			a {
				color: transparent;
			}
			template,
			img,
			svg,
			canvas {
				display: none;
			}
			html,
			body {
				height: 100%;
			}
			html {
				font-size: 15px;
				line-height: 20px;
			}
			body {
				font-size: 1.000rem;
				line-height: 1.333rem;
				margin: 0;
			}
			.container {
				visibility: hidden;
				opacity: 0;
			}
			@media only screen {
				html {
					font-size: 12px;
				}
			}
			@media only screen and (max-width:40em) {
				html {
					font-size: 12px;
				}
			}
			@media only screen and (min-width:40.063em) {
				html {
					font-size: 12px;
				}
			}
			@media only screen and (min-width:40.063em) and (max-width:64em) {
				html {
					font-size: 15px;
				}
			}
			@media only screen and (min-width:64.063em) {
				html {
					font-size: 15px;
				}
			}
			@media only screen and (min-width:64.063em) and (max-width:90em) {
				html {
					font-size: 15px;
				}
			}
			@media only screen and (min-width:90.063em) {
				html {
					font-size: 15px;
				}
			}
			@media only screen and (min-width:90.063em) and (max-width:120em) {
				html {
					font-size: 18px;
				}
			}
			@media only screen and (min-width:120.063em) {
				html {
					font-size: 18px;
				}
			}
		</style>
		<noscript>
			<link rel="stylesheet" href="../libs/search/css/bundle.min.css" />
			<style>
				.container {
					visibility: visible;
					opacity: 1;
				}
			</style>
		</noscript>
	</head>
	<body>
	<body>
		<!-- https://haltersweb.github.io/Accessibility/svg.html --><svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" focusable="false">
			<defs>
				<symbol id="ui-icon-Up" viewBox="0 0 96 96">
					<path d="M66.5,46.4l-1.8,1.8L49.3,32.8V68h-2.5V32.8L31.3,48.2l-1.8-1.8L48,28L66.5,46.4z"></path>
				</symbol>
				<symbol id="ui-icon-Like" viewBox="0 0 96 96">
					<path d="M64.3,42.9c0.5,0,1,0.1,1.4,0.3c0.5,0.2,0.9,0.5,1.2,0.8c0.3,0.3,0.6,0.8,0.8,1.2c0.2,0.5,0.3,1,0.3,1.5 c0,0.4-0.1,0.8-0.2,1.2l-5,15.4c-0.1,0.4-0.3,0.7-0.5,1.1s-0.5,0.6-0.8,0.8c-0.3,0.2-0.7,0.4-1,0.5C60,65.9,59.7,66,59.3,66h-10 c-2.3,0-4.6-0.5-6.7-1.4c-0.9-0.4-1.9-0.7-2.8-0.9c-0.9-0.2-1.9-0.3-2.9-0.3H28v-18h8.1c0.8,0,1.6-0.2,2.4-0.5 c0.7-0.3,1.4-0.8,2-1.4l12.1-12.5c0.3-0.3,0.7-0.6,1-0.8c0.3-0.2,0.7-0.3,1.2-0.3c0.4,0,0.8,0.1,1.2,0.3s0.7,0.4,1,0.7 c0.3,0.3,0.5,0.6,0.7,1c0.2,0.4,0.2,0.8,0.2,1.2c0,1.1-0.1,2.1-0.4,3.1c-0.2,1-0.6,2-1,2.9c-0.3,0.6-0.5,1.2-0.7,1.8 s-0.3,1.2-0.4,1.9L64.3,42.9L64.3,42.9z M59.3,63.4c0.3,0,0.5-0.1,0.7-0.2c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.2,0.2-0.5,0.4-1.1 c0.2-0.5,0.4-1.2,0.6-1.9c0.2-0.8,0.5-1.6,0.8-2.5c0.3-0.9,0.6-1.8,0.9-2.7c0.3-0.9,0.6-1.8,0.9-2.7c0.3-0.9,0.5-1.7,0.8-2.4 c0.2-0.7,0.4-1.3,0.5-1.7c0.1-0.4,0.2-0.7,0.2-0.8c0-0.3-0.1-0.6-0.4-0.9c-0.2-0.3-0.5-0.4-0.9-0.4H53c0-0.7,0-1.4,0-2 s0.1-1.2,0.2-1.8s0.2-1.2,0.4-1.7c0.2-0.6,0.4-1.2,0.7-1.8c0.4-0.8,0.6-1.6,0.8-2.4c0.2-0.8,0.3-1.7,0.3-2.5c0-0.2-0.1-0.3-0.2-0.5 c-0.1-0.1-0.3-0.2-0.4-0.2c-0.1,0-0.1,0-0.2,0.1l-0.2,0.2L42.3,45.4c-0.4,0.4-0.9,0.8-1.3,1.1c-0.5,0.3-1,0.6-1.5,0.8 c-1,0.5-2.2,0.7-3.3,0.7h-5.6v12.9h6.2c2.3,0,4.6,0.5,6.7,1.4c1.9,0.8,3.8,1.2,5.8,1.2L59.3,63.4L59.3,63.4z"></path>
				</symbol>
				<symbol id="ui-icon-Share" viewBox="0 0 96 96">
					<path d="M65.1,54c0.4,0.3,0.8,0.6,1.2,1c0.4,0.4,0.7,0.8,0.9,1.3c0.2,0.5,0.4,0.9,0.6,1.4c0.1,0.5,0.2,1,0.2,1.5 c0,0.9-0.2,1.7-0.5,2.4c-0.3,0.8-0.8,1.4-1.3,2c-0.6,0.6-1.2,1-2,1.3c-0.8,0.3-1.6,0.5-2.4,0.5c-1.2,0-2.3-0.3-3.3-1 c-1.5,1.1-3.1,2-4.9,2.6S49.9,68,48,68c-1.9,0-3.7-0.3-5.5-0.9s-3.4-1.4-4.9-2.6c-1,0.6-2.1,1-3.3,1c-0.9,0-1.7-0.2-2.4-0.5 s-1.4-0.8-2-1.3c-0.6-0.6-1-1.2-1.3-2c-0.3-0.8-0.5-1.6-0.5-2.4c0-0.5,0.1-1,0.2-1.5c0.1-0.5,0.3-1,0.6-1.4c0.2-0.5,0.6-0.9,0.9-1.3 c0.4-0.4,0.8-0.7,1.2-1c-0.1-0.6-0.2-1.2-0.3-1.7c-0.1-0.6-0.1-1.2-0.1-1.7c0-1.8,0.3-3.5,0.8-5.2c0.5-1.7,1.3-3.2,2.3-4.7 c1-1.4,2.2-2.7,3.5-3.8c1.4-1.1,2.9-2,4.6-2.6c0-0.8,0.2-1.6,0.5-2.4s0.8-1.4,1.3-2c0.6-0.6,1.2-1,2-1.3c0.8-0.3,1.6-0.5,2.4-0.5 c0.8,0,1.6,0.2,2.4,0.5s1.4,0.8,2,1.3c0.6,0.6,1,1.2,1.3,2s0.5,1.5,0.5,2.4c1.7,0.6,3.2,1.5,4.6,2.6c1.4,1.1,2.6,2.4,3.5,3.8 c1,1.4,1.7,3,2.3,4.7c0.5,1.7,0.8,3.4,0.8,5.2c0,0.6,0,1.2-0.1,1.7C65.4,52.8,65.3,53.4,65.1,54L65.1,54z M48,30.5 c-0.5,0-1,0.1-1.5,0.3s-0.9,0.5-1.2,0.8c-0.3,0.3-0.6,0.7-0.8,1.2c-0.2,0.5-0.3,0.9-0.3,1.5c0,0.5,0.1,1,0.3,1.5 c0.2,0.5,0.5,0.9,0.8,1.2c0.3,0.3,0.7,0.6,1.2,0.8S47.5,38,48,38s1-0.1,1.5-0.3c0.5-0.2,0.9-0.5,1.2-0.8c0.3-0.3,0.6-0.7,0.8-1.2 c0.2-0.5,0.3-0.9,0.3-1.5c0-0.5-0.1-1-0.3-1.5c-0.2-0.5-0.5-0.9-0.8-1.2c-0.3-0.3-0.7-0.6-1.2-0.8S48.5,30.5,48,30.5z M30.5,59.3 c0,0.5,0.1,1,0.3,1.5c0.2,0.5,0.5,0.9,0.8,1.2c0.3,0.3,0.7,0.6,1.2,0.8c0.5,0.2,0.9,0.3,1.5,0.3c0.5,0,1-0.1,1.5-0.3 s0.9-0.5,1.2-0.8s0.6-0.7,0.8-1.2s0.3-0.9,0.3-1.5s-0.1-1-0.3-1.5s-0.5-0.9-0.8-1.2s-0.7-0.6-1.2-0.8s-0.9-0.3-1.5-0.3 c-0.5,0-1,0.1-1.5,0.3c-0.5,0.2-0.9,0.5-1.2,0.8c-0.3,0.3-0.6,0.7-0.8,1.2C30.6,58.2,30.5,58.7,30.5,59.3z M48,65.5 c1.5,0,3-0.2,4.5-0.7s2.8-1.1,4.1-2c-0.4-0.5-0.6-1.1-0.8-1.7c-0.2-0.6-0.3-1.2-0.3-1.8c0-0.9,0.2-1.7,0.5-2.4 c0.3-0.8,0.8-1.4,1.3-2c0.6-0.6,1.2-1,2-1.3c0.8-0.3,1.6-0.5,2.4-0.5c0.2,0,0.3,0,0.5,0c0.2,0,0.3,0,0.5,0.1 c0.2-0.9,0.2-1.7,0.2-2.6c0-1.5-0.2-3-0.7-4.4c-0.4-1.4-1.1-2.7-1.9-3.9c-0.8-1.2-1.8-2.3-2.9-3.2c-1.1-0.9-2.4-1.7-3.8-2.3 c-0.2,0.6-0.6,1.1-0.9,1.6c-0.4,0.5-0.9,0.9-1.4,1.2s-1.1,0.6-1.6,0.8c-0.6,0.2-1.2,0.3-1.8,0.3c-0.6,0-1.2-0.1-1.8-0.3 c-0.6-0.2-1.1-0.4-1.6-0.8c-0.5-0.3-1-0.7-1.4-1.2c-0.4-0.5-0.7-1-0.9-1.6c-1.4,0.6-2.7,1.4-3.8,2.3c-1.1,0.9-2.1,2-2.9,3.2 s-1.4,2.5-1.9,3.9C33.2,47.5,33,49,33,50.5c0,0.9,0.1,1.7,0.2,2.6c0.9-0.2,1.8-0.1,2.7,0.2c0.9,0.3,1.7,0.7,2.3,1.3 c0.7,0.6,1.2,1.3,1.6,2.1s0.6,1.7,0.6,2.7c0,0.6-0.1,1.2-0.3,1.8c-0.2,0.6-0.5,1.2-0.8,1.7c1.3,0.9,2.6,1.6,4.1,2 C45,65.3,46.5,65.5,48,65.5L48,65.5z M61.7,63c0.5,0,1-0.1,1.5-0.3c0.5-0.2,0.9-0.5,1.2-0.8s0.6-0.7,0.8-1.2 c0.2-0.5,0.3-0.9,0.3-1.5s-0.1-1-0.3-1.5c-0.2-0.5-0.5-0.9-0.8-1.2s-0.7-0.6-1.2-0.8c-0.5-0.2-0.9-0.3-1.5-0.3c-0.5,0-1,0.1-1.5,0.3 c-0.5,0.2-0.9,0.5-1.2,0.8c-0.3,0.3-0.6,0.7-0.8,1.2c-0.2,0.5-0.3,0.9-0.3,1.5c0,0.5,0.1,1,0.3,1.5c0.2,0.5,0.5,0.9,0.8,1.2 c0.3,0.3,0.7,0.6,1.2,0.8C60.7,62.9,61.2,63,61.7,63z"></path>
				</symbol>
				<symbol id="ui-icon-Search" viewBox="0 0 32 32">
					<path d="M21 0q1.516 0 2.922 0.391t2.625 1.109 2.227 1.727 1.727 2.227 1.109 2.625 0.391 2.922-0.391 2.922-1.109 2.625-1.727 2.227-2.227 1.727-2.625 1.109-2.922 0.391q-1.953 0-3.742-0.656t-3.289-1.891l-12.266 12.25q-0.297 0.297-0.703 0.297t-0.703-0.297-0.297-0.703 0.297-0.703l12.25-12.266q-1.234-1.5-1.891-3.289t-0.656-3.742q0-1.516 0.391-2.922t1.109-2.625 1.727-2.227 2.227-1.727 2.625-1.109 2.922-0.391zM21 20q1.859 0 3.5-0.711t2.859-1.93 1.93-2.859 0.711-3.5-0.711-3.5-1.93-2.859-2.859-1.93-3.5-0.711-3.5 0.711-2.859 1.93-1.93 2.859-0.711 3.5 0.711 3.5 1.93 2.859 2.859 1.93 3.5 0.711z"></path>
				</symbol>
				<symbol id="ui-icon-ChevronDown" viewBox="0 0 32 32">
					<path d="M16 21.85l14.568-14.564 1.432 1.432-16 15.996-16-15.996 1.432-1.432 14.568 14.564z"></path>
				</symbol>
				<symbol id="ui-icon-ChevronDownSmall" viewBox="0 0 32 32">
					<path d="M28.191 6.107l3.809 3.791-16 15.995-16-15.995 3.809-3.791 12.191 12.189 12.191-12.189z"></path>
				</symbol>
				<symbol id="ui-icon-GlobalNavButton" viewBox="0 0 96 96">
					<path d="M68,39.4H28V37h40V39.4z M68,59H28v-2.4h40V59z M68,49.2H28v-2.4h40V49.2z"></path>
				</symbol>
				<symbol id="ui-icon-More" viewBox="0 0 96 96">
					<path d="M30.9,45.1c0.4,0,0.8,0.1,1.1,0.2c0.3,0.1,0.6,0.4,0.9,0.6s0.5,0.6,0.6,0.9s0.2,0.7,0.2,1.1s-0.1,0.8-0.2,1.1 c-0.1,0.3-0.4,0.6-0.6,0.9s-0.6,0.5-0.9,0.6c-0.3,0.1-0.7,0.2-1.1,0.2s-0.8-0.1-1.1-0.2c-0.3-0.1-0.6-0.4-0.9-0.6s-0.5-0.6-0.6-0.9 S28,48.4,28,48s0.1-0.8,0.2-1.1c0.1-0.3,0.4-0.6,0.6-0.9c0.3-0.3,0.6-0.5,0.9-0.6S30.5,45.1,30.9,45.1z M48,45.1 c0.4,0,0.8,0.1,1.1,0.2c0.3,0.1,0.6,0.4,0.9,0.6s0.5,0.6,0.6,0.9s0.2,0.7,0.2,1.1s-0.1,0.8-0.2,1.1c-0.1,0.3-0.4,0.6-0.6,0.9 s-0.6,0.5-0.9,0.6c-0.3,0.1-0.7,0.2-1.1,0.2s-0.8-0.1-1.1-0.2c-0.3-0.1-0.6-0.4-0.9-0.6c-0.3-0.3-0.5-0.6-0.6-0.9s-0.2-0.7-0.2-1.1 s0.1-0.8,0.2-1.1c0.1-0.3,0.4-0.6,0.6-0.9c0.3-0.3,0.6-0.5,0.9-0.6S47.6,45.1,48,45.1z M65.1,45.1c0.4,0,0.8,0.1,1.1,0.2 c0.3,0.1,0.6,0.4,0.9,0.6c0.3,0.3,0.5,0.6,0.6,0.9c0.1,0.3,0.2,0.7,0.2,1.1s-0.1,0.8-0.2,1.1c-0.1,0.3-0.4,0.6-0.6,0.9 c-0.3,0.3-0.6,0.5-0.9,0.6c-0.3,0.1-0.7,0.2-1.1,0.2c-0.4,0-0.8-0.1-1.1-0.2c-0.3-0.1-0.6-0.4-0.9-0.6c-0.3-0.3-0.5-0.6-0.6-0.9 c-0.1-0.3-0.2-0.7-0.2-1.1s0.1-0.8,0.2-1.1c0.1-0.3,0.4-0.6,0.6-0.9s0.6-0.5,0.9-0.6C64.4,45.2,64.7,45.1,65.1,45.1z"></path>
				</symbol>
				<symbol id="ui-icon-Vk" viewBox="0 0 96 96">
					<path d="M67.079,37.611c0.281-0.947,0-1.611-1.313-1.611h-4.377c-1.125,0-1.626,0.6-1.907,1.263c0,0-2.22,5.495-5.377,9.032c-1.032,1.042-1.469,1.358-2.032,1.358c-0.281,0-0.688-0.316-0.688-1.263v-8.779c0-1.137-0.313-1.611-1.251-1.611h-6.878c-0.688,0-1.125,0.537-1.125,1.011c0,1.074,1.563,1.326,1.751,4.295v6.505c0,1.421-0.25,1.674-0.813,1.674c-1.469,0-5.096-5.495-7.222-11.811C35.409,36.505,35.003,36,33.877,36h-4.377C28.25,36,28,36.6,28,37.263c0,1.168,1.469,6.979,6.909,14.653C38.536,57.158,43.632,60,48.259,60c2.782,0,3.126-0.632,3.126-1.705v-3.979c0-1.263,0.25-1.516,1.157-1.516c0.657,0,1.751,0.316,4.346,2.842c2.97,3,3.47,4.358,5.127,4.358h4.377c1.251,0,1.876-0.632,1.501-1.863c-0.406-1.232-1.813-3.032-3.689-5.179c-1.032-1.232-2.564-2.526-3.001-3.189c-0.657-0.853-0.469-1.232,0-1.958C61.202,47.779,66.548,40.2,67.079,37.611z"></path>
				</symbol>
				<symbol id="ui-icon-Cancel" viewBox="0 0 32 32">
					<path d="M28.203 5.203l-10.781 10.797 10.781 10.797-1.406 1.406-10.797-10.781-10.797 10.781-1.406-1.406 10.781-10.797-10.781-10.797 1.406-1.406 10.797 10.781 10.797-10.781 1.406 1.406z"></path>
				</symbol>
				<symbol id="ui-icon-Back" viewBox="0 0 96 96">
					<path d="M69,46.742v2.516H33.78l15.416,15.472L47.433,66.5L29,48l18.433-18.5l1.763,1.769L33.78,46.742H69z"></path>
				</symbol>
				<symbol id="ui-icon-ChevronRightSmall" viewBox="0 0 96 96">
					<path d="M41.8,32L58,48L41.8,64L38,60.2L50.3,48L38,35.8C38,35.8,41.8,32,41.8,32z"></path>
				</symbol>
				<symbol id="ui-icon-ChevronLeftSmall" viewBox="0 0 96 96">
					<path d="M58,35.8L45.7,48L58,60.2L54.2,64L38,48l16.2-16C54.2,32,58,35.8,58,35.8z"></path>
				</symbol>
			</defs>
		</svg>
		<div class="page" id="page" role="document">
			<div class="panel-nav-top"></div>
			<div class="container" id="container" role="main">
				<div class="content-wrapper">
					<div class="grid-narrow grid-pad">
						<div class="col col-1-1">
							<div class="content">
								<h1>Поиск</h1>
							</div>
						</div>
					</div>
					<div class="grid-narrow grid-pad">
						<div class="col col-1-1">
							<div class="content">
								<h2>Ваш запрос</h2>
								<div>
									<form method="post" action="/search/" id="search_form" class="search_form" enctype="application/x-www-form-urlencoded">
										<p>
											<label for="text">Введите одно ключевое слово:</label>
											<input type="text" name="q" id="text" autocomplete="off" placeholder="Найти" aria-label="Keywords / Ключевые слова" />
										</p>
										<p class="textcenter">
											<input class="btn btn-default" id="search_form_reset_button" value="Очистить" type="reset" aria-label="Reset / Очистить" /><input class="btn btn-primary" id="search_form_submit_button" value="Отправить" type="submit" aria-label="Submit / Отправить" />
										</p>
									</form>
								</div>
								<div class="hr"></div>
								<?php
									if (!empty($query)) {
										if (!empty($r)) {
											echo '<div class="module module-clean">
													<div class="module-header">
														<h2>Результат</h2>
													</div>
													<div id="search_results" class="module-content">' . $p . '</div>
												</div>' . "\n";
										} else {
											echo '<div class="module module-clean">
													<div class="module-header">
														<h2>Результат</h2>
													</div>
													<div id="search_results" class="module-content">
														<p>Ничего не&#160;найдено. Однако Ваши запросы фиксируются и&#160;учитываются редактором. Некоторые страницы удаляются по причине недостаточного качества или сомнительного с&#160;точки зрения авторских прав контента. Стоит так&#160;же уточнить, что ресурс некоммерческий и&#160;неразвлекательный</p>
													</div>
												</div>' . "\n";
										}
									} else {
										echo '<div class="module module-clean">
												<div class="module-header">
													<h2>Результат</h2>
												</div>
												<div id="search_results" class="module-content">
													<p>Введите ключевое слово в поле поиска&#160;/ Type your keyword in the search box</p>
												</div>
											</div>' . "\n";
									}
								?>
							</div>
						</div>
					</div>
					<div class="grid-narrow grid-pad">
						<div class="col col-1-1">
							<div class="footer">
				<p class="mui--text-caption">
					<a href="/terms.html">Соглашение</a>
					&#160;&#160; <a href="/policy.html">Политика</a>
					&#160;&#160; <a href="mailto:" onclick="var a='mailto',b=':',c='englishextra2',k='%40',q='yahoo',s='.',v='com';this.href=a+b+c+k+q+s+v;">&#169;&#160;2020&#160;englishextra</a>
				</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ul id="panel-nav-menu" class="panel-nav-menu">
				<li><a href="../pages/contents.html">Содержание</a></li>
				<li><a href="../pages/articles/articles_reading_rules_utf.html">Правила чтения</a></li>
				<li><a href="../pages/grammar/grammar_usage_of_articles_a_the.html">Артикли a&#160;/ an и&#160;the</a></li>
				<li><a href="../pages/grammar/grammar_usage_of_tenses.html">Употребление времен</a></li>
				<li><a href="../pages/grammar/grammar_phrasal_verbs.html">Фразовые глаголы</a></li>
				<li><a href="../pages/aids/aids_topics.html">Топики на&#160;английском</a></li>
				<li><a href="../pages/tests/tests_grammar_tests_with_answers.html">Тесты по&#160;грамматике</a></li>
				<li><a href="../pages/tests/tests_gia_ege_letter_sample.html">ГИА&#160;/ ЕГЭ: Задания&#160;33, 39, 40</a></li>
				<li><a href="../pages/tests/tests_ege_essay_sample.html">ЕГЭ: Задание&#160;40</a></li>
				<li><a href="../sitemap.html">Карта сайта</a></li>
			</ul>
			<a href="../pages/contents.html" rel="contents" class="btn-nav-menu" onclick="return false;" title="Содержание">
				<svg class="ui-icon" role="img" focusable="false">
					<use xlink:href="#ui-icon-GlobalNavButton"></use>
				</svg>
			</a>
		</div>
		<script src="../libs/search/js/bundle.min.js" async=""></script>
	</body>
</html>
