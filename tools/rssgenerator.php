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
class RSSGenerator extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function conv_symbs_to_ents($s, $length = '') {
		$s = str_replace(array("&#160;","&#8201;"), array(" "," "), $s);
		$s = $this->safe_html($s, $length);
		return $s;
	}
	public function fix_dir_index($s) {
		/* $s = str_replace(array("/index.html", "/index.php"), array("/", "/"), $s); */
		$s = preg_replace("/[\/]+/", "/", $s);
		/* $s = preg_replace("/[\/]+$/", "/", $s); */
		$s = preg_replace("/^\//", "", $s);
		return $s;
	}
	public function update_dir_info($relpa, $production_dir, $site_root, $ext, $length) {
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
						if (!empty($page_title) && !empty($description)) {
							$p .= '<item><title>' . $page_title . '</title><description>' . $description . '</description><link>' . $this->ensure_amp(htmlentities( $site_root . $this->fix_dir_index($production_dir . $file) )) . '</link><guid isPermaLink="false">' . md5( $site_root . $this->fix_dir_index($production_dir . $file) ) . '</guid></item>' . "\n";
						}
					}
				}
			}
		}
		return $p;
	}
	public function update_dir_info2($relpa, $production_dir, $site_root, $ext, $length) {
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
				if (!is_dir($dir . $file)
						&& preg_match("/\." . preg_quote($ext, "/") . "$/i", $file)
						//&& $file !='index.html'
						&& $file != 'index.php'
				) {
					$content = file_get_contents($dir . $file);
					if (
							preg_match('#<title[^>]*>(.+?)</title>#', $content, $matches0)
							&& preg_match('#<meta name="description" content="(.+?)" />#', $content, $matches1)
					) {
						$page_title = $this->conv_symbs_to_ents($matches0[1], $length);
						$description = $this->conv_symbs_to_ents($matches1[1], $length);
						if (!empty($page_title) && !empty($description)) {
							/*$p .= '<item><link>' . $this->ensure_amp(htmlentities(str_replace(array("/index.html", "/index.php", "//"), array("/", "/", "/"), $site_root . $production_dir . $file))) . '</link><title>' . $page_title . '</title><description>' . $description . '</description><ror:updatePeriod>daily</ror:updatePeriod><ror:sortOrder>1</ror:sortOrder><ror:resourceOf>sitemap</ror:resourceOf></item>' . "\n";*/
							$p .= '<item><link>' . $this->ensure_amp(htmlentities( $site_root . $this->fix_dir_index($production_dir . $file) )) . '</link><title>' . $page_title . '</title><description>' . $description . '</description><ror:updatePeriod>daily</ror:updatePeriod><ror:sortOrder>1</ror:sortOrder><ror:resourceOf>sitemap</ror:resourceOf></item>' . "\n";
						}
					}
				}
			}
		}
		return $p;
	}
}
if (!isset($RSSGenerator) || empty($RSSGenerator)) {
	$RSSGenerator = new RSSGenerator ();
}
$length = 4000;
$dir = null;
require_once $relpa . 'inc/dir.inc';
sort($dir, 0);
reset($dir);
/**
 * update pages.xml
 */
$pages_xml = 'feeds/pages.xml';
$s = '';
for ($i = 0; $i < count($dir); $i++) {
	if (!empty($dir[$i][0])) {
		$s .= $RSSGenerator->update_dir_info($relpa, $dir[$i][0], $vars2_site_root, "html", $length);
	}
}
$RSSGenerator->write_file($relpa . $pages_xml, '<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" media="screen" href="/~d/styles/rss2enclosuresfull.xsl"?>
<?xml-stylesheet type="text/css" media="screen" href="http://feeds.feedburner.com/~d/styles/itemcontent.css"?>
<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
	xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
	xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
	xmlns:media="http://search.yahoo.com/mrss/"
	version="2.0" xml:lang="ru-RU">
<channel>
	<title>Страницы ' . $vars2_site_root_printable . '</title>
	<link>' . $vars2_site_root . '</link>
	<description>Страницы ' . $vars2_site_root_printable . '</description>
	<image>
		<url>' . $vars2_site_root . 'apple-touch-icon-114x114.png</url>
		<title>Страницы ' . $vars2_site_root_printable . '</title>
		<link>' . $vars2_site_root . '</link>
		<width>114</width>
		<height>114</height>
	</image>
	<lastBuildDate>' . date("r") . '</lastBuildDate>
	<language>en</language>
	<sy:updatePeriod>daily</sy:updatePeriod>
	<sy:updateFrequency>1</sy:updateFrequency>
	<generator>Страницы ' . $vars2_site_root_printable . '</generator>
<itunes:subtitle>Страницы ' . $vars2_site_root_printable . '</itunes:subtitle>
<itunes:author>Страницы ' . $vars2_site_root_printable . '</itunes:author>
<itunes:summary>Страницы ' . $vars2_site_root_printable . '</itunes:summary>
<itunes:owner>
	<itunes:name>Страницы ' . $vars2_site_root_printable . '</itunes:name>
	<itunes:email>serguei@shimansky.biz</itunes:email>
</itunes:owner>
<itunes:image href="' . $vars2_site_root . 'iTunesArtwork.png" />
<itunes:category text="Education" />
	<atom10:link xmlns:atom10="http://www.w3.org/2005/Atom" rel="self" type="application/rss+xml" href="' . $vars2_site_root . $pages_xml . '" />
	<atom10:link xmlns:atom10="http://www.w3.org/2005/Atom" rel="hub" href="http://pubsubhubbub.appspot.com/" />
	<media:thumbnail url="' . $vars2_site_root . 'iTunesArtwork.png" />
	<media:category scheme="http://www.itunes.com/dtds/podcast-1.0.dtd">Education</media:category>
	<itunes:explicit>no</itunes:explicit>
	' . $s . '
	<media:credit role="author">Страницы ' . $vars2_site_root_printable . '</media:credit>
	<media:rating>nonadult</media:rating>
	<media:description type="plain">Страницы ' . $vars2_site_root_printable . '</media:description>
	</channel>
	</rss>', "w+");
/**
 * update ror.xml
 */
$ror_xml = 'ror.xml';
$s = '';
for ($i = 0; $i < count($dir); $i++) {
	if (!empty($dir[$i][0])) {
		$s .= $RSSGenerator->update_dir_info2($relpa, $dir[$i][0], $vars2_site_root, "html", $length);
	}
}
$RSSGenerator->write_file($relpa . $ror_xml, '<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:ror="http://rorweb.com/0.1/" >
<channel>
  <title>ROR Страницы ' . $vars2_site_root . '</title>
  <link>' . $vars2_site_root . '</link>
	' . $s . '
	</channel>
	</rss>', "w+");
	echo 'done!';
