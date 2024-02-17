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
	'inc/regional.inc',
	'inc/adminauth.inc',
	'inc/vars2.inc',
	'lib/swamper.class.php',
	'inc/pdo_mysql.inc'
);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
class PageIndexer extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function conv_symbs_to_ents($s, $length = '') {
		$s = str_replace(array("&#160;","&#8201;"), array(" "," "), $s);
		$s = $this->safe_html($s, $length);
		return $s;
	}
	public function fix_dir_index($s) {
		$s = str_replace(array("/index.html", "/index.php"), array("/", "/"), $s);
		$s = preg_replace("/[\/]+$/", "/", $s);
		return $s;
	}
	public function update_dir_info($relpa, $production_dir, $site_root_printable, $ext, $table_name, $length, $DBH) {
		$dir = $relpa . $production_dir;
		if ($opendir = opendir($dir)) {
			$files = array();
			/* http://habrahabr.ru/post/146408/ */
			while (false !== ($files[] = readdir($opendir)));
			sort($files, SORT_STRING);
			reset($files);
			closedir($opendir);
			foreach ($files as $file) {
				if (!is_dir($dir . $file)
						&& preg_match("/\." . preg_quote($ext, "/") . "$/i", $file)
						//&& $file !='index.html'
						&& $file != 'index.php'
				) {
					$content = file_get_contents($dir . $file);
					if (
							preg_match('#<title[^>]*>(.+?)</title>#', $content, $matches0)
							&& preg_match('#<meta name="description" content="(.+?)"(\ \/|)>#', $content, $matches1)
					) {
						$page_title = $this->conv_symbs_to_ents($matches0[1], $length);
						$description = $this->conv_symbs_to_ents($matches1[1], $length);
						$wordhash = $this->conv_symbs_to_ents(str_replace(array($page_title, $description), array('', ''), $content), $length);
						if (!empty($page_title) && !empty($description)) {
							try {
								$SQL = "INSERT INTO `" . $table_name . "` ";
								$SQL .= "(`id`, `page_title`, `page_url`, `description`, `wordhash`) ";
								$SQL .= "VALUES (:id, :page_title, :page_url, :description, :wordhash);";
								$STH = $DBH->prepare($SQL);
								$a = null;
								/**
								 * for auto_increment set 0 as value
								 * http://www.phpfreaks.com/forums/index.php?topic=181819.0
								 */
								$a[] = array(":id", 0, PDO::PARAM_INT);
								$a[] = array(":page_title", $page_title, PDO::PARAM_STR);
								$a[] = array(":page_url", $this->ensure_amp(htmlentities( $this->fix_dir_index( "/" . $production_dir . $file) )), PDO::PARAM_STR);
								$a[] = array(":description", $description, PDO::PARAM_STR);
								$a[] = array(":wordhash", $wordhash, PDO::PARAM_STR);
								for ($i = 0; $i < count($a); $i++) {
									if (!empty($a[$i][0])) {
										$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
									}
								}
								$STH->execute();
							} catch (PDOException $e) {
								$e->getMessage();
							}
						}
					}
				}
			}
		}
	}
}
if (!isset($PageIndexer) || empty($PageIndexer)) {
	$PageIndexer = new PageIndexer ();
}
$DBH->query("DROP TABLE IF EXISTS `" . $pt_pages_table_name . "`;");
$DBH->query("CREATE TABLE `" . $pt_pages_table_name . "` ( `id` mediumint(9) NOT NULL AUTO_INCREMENT, `page_title` mediumtext NOT NULL, `page_url` varchar(255) NOT NULL DEFAULT '', `description` mediumtext NOT NULL, `wordhash` mediumtext NOT NULL, PRIMARY KEY (`id`), FULLTEXT KEY `page_title` (`page_title`), FULLTEXT KEY `description` (`description`), FULLTEXT KEY `wordhash` (`wordhash`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;");
$length = 4000;
$dir = null;
require_once $relpa . 'inc/dir.inc';
sort($dir, 0);
reset($dir);
/**
 * update pt_pages
 */
for ($i = 0; $i < count($dir); $i++) {
	if (!empty($dir[$i][0])) {
		$PageIndexer->update_dir_info($relpa, $dir[$i][0], $vars2_site_root_printable, 'html', $pt_pages_table_name, $length, $DBH);
	}
}
$DBH = null;
echo 'done!';
