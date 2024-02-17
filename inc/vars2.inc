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
if (get_magic_quotes_gpc()) {
	die(trigger_error('Turn off <strong>magic_quotes_gpc</strong> in .htaccess<br /><br /><em>php_flag magic_quotes_gpc Off</em><br /><br />OR<br /><br /><em>php_value magic_quotes_gpc Off</em>', E_USER_ERROR));
}

///////////////////////////////////////////////////
$vars2_php_version = function_exists('phpversion') ? phpversion() : '';

$vars2_date_default_timezone = 'Europe/Moscow';

if ($vars2_php_version >= '5.1.0') {
	date_default_timezone_set($vars2_date_default_timezone);
}

if ($vars2_php_version < '4.1.0') {
	$_POST = $HTTP_POST_VARS;
	$_GET = $HTTP_GET_VARS;
	$_SERVER = $HTTP_SERVER_VARS;
	$_COOKIE = $HTTP_COOKIE_VARS;
	$_ENV = $HTTP_ENV_VARS;
	$_FILES = $HTTP_POST_FILES;
	if (!empty($HTTP_SESSION_VARS)) {
		$_SESSION = $HTTP_SESSION_VARS;
	}
}

$vars2_http_referer = !empty($_SERVER['HTTP_REFERER']) ? trim($_SERVER['HTTP_REFERER']) : '';

$vars2_remote_address = !empty($_SERVER['REMOTE_ADDR']) ? trim($_SERVER['REMOTE_ADDR']) : '';
/**
 * if you use cloudflare NS servers
 * you get cloadflare ips not real ones
 */
if ( !empty($_SERVER["HTTP_CF_CONNECTING_IP"]) ) {
	$vars2_remote_address = trim($_SERVER["HTTP_CF_CONNECTING_IP"]);
}

$vars2_http_x_forwarded_for = !empty($REMOTE_ADDR) ? trim(@gethostbyaddr($REMOTE_ADDR)) : '';
if (!$vars2_http_x_forwarded_for) {
	$vars2_http_x_forwarded_for = trim(@gethostbyaddr($vars2_remote_address)) ? trim(@gethostbyaddr($vars2_remote_address)) : '';
}

$vars2_user_agent = !empty($_SERVER['HTTP_USER_AGENT']) ? getenv('HTTP_USER_AGENT') : '';

/////////////////////////////////////////////////////////

$vars2_is_win = (strtolower(substr(PHP_OS, 0, 3)) == 'win') ? 1 : '';

$vars2_slash = !empty($vars2_is_win) ? '\\' : '/';

$re = $vars2_is_win ? '\\\\' : '\/';

$vars2_site_directory_printable = preg_replace("/${re}$/", '', str_replace('www.', '', $_SERVER['HTTP_HOST']) . dirname($_SERVER['PHP_SELF']));
$vars2_site_directory = 'http://' . preg_replace("/\:80$/", '', $vars2_site_directory_printable) . '/';

$vars2_site_root_printable = str_replace('www.', '', $_SERVER['HTTP_HOST']);
$vars2_site_root0 = 'http://' . preg_replace("/\:80$/", '', $vars2_site_root_printable);
$vars2_site_root = $vars2_site_root0 . '/';

$vars2_cookie_domain = ($vars2_site_root != 'http://localhost/') ? '.' . $vars2_site_root_printable : false;

