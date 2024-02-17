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
$ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";
if (!$ua) {exit;}
$a_inc = array(
	'lib/swamper.class.php'
);
foreach ($a_inc as $v) {require_once $relpa . $v;}
class ForceDownload extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function output_file($fullPath) {
		// Must be fresh start
		if( headers_sent() ) {die('Headers Sent');}
		// Required for some browsers
		if(ini_get('zlib.output_compression')) {ini_set('zlib.output_compression', 'Off');}
		if ($fd = fopen ($fullPath, "r")) {
			$fsize = filesize($fullPath);
			$path_parts = pathinfo($fullPath);
			$ext = strtolower($path_parts["extension"]);
			$ctype = "application/force-download";
			switch ($ext) {
				case "pdf": $ctype = "application/pdf";break;
				case "exe": $ctype = "application/octet-stream";break;
				case "zip": $ctype = "application/zip";break;
				case "doc": $ctype = "application/msword";break;
				case "xls": $ctype = "application/vnd.ms-excel";break;
				case "ppt": $ctype = "application/vnd.ms-powerpoint";break;
				case "epub": $ctype = "application/epub+zip";break;
				case "mobi": $ctype = "application/x-mobipocket-ebook";break;
				case "fb2": $ctype = "application/x-fictionbook";break;
				case "gif": $ctype = "image/gif";break;
				case "png": $ctype = "image/png";break;
				case "jpeg":
				case "jpg": $ctype = "image/jpg";break;
				default: $ctype = "application/force-download";
			}
			header("Pragma: public");// required
			header("Expires: 0");
			header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
			header("Cache-Control: private",false);// required for certain browsers
			header("Content-Type: ". $ctype);
			header("Content-Disposition: attachment;filename=\"".basename($fullPath)."\";" );
			header("Content-Transfer-Encoding: binary");
			header("Content-Length: ". $fsize);
			ob_clean();
			flush();
			while(!feof($fd)) {
				$buffer = fread($fd, 2048);
				echo $buffer;
			}
		}
		fclose ($fd);
		//exit;
	}
}
if (!isset($ForceDownload) || empty($ForceDownload)) {
	$ForceDownload = new ForceDownload ();
}
$file_path = $ForceDownload->get_post('file_path');
$file_path1 = preg_replace("/[\/\/]+/","/", $relpa . $file_path);
if (
	$file_path
	&& !$ForceDownload->has_http($file_path)
	&& file_exists($file_path1)
	) {
	$ForceDownload->output_file($file_path1);
}
ob_end_flush();
