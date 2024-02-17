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
function lib_local_prepare_str($s) {
	return $s = str_replace(array("|", "\n", "\r", "\t", "\v", "\0", "\x0B", '"'), "", trim($s));
}

if (!isset($pt_regional) || empty($pt_regional)) {
	include $relpa . 'inc/regional.inc';
}

$is_user = '';
$is_admin = '';
$is_moder = '';

$visitor_login = '';
$visitor_pass = '';

if (is_array($_COOKIE)) {

	if (isset($_COOKIE['privateteacher'])) {

		$r1 = '';
		$r2 = '';

		foreach ($_COOKIE['privateteacher'] as $n => $v) {

			if ($n == 'login') {
				$r1 = 1;
				$visitor_login = lib_local_prepare_str($v);
			}

			if ($n == 'pass') {
				$r2 = 1;
				$visitor_pass = lib_local_prepare_str($v);
			}
		}

		if ($r1
				&& $r2
		) {

			$is_user = 1;

			if ($visitor_login == $pt_regional['admin_login']
					&& $visitor_pass == $pt_regional['md5_admin_pass']
			) {

				$is_admin = 1;
			}

			if ($visitor_login == $pt_regional['moder_login']
					&& $visitor_pass == $pt_regional['md5_moder_pass']
			) {

				$is_admin = 1;
				$is_moder = 1;
			}
		}
	}
}
