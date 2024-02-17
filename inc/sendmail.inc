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

$a_inc = array(
	'inc/regional.inc',
	'inc/vars2.inc',
	'lib/swamper.class.php'
);

foreach ($a_inc as $v) {
	require_once $relpa . $v;
}

class Sendmail extends Swamper {

	function __construct() {
		parent::__construct();
	}

	public function fix_str_for_sendmail($s) {

		$s = stripslashes($s);

		$s = $this->safe_html($s);

		$s = str_replace(array(
			'&amp;',
			'&#8212;',
			'&#171;',
			'&#187;',
			'&#39;'), array(
			'&',
			'--',
			'\'',
			'\'',
			'\''), $s);
		return $s;
	}

	public function prepare_str($s) {

		$s = stripslashes($s);
		$s = $this->safe_str($s);

		return $s;
	}

	public function get_query_str_params($s) {

		$v = '';

		if (isset($_GET[$s]) || isset($_POST[$s])) {

			$v = isset($_GET[$s]) ? $_GET[$s] : (isset($_POST[$s]) ? urldecode($_POST[$s]) : '');
			$v = $this->prepare_str($v);
		}

		return $v;
	}

}

if (!isset($Sendmail) || empty($Sendmail)) {

	$Sendmail = new Sendmail ();
}

/**
 * this script can be included by other scripts. so this variable might not be empty
 */
if (!isset($sendmail_textarea)) {

	$sendmail_textarea = $Sendmail->get_query_str_params('sendmail_textarea');
}

$email_text = ($email_text0 = $Sendmail->get_post('email_text')) ? $email_text0 : $pt_regional['admin_email'];

if (!empty($sendmail_textarea)) {

	$sendmail_textarea = $Sendmail->fix_str_for_sendmail($sendmail_textarea);

	//mail subject
	$m_subject = 'A message from visitor at ' . $Sendmail->fix_str_for_sendmail($vars2_site_root_printable);
	//mail footer
	$m_footer = $Sendmail->fix_str_for_sendmail($vars2_http_x_forwarded_for) .
			' ' . $Sendmail->fix_str_for_sendmail($vars2_remote_address) .
			' ' . $Sendmail->fix_str_for_sendmail($vars2_user_agent) .
			' ' . $Sendmail->fix_str_for_sendmail($vars2_self_nice);
	//mail body
	$m_body = '';
	$m_body .= $sendmail_textarea . "\n\n";
	$m_body .= $m_footer;
	//mail headers
	//This is typically used to add extra headers (From, Cc, and Bcc). Multiple extra headers should be separated with a CRLF (\r\n).
	$m_headers = "MIME-Version: 1.0\n";
	$m_headers .= "Content-type: text/plain; charset=utf-8\n";
	$m_headers .= "Content-Transfer-Encoding: quoted-printable\n";

	$m_headers .= 'Message-ID: <' . time() . rand(1, 1000) . '@' . $_SERVER['SERVER_NAME'] . '>' . "\n";
	$m_headers .= 'X-Sender: < ' . $pt_regional['admin_email'] . ' >' . "\n";
	$m_headers .= 'From: noreply-' . $pt_regional['admin_email'] . "\n";
	$m_headers .= 'Reply-To: noreply-' . $pt_regional['admin_email'] . "\n";

	if (!@mail($email_text, $m_subject, $m_body, $m_headers)) {
		//sleep(10);
	}
}
