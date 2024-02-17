<?php

/**
 * $shimansky.biz
 *
 * Static web site core scripts
 * @package shimansky.biz
 * @author Serguei Shimansky <serguei@shimansky.biz>
 * @copyright Serguei Shimansky 10:07 24.06.2012
 * @access public
 * @version 0.2
 * @link https://bitbucket.org/englishextra/shimansky.biz
 * @link https://github.com/englishextra/shimansky.biz.git
 * @link https://gist.github.com/2981888
 * @link http://pastebin.com/y2Gs4bzE
 */
if (!isset($pt_regional) || empty($pt_regional)) {
	include $relpa . 'inc/regional.inc';
}

$r = '';

if (isset($_SERVER['PHP_AUTH_USER']) &&
		isset($_SERVER['PHP_AUTH_PW'])) {
	if ($_SERVER['PHP_AUTH_USER'] == $pt_regional['admin_login'] &&
			md5($_SERVER['PHP_AUTH_PW']) == $pt_regional['md5_admin_pass']) {
		$r = 1;
	}
}

/* if (!$r) {
	header('WWW-Authenticate: Basic realm="PrivateTeacherAdminCenter"');
	header("HTTP/1.0 401 Unauthorized");
	die('Unauthorized');
} */
