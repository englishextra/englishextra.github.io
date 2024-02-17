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
class PrintComments extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function to_rudate($t) {
		if (ctype_digit($t) && strlen($t) == 10) {
			$r_a_w = array('0' => 'воскресенье', '1' => 'понедельник', '2' => 'вторник', '3' => 'среда', '4' => 'четверг', '5' => 'пятница', '6' => 'суббота');
			$r_a_m = array('01' => 'января', '02' => 'февраля', '03' => 'марта', '04' => 'апреля', '05' => 'мая', '06' => 'июня', '07' => 'июля', '08' => 'августа', '09' => 'сентября', '10' => 'октября', '11' => 'ноября', '12' => 'декабря');
			$r_w = date("w", $t);
			$r_m = date("m", $t);
			$r_t = date("H:i", $t);
			$r_y = date("Y", $t);
			$r_d = date("d", $t);
			$r_w = $r_a_w["$r_w"];
			$r_a_m = $r_a_m["$r_m"];
			$r_date = $r_w . ', ' . $r_d . ' ' . $r_a_m . ' ' . $r_y . ' года';
			return $r_date;
		}
	}
	private function _make_url_clickable_cb($matches) {
		$ret = '';
		$url = $matches[2];
		if ( empty($url) )
			return $matches[0];
		// removed trailing [.,;:] from URL
		if ( in_array(substr($url, -1), array('.', ',', ';', ':')) === true ) {
			$ret = substr($url, -1);
			$url = substr($url, 0, strlen($url)-1);
		}
		/* $shimansky */
		$url_printable = preg_replace("/[\/]+$/",'',str_replace(array('http://','https://','ftp://'),'',$url));
		return $matches[1] . " <a href=\"$url\" class=\"ui-link\" data-ajax=\"false\" rel=\"nofollow\">$url_printable</a> " . $ret;
	}
	private function _make_web_ftp_clickable_cb($matches) {
		$ret = '';
		$dest = $matches[2];
		$dest = 'http://' . $dest;
		if ( empty($dest) )
			return $matches[0];
		// removed trailing [,;:] from URL
		if ( in_array(substr($dest, -1), array('.', ',', ';', ':')) === true ) {
			$ret = substr($dest, -1);
			$dest = substr($dest, 0, strlen($dest)-1);
		}
		/* $shimansky */
		$dest_printable = preg_replace("/[\/]+$/",'',str_replace(array('http://','https://','ftp://'),'',$dest));
		return $matches[1] . " <a href=\"$dest\" rel=\"nofollow\">$dest_printable</a> " . $ret;
	}
	private function _make_email_clickable_cb($matches) {
		$email = $matches[2] . '@' . $matches[3];
		return $matches[1] . " <a href=\"mailto:$email\">$email</a> ";
	}
	/* http://bytes.com/topic/php/answers/546688-preg_replace_callback-class-method */
	public function make_clickable_links($ret) {
		$ret = ' ' . $ret;
		// in testing, using arrays here was found to be faster
		$ret = preg_replace_callback('#([\s>])([\w]+?://[\w\\x80-\\xff\#$%&~/.\-;:=,?@\[\]+]*)#is', array(get_class($this), '_make_url_clickable_cb'), $ret);
		$ret = preg_replace_callback('#([\s>])((www|ftp)\.[\w\\x80-\\xff\#$%&~/.\-;:=,?@\[\]+]*)#is', array(get_class($this), '_make_web_ftp_clickable_cb'), $ret);
		$ret = preg_replace_callback('#([\s>])([.0-9a-z_+-]+)@(([0-9a-z-]+\.)+[0-9a-z]{2,})#i', array(get_class($this), '_make_email_clickable_cb'), $ret);
		// this one is not in an array because we need it to run last, for cleanup of accidental links within links
		$ret = preg_replace("#(<a( [^>]+?>|>))<a [^>]+?>([^>]+?)</a></a>#i", "$1$3</a>", $ret);
		$ret = trim($ret);
		return $ret;
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
/* "-", */
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
/* "&#8211;", */
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
			$STH->bindValue(":content", $this->conv_symbs_to_ents($p));
			$STH->execute();
		}
	}
}
if (!isset($PrintComments) || empty($PrintComments)) {
	$PrintComments = new PrintComments ();
}
$table_name = $pt_comments_table_name;
$DBH->exec("CREATE TABLE IF NOT EXISTS `" . $table_name . "` ( `id` mediumint(9) NOT NULL AUTO_INCREMENT, `adddate` int(11) DEFAULT NULL, `user_login` varchar(40) DEFAULT NULL, `msg` mediumtext NOT NULL, `user_host` mediumtext NOT NULL, `user_ip` mediumtext NOT NULL, `self_title` mediumtext NOT NULL, `self_href` mediumtext NOT NULL, PRIMARY KEY (`id`), FULLTEXT KEY `msg` (`msg`), FULLTEXT KEY `self_title` (`self_title`), FULLTEXT KEY `self_href` (`self_href`)) ENGINE=MyISAM DEFAULT CHARSET=utf8;");
$cache_table_name = "cache_" . $table_name;
$SQLITE_CACHE->exec("CREATE TABLE IF NOT EXISTS `" . $cache_table_name . "` ( `adddate` INTEGER NOT NULL, `content` TEXT )");
$limit = $PrintComments->get_post('limit');
if (!$limit) {$limit = 100;}
$load = $PrintComments->get_post('load');
if (!empty($load)) {
	$page_title = 'Ваши комментарии';
	$r = '';
	$p = '';
	/* read from cache */
	if ($PrintComments->db_table_exists($SQLITE_CACHE, $cache_table_name)) {
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
			if ($fr[0]) {
				$r = 1;
				$p = "\n\n" . "<!-- from " . $cache_table_name . " -->" . "\n\n" . $fr[1];
			}
		}
	}
	/* read from DB */
	if (!$r) {
		try {
			/**
			 * if table exists
			 */
			if ($PrintComments->db_table_exists($DBH, $table_name)) {
				$SQL = "SELECT `id`, `adddate`, `user_login`, `msg`, `user_host`, `user_ip`, `self_title`, `self_href` ";
				$SQL .= "FROM `" . $table_name . "` ";
				$SQL .= "WHERE `msg`!='' AND `adddate`!='' ORDER BY `adddate` DESC LIMIT :limit;";
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
				$a[]=array(":limit", (int) $limit, PDO::PARAM_INT);
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
					$r = 1;
					/**
					 * replaces while ($fr = mysql_fetch_row($query)) {
					 */
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						//this is used when we don't use reading from cache but load each time dinamically from DB
						//$date_str = ($vars2_start_time < $fr[1] && $vars2_end_time > $fr[1]) ? '&#x441;&#x435;&#x433;&#x43e;&#x434;&#x43d;&#x44f;' : $PrintComments->to_rudate($fr[1]);
						$date_str = $PrintComments->to_rudate($fr[1]);
						$ref_str = ($fr[6] && $fr[7]) ? '<!-- <a href="' . $PrintComments->ensure_amp($fr[7]) . '" class="ui-link" data-ajax="false">&#171;' . $PrintComments->ensure_amp($fr[6]) . '&#187;</a> -->' : '';
						/* $user_str = ($PrintComments->is_ip($fr[5])) ? '<a href="#" onclick="window.open(\'http://www.ipchecking.com/?ip=' . $fr[5] . '&amp;check=Lookup\', \'_blank\');">' . $fr[5] . '</a>' : $PrintComments->ensure_lt_gt($PrintComments->ensure_amp($fr[5])); */
						$user_str = ($PrintComments->is_ip($fr[5])) ? '' . $fr[5] . '' : $PrintComments->ensure_lt_gt($PrintComments->ensure_amp($fr[5]));
						$fr[3] = $PrintComments->safe_str($fr[3]);
						$fr[3] = $PrintComments->ord_space($fr[3]);
						$fr[3] = $PrintComments->remove_bbcoded($fr[3]);
						$fr[3] = $PrintComments->make_clickable_links($PrintComments->ensure_lt_gt($PrintComments->ensure_amp($fr[3])));
						//$p .= '<dl id="' . $table_name . $fr[0] . '"><dt><small><em>' .$user_str . ' в ' . date("H:i:s", $fr[1]) . ', ' . $date_str . $ref_str . '</em></small></dt><dd>' . $fr[3] . '</dd></dl>' . "\n";
						//$p .= '<div id="' . $table_name . $fr[0] . '"><div><span class="smaller">' .$user_str . ' в ' . date("H:i:s", $fr[1]) . ', ' . $date_str . $ref_str . '</span></div><p class="hyphenate text larger" lang="ru">&#8212; ' . $fr[3] . '</p></div>' . "\n";
						/* $p .= '<div id="' . $table_name . $fr[0] . '"><div><span class="smaller">' .$user_str . ' в ' . date("H:i:s", $fr[1]) . ', ' . $date_str . '</span></div><p class="larger">&#8212; ' . $fr[3] . '</p></div>' . "\n"; */
						$p .= '<div id="' . $table_name . $fr[0] . '" class="module module-clean"><div class="module-header"><h4>' .$user_str . ' в ' . date("H:i:s", $fr[1]) . ', ' . $date_str . '</h4></div><div class="module-content"><p>&#8212; ' . $fr[3] . '</p></div></div>' . "\n";
					}
					$p = str_replace(array("\r", "\0", "\x0B"), '', $p);
					/**
					 * cache output
					 */
					$PrintComments->write_to_caching_db($SQLITE_CACHE, $cache_table_name, $vars2_marker, $p);
				}
			}
			$DBH = null;
		} catch(PDOException $e) {
			echo $e->getMessage();
		}
	}
	if ($load == 'posts') {
		if ($r) {
			$p0 = '<div id="latestcomments">' . "\n";
			$p0 .= '<div>' . $p . '</div>' . "\n";
			$p0 .= '</div>' . "\n";
			echo $p0;
		}
	}
}
$SQLITE_CACHE = null;
ob_end_flush();
