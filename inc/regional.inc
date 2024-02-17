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
$relpa = ($relpa0 = preg_replace("/[\/]+/", "/", $_SERVER['DOCUMENT_ROOT'] . '/')) ? $relpa0 : '';

$regional_file_path = ($server_http_host = $_SERVER['HTTP_HOST']) ? $relpa . 'inc/regional_' . str_replace('www.', '', $server_http_host) . '.inc' : '';

$pt_regional = null;

if ($regional_file_path && file_exists($regional_file_path)) {
	include $regional_file_path;
}
