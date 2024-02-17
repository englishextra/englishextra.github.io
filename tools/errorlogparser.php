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
	'inc/regional.inc',
	'inc/adminauth.inc',
	'lib/swamper.class.php'
);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
class ErrorLogParser extends Swamper {
	function __construct() {
		parent::__construct();
	}
}
if (!isset($ErrorLogParser) || empty($ErrorLogParser)) {
	$ErrorLogParser = new ErrorLogParser ();
}
$error_log = '';
switch (str_replace('www.', '', $_SERVER['HTTP_HOST'])) {
    case 'localhost':
		$error_log = 'D:/server/logs/error.log';
        break;
    case 'shimansky.biz':
		$error_log = '/usr/home/23954/shimansky.biz/log/' . date("Y-m-d") . '.error.log';
        break;
}
if (!file_exists($error_log)) {
	die('<p>Please specify log file path once again.<br />in /etc/php.ini uncomment and write error_log=/etc/httpd/error_log<br /><br />su<br />cd /etc/httpd<br />touch error_log<br />httpd -k stop<br />httpd</p>');
}
if (!empty($_REQUEST['clear'])) {
	$ErrorLogParser->write_file($error_log, '', "w+");
}
$s = file_get_contents($error_log);
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru" lang="ru">
	<head>
		<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Content-Type" content="application/xhtml+xml;charset=utf-8" />
		<meta name="Robots" content="noarchive,noindex,nofollow" />
		<style><!--/*--><![CDATA[/*><!--*/
			body {
				background-color:ThreedFace;
			}
			/*textarea {background-color:Linen;}*/
			/*]]>*/--></style>
		<title>errorlogparser</title>
	</head>
	<body>
		<form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post"><div><?php echo $error_log; ?></div><div><textarea cols="7" rows="20" style="width:97%;"><?php
echo $ErrorLogParser->ensure_amp(htmlspecialchars($s));
?>
				</textarea></div><div><input type="hidden" name="clear" value="yes" /><input type="submit" name="" value="Clear&#160;this&#160;log" /></div></form>
	</body>
</html>
<?php
ob_end_flush();
