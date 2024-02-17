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
/* this script should be utf encoded */
class AddComment extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function prepare_str($s) {
		$s = stripslashes($s);
		/* $s = $this->safe_str($s); */
		$s = str_replace(array("\n","\r","\t","\v","\0","\x0B")," ",preg_replace("/[^\x20-\xFF]/"," ",trim(@strval($s))));
		$s = $this->ord_space($s);
		return $s;
	}
	public function get_query_str_params($s) {
		$v = '';
		if (isset ($_GET[$s]) || isset ($_POST[$s])) {
			$v = isset ($_GET[$s]) ? $_GET[$s] : (isset ($_POST[$s]) ? urldecode($_POST[$s]) : '');
			$v = $this->prepare_str( $v );
		}
		return $v;
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
"&#8222;",
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
	public function empty_caching_db($db_handler, $table) {
		if ($this->db_table_exists($db_handler, $table)) {
			$db_handler->exec("DELETE FROM " . $table . " WHERE 1;");
		}
	}
}
if (!isset($AddComment) || empty($AddComment)) {
	$AddComment = new AddComment ();
}
$comments_textarea = $AddComment->get_query_str_params('comments_textarea');
$self_title = $AddComment->get_query_str_params('self_title');
$self_href = $AddComment->get_query_str_params('self_href');
$table_name = $pt_comments_table_name;
$DBH->exec("CREATE TABLE IF NOT EXISTS `" . $table_name . "` ( `id` mediumint(9) NOT NULL AUTO_INCREMENT, `adddate` int(11) DEFAULT NULL, `user_login` varchar(40) DEFAULT NULL, `msg` mediumtext NOT NULL, `user_host` mediumtext NOT NULL, `user_ip` mediumtext NOT NULL, `self_title` mediumtext NOT NULL, `self_href` mediumtext NOT NULL, PRIMARY KEY (`id`), FULLTEXT KEY `msg` (`msg`), FULLTEXT KEY `self_title` (`self_title`), FULLTEXT KEY `self_href` (`self_href`)) ENGINE=MyISAM DEFAULT CHARSET=utf8;");
$cache_table_name = "cache_" . $table_name;
$SQLITE_CACHE->exec("CREATE TABLE IF NOT EXISTS `" . $cache_table_name . "` ( `adddate` INTEGER NOT NULL, `content` TEXT )");
if (!empty($comments_textarea)) {
	try {
		/**
		 * if table exists
		 */
		if ($AddComment->db_table_exists($DBH, $table_name)) {
			/**
			 * check if same message has already been posted
			 */
			$SQL = "SELECT `adddate`, `user_login`, `msg`, `user_host`, `user_ip`, `self_title`, `self_href` FROM `" . $table_name;
			$SQL .= "` WHERE `msg`=:comments_textarea AND `user_host`=:vars2_http_x_forwarded_for AND `user_ip`=:vars2_remote_address LIMIT 1;";
			$STH = $DBH->prepare($SQL);
			$a = null;
			$a[]=array(":comments_textarea", $AddComment->safe_html($comments_textarea), PDO::PARAM_STR);
			$a[]=array(":vars2_http_x_forwarded_for", $AddComment->ensure_amp($vars2_http_x_forwarded_for), PDO::PARAM_STR);
			$a[]=array(":vars2_remote_address", $AddComment->ensure_amp($vars2_remote_address), PDO::PARAM_STR);
			for ($i = 0;$i < count($a);$i++) {
				if (!empty($a[$i][0])) {
					$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
				}
			}
			$STH->execute();
			$r = '';
			/**
			 * http://stackoverflow.com/questions/460010/work-around-for-php5s-pdo-rowcount-mysql-issue
			 * replaces: if (mysql_num_rows($query) > 0) {
			 */
			if ($STH->rowCount() > 0) {
				$r = 1;
				exit;
			}
			if (!$r) {
				/**
				 * remove duplicates as a double-check
				 */
				$SQL = "DELETE FROM `" . $table_name;
				$SQL .= "` WHERE `msg`=:comments_textarea AND `user_host`=:vars2_http_x_forwarded_for AND `user_ip`=:vars2_remote_address;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				$a[]=array(":comments_textarea", $AddComment->safe_html($comments_textarea), PDO::PARAM_STR);
				$a[]=array(":vars2_http_x_forwarded_for", $AddComment->ensure_amp($vars2_http_x_forwarded_for), PDO::PARAM_STR);
				$a[]=array(":vars2_remote_address", $AddComment->ensure_amp($vars2_remote_address), PDO::PARAM_STR);
				for ($i = 0;$i < count($a);$i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				/**
				 *  and write new post to DB
				 */
				$SQL = "INSERT INTO `" . $table_name ."` ";
				$SQL .= "(`adddate`, `user_login`, `msg`, `user_host`, `user_ip`, `self_title`, `self_href`) ";
				$SQL .= "VALUES (:adddate, :user_login, :msg, :user_host, :user_ip, :self_title, :self_href);";
				$STH = $DBH->prepare($SQL);
				$a = null;
				$a[]=array(":adddate", (int) $vars2_marker, PDO::PARAM_INT);
				$a[]=array(":user_login", "", PDO::PARAM_STR);
				$a[]=array(":msg", $AddComment->safe_html($comments_textarea), PDO::PARAM_STR);
				$a[]=array(":user_host", $AddComment->ensure_amp($vars2_http_x_forwarded_for), PDO::PARAM_STR);
				$a[]=array(":user_ip", $AddComment->ensure_amp($vars2_remote_address), PDO::PARAM_STR);
				$a[]=array(":self_title", $AddComment->conv_symbs_to_ents($self_title), PDO::PARAM_STR);
				$a[]=array(":self_href", $AddComment->ensure_amp(htmlentities($self_href)), PDO::PARAM_STR);
				for ($i = 0;$i < count($a);$i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				/**
				 * clear cache
				 */
				$AddComment->empty_caching_db($SQLITE_CACHE, $cache_table_name);
				/**
				 * inform admin
				 */
				$sendmail_inc_path = $relpa . 'inc/sendmail.inc';
				if (file_exists($sendmail_inc_path)
					&& $vars2_site_root_printable != 'localhost'
					) {
					$sendmail_textarea = 'comments_textarea: ' .
											$AddComment->safe_html($comments_textarea) .
											' self_title: ' .
											$AddComment->conv_symbs_to_ents($self_title) .
											' self_href: ' .
											$AddComment->ensure_amp(htmlentities($self_href));
					include $sendmail_inc_path;
				}
			}
		}
		$DBH = null;
	} catch(PDOException $e) {
		echo $e->getMessage();
	}
}
$SQLITE_CACHE = null;
ob_end_flush();
