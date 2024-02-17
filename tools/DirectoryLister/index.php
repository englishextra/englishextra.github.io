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
				'inc/adminauth.inc'
			);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
    // Include the DirectoryLister class
    require_once($relpa . 'tools/DirectoryLister/resources/DirectoryLister.php');
    // Initialize the DirectoryLister object
    $lister = new DirectoryLister();
    // Return file hash
    if (isset($_GET['hash'])) {
        // Get file hash array and JSON encode it
        $hashes = $lister->getFileHash($_GET['hash']);
        $data   = json_encode($hashes);
        // Return the data
        die($data);
    }
    // Initialize the directory array
    if (isset($_GET['dir'])) {
        $dirArray = $lister->listDirectory($_GET['dir']);
    } else {
        $dirArray = $lister->listDirectory($relpa . 'libs/');
    }
/* echo $relpa . 'lib/'; exit; */
    // Define theme path
    if (!defined('THEMEPATH')) {
        define('THEMEPATH', '/tools/DirectoryLister/resources/themes/bootstrap');
    }
    // Set path to theme index
    $themeIndex = $relpa . 'tools/DirectoryLister/resources/themes/bootstrap/index.php';
    // Initialize the theme
    if (file_exists($themeIndex)) {
        include($themeIndex);
    } else {
        die('ERROR: Failed to initialize theme');
    }
