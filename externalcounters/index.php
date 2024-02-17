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
	'lib/Browser.php/lib/Browser.fixed.php',
	'inc/regional.inc',
	'inc/vars2.inc',
	'inc/pdo_mysql.inc'
);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
class ExternalCounters extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function prepare_str($s) {
		$s = stripslashes($s);
		$s = $this->safe_str($s);
		return $s;
	}
	public function get_query_param($s) {
		return isset($_GET[$s]) ? $_GET[$s] : '';
	}
	public function fix_ttl_encoding($encoding, $ttl, $rfrr) {
		//some fixes based on referer
		if (preg_match("/go\.mail\.ru\/search\?q\=/", $rfrr)) {
			$encoding = "utf-8";
		} elseif (preg_match("/www\.nigma\.ru\/index\.php\?s\=/", $rfrr)) {
			$encoding = "utf-8";
		} elseif (preg_match("/yandex\.ru\/yandsearch\?text\=/", $rfrr)) {
			$encoding = "utf-8";
		} elseif (preg_match("/nova\.rambler\.ru\/search\?/", $rfrr)) {
			$encoding = "utf-8";
		}
		if (!empty($encoding)) {
			switch ($encoding) {
				case "koi8-r":
					$ttl = iconv("koi8-r", "utf-8", $ttl);
					break;
				case "iso-8859-1":
					$ttl = iconv("iso8859-1", "utf-8", $ttl);
					break;
				case "iso-8859-5":
					$ttl = iconv("iso8859-5", "utf-8", $ttl);
					break;
				case "windows-1251":
					$ttl = iconv("cp1251", "utf-8", $ttl);
					break;
			}
		} else {
			//http://bugs.php.net/bug.php?id=38138
			if (!mb_detect_encoding($ttl, "UTF-8")) {
				if (mb_detect_encoding($ttl, "KOI8-R")) {
					$ttl = iconv("koi8-r", "utf-8", $ttl);
				} elseif (mb_detect_encoding($ttl, "ISO-8859-1")) {
					$ttl = iconv("iso8859-1", "utf-8", $ttl);
				} elseif (mb_detect_encoding($ttl, "ISO-8859-5")) {
					$ttl = iconv("iso8859-5", "utf-8", $ttl);
				} elseif (mb_detect_encoding($ttl, "Windows-1251")) {
					$ttl = iconv("cp1251", "utf-8", $ttl);
				}
			}
		}
		return $ttl;
	}
	public function db_table_exists($db_handler, $table) {
		return $r = $db_handler->query("SELECT count(*) from `" . $table . "`") ? true : false;
	}
}
if (!isset($ExternalCounters) || empty($ExternalCounters)) {
	$ExternalCounters = new ExternalCounters();
}
$expires_offset = 3600;
$contenttype = 'image/gif';
header("Cache-Control: public, max-age=" . $expires_offset);
header("Expires: " . gmdate("D, d M Y H:i:s", time() + $expires_offset) . " GMT");
header("Content-Type: " . $contenttype);
$image = imagecreatefromgif('blank.gif');
$random_anchor = $ExternalCounters->random_anchor();
/* don't use urldecode for $_GET */
$dmn = htmlentities($ExternalCounters->prepare_str($ExternalCounters->get_query_param('dmn')));
$rfrr = $ExternalCounters->get_query_param('rfrr');
if (!$rfrr) {
	$rfrr = $vars2_http_referer;
}
$rfrr = htmlentities($ExternalCounters->prepare_str(str_replace(" ", "+", $rfrr)));
/* don't use htmlentities for $ttl */
$ttl = $ExternalCounters->get_query_param('ttl');
if (!$ttl) {
	$ttl = 'No title';
}
$ttl = $ExternalCounters->prepare_str(str_replace(" ", "+", $ttl));
$encoding = $ExternalCounters->get_query_param('encoding');
$ttl = $ExternalCounters->fix_ttl_encoding($encoding, $ttl, $rfrr);
$is_robot = '';
$ua = '';
$ua_str = '';
$ua_version = '';
$os = '';
if (!isset($browser) || empty($browser)) {
	$browser = new Browser();
	$is_robot = ($browser->isRobot()) ? $browser->getBrowser() : '';
	$ua = ($browser->getBrowser()) ? $browser->getBrowser() : '';
	$ua_str = ($browser->getUserAgent()) ? $browser->getUserAgent() : 'unknown';
	$ua_version = ($browser->getVersion()) ? $browser->getVersion() : '';
	$os = ($browser->getPlatform()) ? $browser->getPlatform() : '';
}
$table_name = $pt_externalcounters_table_name;
$DBH->exec("CREATE TABLE IF NOT EXISTS `" . $table_name . "` ( `id` mediumint(9) NOT NULL AUTO_INCREMENT, `adddate` int(11) DEFAULT NULL, `random` varchar(50) DEFAULT NULL, `user_login` mediumtext NOT NULL, `referer` mediumtext NOT NULL, `self` mediumtext NOT NULL, `page_title` mediumtext NOT NULL, `browser` mediumtext NOT NULL, `number` mediumtext NOT NULL, `os` mediumtext NOT NULL, `os_number` mediumtext NOT NULL, `host` mediumtext NOT NULL, `ip` mediumtext NOT NULL, PRIMARY KEY (`id`), FULLTEXT KEY `page_title` (`page_title`)) ENGINE=MyISAM DEFAULT CHARSET=utf8;");
if (!$is_robot) {
	try {
		/**
		 * if table exists
		 */
		if ($ExternalCounters->db_table_exists($DBH, $table_name)) {
			$SQL = "INSERT INTO `" . $table_name . "` ";
			$SQL .= "(`adddate`, `random`, `user_login`, `referer`, `self`, `page_title`, `browser`, `number`, `os`, `os_number`, `host`, `ip`) ";
			//$SQL .= "VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";
			$SQL .= "VALUES (:adddate, :random, :user_login, :referer, :self, :page_title, :browser, :number, :os, :os_number, :host, :ip);";
			$STH = $DBH->prepare($SQL);
			$a = null;
			$a[] = array(":adddate", (int) $vars2_marker, PDO::PARAM_INT);
			$a[] = array(":random", (int) $random_anchor, PDO::PARAM_INT);
			$a[] = array(":user_login", "", PDO::PARAM_STR);
			$a[] = array(":referer", $rfrr, PDO::PARAM_STR);
			$a[] = array(":self", $dmn, PDO::PARAM_STR);
			$a[] = array(":page_title", $ExternalCounters->safe_html($ttl), PDO::PARAM_STR);
			$a[] = array(":browser", $ExternalCounters->safe_html($ua), PDO::PARAM_STR);
			$a[] = array(":number", $ExternalCounters->safe_html($ua_version), PDO::PARAM_STR);
			$a[] = array(":os", $ExternalCounters->safe_html($os), PDO::PARAM_STR);
			$a[] = array(":os_number", $ExternalCounters->safe_html($ua_str), PDO::PARAM_STR);
			$a[] = array(":host", $ExternalCounters->ensure_amp($vars2_http_x_forwarded_for), PDO::PARAM_STR);
			$a[] = array(":ip", $ExternalCounters->ensure_amp($vars2_remote_address), PDO::PARAM_STR);
			for ($i = 0; $i < count($a); $i++) {
				if (!empty($a[$i][0])) {
					$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
				}
			}
			/**
			 * 			$STH->bindValue(":adddate", (int) $vars2_marker, PDO::PARAM_INT);
			 * 			$STH->bindValue(":random", (int) $random_anchor, PDO::PARAM_INT);
			 * 			$STH->bindValue(":user_login", "", PDO::PARAM_STR);
			 * 			$STH->bindValue(":referer", htmlentities($rfrr), PDO::PARAM_STR);
			 * 			$STH->bindValue(":self", htmlentities($dmn), PDO::PARAM_STR);
			 * 			$STH->bindValue(":page_title", $ttl, PDO::PARAM_STR);
			 * 			$STH->bindValue(":browser", $ua, PDO::PARAM_STR);
			 * 			$STH->bindValue(":number", $ua_version, PDO::PARAM_STR);
			 * 			$STH->bindValue(":os", $os, PDO::PARAM_STR);
			 * 			$STH->bindValue(":os_number", $ua_str, PDO::PARAM_STR);
			 * 			$STH->bindValue(":host", $vars2_http_x_forwarded_for, PDO::PARAM_STR);
			 * 			$STH->bindValue(":ip", $vars2_remote_address, PDO::PARAM_STR);
			 */
			$STH->execute();
			/**
			 * 			$STH->execute(array($vars2_marker,
			 * 								$random_anchor,
			 * 								'',
			 * 								htmlentities($rfrr),
			 * 								htmlentities($dmn),
			 * 								$ttl,
			 * 								$ua,
			 * 								$ua_version,
			 * 								$os,
			 * 								$ua_str,
			 * 								$vars2_http_x_forwarded_for,
			 * 								$vars2_remote_address
			 * 								));
			 */
		}
		$DBH = null;
	} catch (PDOException $e) {
		//echo $e->getMessage();
	}
}
imagegif($image);
ob_end_flush();
