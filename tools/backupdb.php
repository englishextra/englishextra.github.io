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
/* don't change $STH1 to $STH etc. */
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
class BackupDB extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function conv_symbs_to_ents($s, $length) {
		$s = str_replace(array("&#160;","&#8201;"), array(" "," "), $s);
		$s = $this->safe_html($s, $length);
		return $s;
	}
	public function compressToGZ($srcName, $dstName) {
		$fp = fopen($srcName, "r");
		$data = fread($fp, filesize($srcName));
		fclose($fp);
		$zp = gzopen($dstName, "w9");
		gzwrite($zp, $data);
		gzclose($zp);
	}
	public function delete_file($myFile) {
		if (file_exists($myFile) && is_file($myFile)) {
			$fh = fopen($myFile, "w") or die("can't open file" . $myFile);
			fclose($fh);
			unset($fh);
			unlink($myFile);
		}
	}
}
if (!isset($BackupDB) || empty($BackupDB)) {
	$BackupDB = new BackupDB ();
}
$length = $BackupDB->get_post('length');
if (!$length) {
	$length = 200;
}
define('DUMPFILE', $relpa . 'sql/' . MYSQL_DB_NAME . '.sql');
$BackupDB->clear_data(DUMPFILE);
header('Content-Type: text/plain');
$prefixes = "";
switch ($vars2_site_root_printable) {
	case 'localhost':
		/*$prefixes = "(pt_|options_|dict_enen_quotations|dict_enru_general|dict_ruen_general)";*/
		$prefixes = "(pt_pages|pt_comments)";
		break;
	default:
		$prefixes = "(pt_pages|pt_comments)";
}
try {
	$SQL = "SHOW tables WHERE tables_in_" . MYSQL_DB_NAME . " REGEXP '^" . $prefixes . ".*';";
	$STH1 = $DBH->query($SQL);
	$p = '-- PDO SQL Dump --
SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
--
-- Database: `' . MYSQL_DB_NAME . '`
--
-- --------------------------------------------------------
';
	while ($aTable = $STH1->fetch(PDO::FETCH_ASSOC)) {
		$sTable = $aTable['Tables_in_' . MYSQL_DB_NAME];
		$SQL = "SHOW CREATE TABLE $sTable";
		$STH2 = $DBH->query($SQL);
		$aTableInfo = $STH2->fetch(PDO::FETCH_ASSOC);
		$p .= "\n\n--
-- Table structure for `" . $sTable . "`
--\n\n";
		$p .= "DROP TABLE IF EXISTS `" . $sTable . "`;\n";
		$p .= $aTableInfo['Create Table'] . ";\n";
		$p .= "\n\n--
-- Dumping data for table `" . $sTable . "`
--\n\n";
		$SQL = "SELECT * FROM " . $sTable . "\n";
		$STH3 = $DBH->query($SQL);
		while ($aRecord = $STH3->fetch(PDO::FETCH_ASSOC)) {
			$p .= "INSERT INTO `" . $sTable . "` VALUES (";
			$sRecord = "";
			foreach ($aRecord as $sField => $sValue) {
				$sRecord .= "'" . $BackupDB->conv_symbs_to_ents($sValue, $length) . "',";
			}
			$p .= substr($sRecord, 0, -1);
			$p .= ");\n";
			$BackupDB->write_file(DUMPFILE, $p, "a");
			$p = '';
		}
	}
	$DBH = null;
} catch (Exception $e) {
	echo $e->getMessage();
}
/**
 * update sitemap.xml.gz
 */
$BackupDB->compressToGZ(DUMPFILE, DUMPFILE . '.gz');
$BackupDB->delete_file(DUMPFILE);
echo 'done!';
