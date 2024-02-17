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
	/* 'inc/regional.inc',
	'inc/adminauth.inc', */
	'lib/swamper.class.php',
	'inc/vars2.inc'
);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
class SitemapGenerator extends Swamper {
	function __construct() {
		parent::__construct();
	}
	
	public function fix_dir_index($s) {
		/* $s = str_replace(array("/index.html", "/index.php"), array("/", "/"), $s); */
		$s = preg_replace("/[\/]+/", "/", $s);
		/* $s = preg_replace("/[\/]+$/", "/", $s); */
		$s = preg_replace("/^\//", "", $s);
		return $s;
	}	
	public function update_dir_info($relpa, $production_dir, $site_root, $ext, $changefreq, $priority) {
		$p = '';
		$dir = $relpa . $production_dir;
		$dir = preg_replace("/[\/]+/", "/", $dir);
		if ($opendir = opendir($dir)) {
			$files = array();
			/* http://habrahabr.ru/post/146408/ */
			while (false !== ($files[] = readdir($opendir)));
			sort($files, SORT_STRING);
			reset($files);
			closedir($opendir);
			foreach ($files as $file) {
				if (
						!is_dir($dir . $file)
						&& preg_match("/\." . preg_quote($ext, "/") . "$/i", $file)
						//&& $file !='index.html'
						&& $file != 'index.php'
				) {
					$content = file_get_contents($dir . $file);
					if (
							preg_match('#<title[^>]*>(.+?)</title>#', $content, $matches0)
							&& preg_match('#<meta name="description" content="(.+?)"(\ \/|)>#', $content, $matches1)
					) {
						$p .= '<url>' . "\n" . '<loc>' . $this->ensure_amp(htmlentities( $site_root . $this->fix_dir_index($production_dir . $file) )) . '</loc>' . "\n" . '<lastmod>' . date('Y-m-d\TH:i:s+00:00') . '</lastmod>' . "\n" . '<changefreq>' . $changefreq . '</changefreq>' . "\n" . '<priority>' . $priority . '</priority>' . "\n" . '</url>' . "\n";
					}
				}
			}
		}
		return $p;
	}
	public function update_dir_info2($relpa, $production_dir, $site_root, $ext) {
		$p = '';
		$dir = $relpa . $production_dir;
		$dir = preg_replace("/[\/]+/", "/", $dir);
		if ($opendir = opendir($dir)) {
			$files = array();
			while ($files[] = readdir($opendir));
			sort($files, SORT_STRING);
			reset($files);
			closedir($opendir);
			foreach ($files as $file) {
				if (
						!is_dir($dir . $file)
						&& preg_match("/\." . preg_quote($ext, "/") . "$/i", $file)
						//&& $file !='index.html'
						&& $file != 'index.php'
				) {
					$content = file_get_contents($dir . $file);
					if (
							preg_match('#<title[^>]*>(.+?)</title>#', $content, $matches0)
							&& preg_match('#<meta name="description" content="(.+?)"(\ \/|)>#', $content, $matches1)
					) {
			
						$p .= $this->ensure_amp(htmlentities( $site_root . $this->fix_dir_index($production_dir . $file) )) . "\n";
					}
				}
			}
		}
		return $p;
	}
	public function compressToGZ($srcName, $dstName) {
		$fp = fopen($srcName, "r");
		$data = fread($fp, filesize($srcName));
		fclose($fp);
		$zp = gzopen($dstName, "w9");
		gzwrite($zp, $data);
		gzclose($zp);
	}
}
if (!isset($SitemapGenerator) || empty($SitemapGenerator)) {
	$SitemapGenerator = new SitemapGenerator ();
}
$dir = null;
require_once $relpa . 'inc/dir.inc';
sort($dir, 0);
reset($dir);
/**
 * update sitemap.xml
 */
$sitemap_xml = 'sitemap.xml';
$sitemap_xml_gz = 'sitemap.xml.gz';
$sitemap_changefreq = 'monthly';
$sitemap_priority = '0.2';
$s = '';
for ($i = 0; $i < count($dir); $i++) {
	if (!empty($dir[$i][0])) {
		$s .= $SitemapGenerator->update_dir_info($relpa, $dir[$i][0], $vars2_site_root, "html", $sitemap_changefreq, $sitemap_priority);
	}
}
$SitemapGenerator->write_file($relpa . $sitemap_xml, '<?xml version="1.0" encoding="UTF-8"?>
	<?xml-stylesheet type="text/xsl" href="' . htmlentities($vars2_site_root) . 'feeds/sitemap.xsl"?>
	<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
	<loc>' . htmlentities($vars2_site_root) . '</loc>
	<lastmod>' . date('Y-m-d\TH:i:s+00:00') . '</lastmod>
	<changefreq>daily</changefreq>
	<priority>' . $sitemap_priority . '</priority>
	</url>
	' . $s . '
	</urlset>', "w+");
/**
 * update sitemap.xml.gz
 */
$SitemapGenerator->compressToGZ($relpa . $sitemap_xml, $relpa . $sitemap_xml_gz);
/**
 * update urllist.txt
 */
$urllist_txt = 'urllist.txt';
$s = '';
for ($i = 0; $i < count($dir); $i++) {
	if (!empty($dir[$i][0])) {
		$s .= $SitemapGenerator->update_dir_info2($relpa, $dir[$i][0], $vars2_site_root, "html");
	}
}
$SitemapGenerator->write_file($relpa . $urllist_txt, $s, "w+");
echo 'done!';