$vars2_query_string = !empty($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : '';

$vars2_request_uri = !empty($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';

$vars2_php_self = !empty($_SERVER['PHP_SELF']) ? $_SERVER['PHP_SELF'] : '';

$vars2_self = $vars2_query_string ? '?' . $vars2_query_string : preg_replace("/\/$/", '', $vars2_site_root) . $vars2_php_self;

$vars2_self_nice = !empty($_SERVER['REQUEST_URI']) ? $vars2_site_root0 . '/' . preg_replace("/^\//i", "", $_SERVER['REQUEST_URI']) : $vars2_self;

$vars2_marker = time();
$vars2_date = date("d.m.Y");
$vars2_time = date("H:i:s");
$vars2_start_time = mktime(0, 0, 0, date("m"), date("d"), date("Y"));
$vars2_end_time = mktime(23, 59, 59, date("m"), date("d"), date("Y"));

/////////////////////////////////////////////////////////
$aids_cambridge_english_grammar_table_name = 'aids_cambridge_english_grammar';
$aids_englishpod_table_name = 'aids_englishpod';
$dict_enru_keyboard_typo_table_name = 'dict_enru_keyboard_typo';
$dict_ruru_autocomplete_table_name = 'dict_ruru_autocomplete';
$dict_ruru_reverse_table_name = 'dict_ruru_reverse';
$aids_gallery_table_name = 'aids_gallery';
$aids_more_table_name = 'aids_more';
$aids_products_table_name = 'aids_products';
$aids_bridge_to_english2_table_name = 'aids_bridge_to_english2';
$aids_idiom_drills_table_name = 'aids_idiom_drills';
$aids_effortless_english_lessons_table_name = 'aids_effortless_english_lessons';
$aids_english_for_russian_speakers_table_name = 'aids_english_for_russian_speakers';
$aids_learning_english_words_table_name = 'aids_learning_english_words';
$aids_english_for_business_meetings_table_name = 'aids_english_for_business_meetings';
$aids_essays_table_name = 'aids_essays';
$aids_golitsynsky_exercises2006_table_name = 'aids_golitsynsky_exercises2006';
$aids_golitsynsky_keys2004_table_name = 'aids_golitsynsky_keys2004';
$aids_golitsynsky_keys2007_table_name = 'aids_golitsynsky_keys2007';
$aids_golitsynsky_spoken_english1998_table_name = 'aids_golitsynsky_spoken_english1998';
$aids_grammar_table_name = 'aids_grammar';
$aids_quotations_in_english_table_name = 'aids_quotations_in_english';
$aids_quizzes_table_name = 'aids_quizzes';
$aids_rozentalorpho_table_name = 'aids_rozentalorpho';
$aids_tests_table_name = 'aids_tests';
$aids_topics_table_name = 'aids_topics';
$aids_transcripts_table_name = 'aids_transcripts';
$aids_visual_dictionary_online_table_name = 'aids_visual_dictionary_online';
$dict_enru_general_table_name = 'dict_enru_general';
$dict_ruen_general_table_name = 'dict_ruen_general';
$dict_enen_quotations_table_name = 'dict_enen_quotations';
$mb_banned_host_table_name = 'mb_banned_host';
$mb_banned_ip_table_name = 'mb_banned_ip';
$options_more_movies_3gp_ipod_psp_table_name = 'options_more_movies_3gp_ipod_psp';
$options_downloads_table_name = 'options_downloads';
$pt_addressbook_table_name = 'pt_addressbook';
$pt_download_table_name = 'pt_download';
$pt_djvu_table_name = 'pt_djvu';
$pt_epub_table_name = 'pt_epub';
$pt_externalcounters_table_name = 'pt_externalcounters';
$pt_comments_table_name = 'pt_comments';
$pt_comments_demo_table_name = 'pt_comments_demo';
$pt_headlines_table_name = 'pt_headlines';
$pt_pages_table_name = 'pt_pages';
$pt_pdf_table_name = 'pt_pdf';
$pt_search_history_table_name = 'pt_search_history';
$pt_weekcalendar_table_name = 'pt_weekcalendar';
$unb1_forums_table_name = 'unb1_Forums';
$unb1_posts_table_name = 'unb1_Posts';
$unb1_threads_table_name = 'unb1_Threads';
$wp_posts_table_name = 'wp_posts';
$wp_term_taxonomy_table_name = 'wp_term_taxonomy';
$wp_terms_table_name = 'wp_terms';
/////////////////////////////////////////////////////////
$vars2_sniffer_log = 'logs/sniffer.log';
$vars2_sniffer_robots_log = 'logs/sniffer_robots.log';
$vars2_ua_log = 'logs/ua.log';
