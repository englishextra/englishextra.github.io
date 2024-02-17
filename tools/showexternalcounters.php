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
				'inc/adminauth.inc',
				'inc/vars2.inc',
				'inc/pdo_mysql.inc'
			);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
class ShowExternalCounters extends Swamper {
	function __construct() {
		parent::__construct();
	}
	/* stackoverflow.com/questions/3825226/multi-byte-safe-wordwrap-function-for-utf-8 */
	public function mb_wordwrap($str, $width = 60, $break = "\n", $cut = false, $charset = null) {
		if ($charset === null) {
			$charset = mb_internal_encoding();
		}
		$pieces = explode($break, $str);
		$result = array();
		foreach ($pieces as $piece) {
			$current = $piece;
			while ($cut && mb_strlen($current) > $width) {
				$result[] = mb_substr($current, 0, $width, $charset);
				$current = mb_substr($current, $width, 2048, $charset);
			}
			$result[] = $current;
		}
		return implode($break, $result);
	}
	/* this function seems to stuck the server,
	so we use the alternative function above */
	public function utf8_htmlwrap($str, $width = 60, $break = "\n", $nobreak = "") {
		/* Split HTML content into an array delimited by < and > */
		/* The flags save the delimeters and remove empty variables */
		$content = preg_split("/([<>])/", $str, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
		/* Transform protected element lists into arrays */
		$nobreak = explode(" ", strtolower($nobreak));
		/* Variable setup */
		$intag = false;
		$innbk = array();
		$drain = "";
		/* List of characters it is "safe" to insert line-breaks at */
		/* It is not necessary to add < and > as they are automatically implied */
		$lbrks = "/?!%)-}]\\\"':;&";
		/* Is $str a UTF8 string? */
		$utf8 = (preg_match("/^([\x09\x0A\x0D\x20-\x7E]|[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|\xF0[\x90-\xBF][\x80-\xBF]{2}|[\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2})*$/", $str)) ? "u" : "";
		while (list(, $value) = each($content)) {
			switch ($value) {
				/* If a < is encountered, set the "in-tag" flag */
				case "<" :
					$intag = true;
					break;
				/* If a > is encountered, remove the flag */
				case ">" :
					$intag = false;
					break;
				default :
					/* If we are currently within a tag... */
					if ($intag) {
						/* Create a lowercase copy of this tag's contents */
						$lvalue = strtolower($value);
						/* If the first character is not a / then this is an opening tag */
						if ($lvalue{0} != "/") {
							/* Collect the tag name */
							preg_match("/^(\w*?)(\s|$)/", $lvalue, $t);
							/* If this is a protected element, activate the associated protection flag */
							if (in_array($t[1], $nobreak))
								array_unshift($innbk, $t[1]);
							/* Otherwise this is a closing tag */
						} else {
							/* If this is a closing tag for a protected element, unset the flag */
							if (in_array(substr($lvalue, 1), $nobreak)) {
								reset($innbk);
								while (list($key, $tag) = each($innbk)) {
									if (substr($lvalue, 1) == $tag) {
										unset($innbk[$key]);
										break;
									}
								}
								$innbk = array_values($innbk);
							}
						}
						/* Else if we're outside any tags... */
					} else if ($value) {
						/* If unprotected... */
						if (!count($innbk)) {
							/* Use the ACK (006) ASCII symbol to replace all HTML entities temporarily */
							$value = str_replace("\x06", "", $value);
							preg_match_all("/&([a-z\d]{2,7}|#\d{2,5});/i", $value, $ents);
							$value = preg_replace("/&([a-z\d]{2,7}|#\d{2,5});/i", "\x06", $value);
							/* Enter the line-break loop */
							do {
								$store = $value;
								/* Find the first stretch of characters over the $width limit */
								if (preg_match("/^(.*?\s)?([^\s]{" . $width . "})(?!(" . preg_quote($break, "/") . "|\s))(.*)$/s{$utf8}", $value, $match)) {
									if (strlen($match[2])) {
										/* Determine the last "safe line-break" character within this match */
										for ($x = 0, $ledge = 0; $x < strlen($lbrks); $x++)
											$ledge = max($ledge, strrpos($match[2], $lbrks{$x}));
										if (!$ledge)
											$ledge = strlen($match[2]) - 1;
										/* Insert the modified string */
										$value = $match[1] . substr($match[2], 0, $ledge + 1) . $break . substr($match[2], $ledge + 1) . $match[4];
									}
								}
								/* Loop while overlimit strings are still being found */
							} while ($store != $value);
							/* Put captured HTML entities back into the string */
							foreach ($ents[0] as $ent)
								$value = preg_replace("/\x06/", $ent, $value, 1);
						}
					}
			}
			/* Send the modified segment down the drain */
			$drain .= $value;
		}
		/* Return contents of the drain */
		return $drain;
	}
	public function return_domain_name($url) {
		$d = preg_replace("/(http|https|ftp)\:\/\//", '', $url);
		$t = stristr($d, '/');
		$d = str_replace($t, '', $d);
		return $d;
	}
	public function prepare_str($s, $domain, $domain_highlighted, $slen_domain) {
		$s = urldecode($s);
		$s = stripslashes($s);
		$s = $this -> safe_str($s);
		$s = $this -> text_symbs_to_dec_ents($s);
		$s = $this -> acc_text_to_dec_ents($s);
		$s = $this -> remove_comments($s);
		$s = $this -> remove_tags($s);
		$s = $this -> ensure_lt_gt($s);
		$s = $this -> ord_space($s);
		$s = str_replace(array('https://', 'http://', 'file:///', 'ftp://', '+'), array('', '', '', '', ' '), $s);
		/* replace only once */
		$s = preg_replace("/${domain}/i", "${domain_highlighted}", $s, 1);
		/* this makes the server stuck */
		/* if ($this -> is_utf8($s)) { */
			/* $s = $this -> utf8_htmlwrap($s, $width = $slen_domain, $break = ' ', $nobreak = ''); */
			/* break should be carriage return not empty space: you make break span tags*/
			$s = $this -> mb_wordwrap($s, $width = $slen_domain, $break = "\n", $cut = true, "UTF-8");
		/*}*/
		$s = $this -> ensure_amp($s);
		return $s;
	}
	public function db_table_exists($db_handler, $table) {
		return $r = $db_handler -> query("SELECT count(*) from `" . $table . "`") ? true : false;
	}
}
if (!isset($ShowExternalCounters) || empty($ShowExternalCounters)) {
	$ShowExternalCounters = new ShowExternalCounters();
}
$event = $ShowExternalCounters -> get_post('event');
$table_name = $pt_externalcounters_table_name;
if ($event == 'clear') {
	try {
		/**
		 * if table exists
		 */
		if ($ShowExternalCounters -> db_table_exists($DBH, $table_name)) {
			$DBH -> query("TRUNCATE TABLE `" . $table_name . "`;");
			header("HTTP/1.0 404 Not Found");
			header('location: ' . str_replace('&amp;', '&', $_SERVER['PHP_SELF']));
		}
		$DBH = null;
	} catch (PDOException $e) {
		echo $e -> getMessage();
	}
	exit ;
}
?><!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="robots" content="noindex,nofollow" />
		<title>Журнал посещений</title>
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
			<link rel="stylesheet" href="../libs/admin/css/bundle.min.css" />
			<style>
				.container {
					visibility: visible;
					opacity: 1;
				}
			</style>
		</noscript>
	</head>
	<body>
		<div class="page" id="page" role="document">
			<div class="panel-nav-top"></div>
			<div class="container" id="container" role="main">
				<div class="content-wrapper">
					<div class="grid grid-pad">
						<div class="col col-1-1">
							<div class="content">
								<h1>Журнал посещений</h1>
							</div>
						</div>
					</div>
					<div class="grid grid-pad">
						<div class="col col-1-1">
							<div class="content">
								<h2>История посещений</h2>
								<table class="respond table"><caption></caption><thead><tr><th>Adddate</th>
											<th>Referer&#160;/ Self</th>
											<th>Page title</th>
											<th>Browser&#160;/ Os</th>
											<th>Host&#160;/ Ip</th></tr></thead><tbody><?php
try {
	/**
	 * if table exists
	 */
	if ($ShowExternalCounters->db_table_exists($DBH, $table_name)) {
		$SQL = "SELECT `id`, `adddate`, `random`, `user_login`, `referer`, `self`, `page_title`, `browser`, `number`, `os`, `os_number`, `host`, `ip` FROM (SELECT `id`, `adddate`, `random`, `user_login`, `referer`, `self`, `page_title`, `browser`, `number`, `os`, `os_number`, `host`, `ip` ";
		$SQL .= "FROM `" . $table_name . "` ";
		$SQL .= "WHERE `random`!='' AND `adddate` >= :vars2_start_time AND `adddate` <= :vars2_end_time ORDER BY `adddate` DESC LIMIT 500) as tbl order by tbl.`adddate`;";
		$STH = $DBH->prepare($SQL);
		$STH->bindValue(":vars2_start_time", (int)$vars2_start_time, PDO::PARAM_INT);
		$STH->bindValue(":vars2_end_time", (int)$vars2_end_time, PDO::PARAM_INT);
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
				$fr4_domain = $ShowExternalCounters->return_domain_name($fr[4]);
				$fr4_highlighted = ($fr4_domain && ($fr4_domain != $vars2_site_root_printable)) ? '<span class="IndianRed">' . strtoupper($fr4_domain) . '</span>' : strtoupper($fr4_domain);
				$fr4_text = $fr[4];
				$fr4_text = $ShowExternalCounters->prepare_str($fr4_text, $fr4_domain, $fr4_highlighted, 30);
				$fr5_domain = $ShowExternalCounters->return_domain_name($fr[5]);
				$fr5_highlighted = ($fr5_domain && ($fr5_domain != $vars2_site_root_printable)) ? '<span class="FireBrick">' . strtoupper($fr5_domain) . '</span>' : strtoupper($fr5_domain);
				$fr5_text = $fr[5];
				$fr5_text = $ShowExternalCounters->prepare_str($fr5_text, $fr5_domain, $fr5_highlighted, 30);
				/*
				these functions freeze PDO and mysqli on windows but not on linux
				if (!empty($fr4_text) && !is_utf8(urldecode($fr4_text))) {
				$fr4_text = '<strong>Non-UTF8 referrer:</strong> ' . $ShowExternalCounters->cp1251_to_utf8(urldecode($fr4_text));
				}
				if (!empty($fr6) && !is_utf8(urldecode($fr6))) {
				$fr6 = '<strong>Non-UTF8 title:</strong> ' . $ShowExternalCounters->cp1251_to_utf8(urldecode($fr6));
				}
				*/
				/*
				if (preg_match("/go\.mail\.ru\/search/ei", urldecode($fr[4]))) {
				}
				*/
				$fr11_text = $fr[11];
				if (preg_match("/[A-Za-z]/", $fr11_text)) {
					if (strpos($fr11_text, ".") !== false && substr_count($fr11_text, ".") > 0) {
						$re = preg_match("/[^\.\/]+\.[^\.\/]+$/", $fr11_text, $matches);
						$fr11_link = htmlentities('http://' . $matches[0] . '/');
						$fr11_text = '<a href="' . $fr11_link . '" target="_blank">' . wordwrap($fr11_text, 20, ' ', 1) . '</a>';
					}
				}
				echo '
<tr>
<td data-label="Adddate">' . date("H:i:s", $fr[1]) . '<br />' . $fr[1] . '
<td data-label="Referer / Self"><span class="SlateGray"><strong>from:</strong>&#160;&#160;' . $fr4_text . '</span>&#160;&#160;<a href="' . $ShowExternalCounters->ensure_amp($fr[4]) . '" target="_blank">[&#8594;]</a><br /><span class="DarkSlateGray"><strong>to:</strong>&#160;&#160;' . $fr5_text . '</span>&#160;&#160;<a href="' . $ShowExternalCounters->ensure_amp($fr[5]) . '" target="_blank">[&#8594;]</a></td>
<td data-label="Page title"><span class="DarkSlateGray">' . $ShowExternalCounters->ensure_amp($ShowExternalCounters->remove_tags(urldecode($fr[6]))) . '</span></td>
<td data-label="Browser / Os"><span class="FireBrick">' . $fr[7] . ' ' . $fr[8] . '</span><br /><span class="SeaGreen">' . $fr[9] . '</span><br /><span class="DarkSlateGray">' . $fr[10] . '</span></td>
<td data-label="Host / Ip"><span class="DarkSlateGray">' . $fr11_text . '<br /><a href="http://' . htmlentities($fr[12]) . '/" target="_blank">' . htmlentities(wordwrap($fr[12], 20, ' ', 1)) . '</a><br /><a href="http://ip-lookup.net/?ip=' . urlencode($fr[12]) . '" target="_blank">IP-LOOKUP</a>&#160;<a href="http://www.ripe.net/fcgi-bin/whois?form_type=simple&amp;full_query_string=&amp;searchtext=' . urlencode($fr[12]) . '&amp;submit.x=13&amp;submit.y=14&amp;submit=Search" target="_blank">RIPE</a>&#160;';
				if ($ShowExternalCounters->is_ip($fr[12])) {
					echo '<a href="http://www.ipchecking.com/?ip=' . urlencode($fr[12]) . '&amp;check=Lookup" target="_blank">ipchecking</a>';
				} else {
					echo $fr[12];
				}
				echo '&#160;<a href="http://www.robtex.com/ip/' . urlencode($fr[12]) . '.html" target="_blank">robtex</a></span></td>
</tr>' . "\n";
			}
		}
	}
	$DBH = null;
} catch (PDOException $e) {
	echo $e->getMessage();
}
ob_end_flush();
?></tbody></table>
								<div>
									<form action="#" id="actions_form" method="post">
										<p class="textcenter">
											<input type="hidden" name="event" value="clear" /><input class="btn uk-button" type="button" onclick="javascipt:document.location.reload();" value="Обновить" /><input class="btn uk-button" type="submit" value="Очистить" />
										</p>
									</form>
								</div>
							</div>
						</div>
					</div>
					<div class="grid grid-pad">
						<div class="col col-1-1">
							<div class="footer">
								<p class="copyright"><a href="https://creativecommons.org/licenses/by-nd/4.0/" target="_blank">Content licensed under&#160;CC&#160;BY-ND&#160;4.0.</a>&#160;
						<a href="javascript:void(0);" onclick="var a='mailto',b=':',c='englishextra2',k='&#64;',q='yahoo',s='.',v='com';this.href=a+b+c+k+q+s+v;">&#169;&#160;2006&#8212;2017&#160;englishextra.</a>&#160;
						<a href="../pages/webdev/webdev_about.html">О сайте</a></p>
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
			<a href="../pages/contents.html" class="btn-nav-menu" id="btn-nav-menu" onclick="return false;" title="Содержание"></a>
		</div>
		<script src="../libs/admin/js/bundle.min.js" type="application/javascript" async=""></script>
	</body>
</html>
