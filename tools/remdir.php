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
class RemDir extends Swamper {
	function __construct() {
		parent::__construct();
	}
}
if (!isset($RemDir) || empty($RemDir)) {
	$RemDir = new RemDir ();
}
/**
 * This is the directory folder that the files reside in to be deleted.
 */
$dir = (isset($_REQUEST['dir'])) ? $_REQUEST['dir'] : '';
if (!$dir) {$dir = $RemDir->get_post('dir') ? $RemDir->get_post('dir') : '';}
if ($dir) {
	$dir = $relpa . $dir;
	$RemDir->remove_dir_content($dir);
	die();
}
ob_end_flush();
?><!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Remove Directory Contents</title>
		<style>
			body {
				padding-top: 50px;
			}
			.starter-template {
				width: 440px;
				padding: 40px 15px;
				text-align: left;
				margin: 0 auto;
			}
		</style>
		<!-- Just for debugging purposes. Don't actually copy this line! -->
		<!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
		  <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		  <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->
		</head>
		<body>
		<div class="container">
			<div class="starter-template">
				<h1>Remove Directory Contents</h1>
				<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="application/x-www-form-urlencoded" role="form">
					<fieldset>
					<!-- <div class="form-group">
					<label for="disabledTextInput">Disabled input</label>
					<input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
					</div>
					<div class="form-group">
					<label for="disabledSelect">Disabled select menu</label>
					<select id="disabledSelect" class="form-control">
					<option>Disabled select</option>
					</select>
					</div>
					<div class="checkbox">
					<label>
					<input type="checkbox"> Can't check this
					</label>
					</div> -->
					<div class="form-group">
						<label for="dir">Disabled input</label>
						<input type="text" id="dir" name="dir" class="form-control" placeholder="Folder Name">
					</div>
					<button type="submit" class="btn btn-primary">Submit</button>
				  </fieldset>
				</form>
			</div>
		</div>
	</body>
</html>
