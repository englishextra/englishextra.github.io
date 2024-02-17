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
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/**
 * Observer pattern, common code
 *
 * PHP version 5
 *
 * @package    Pattern
 * @subpackage Observer
 * @author     Ian Eure <ian@digg.com>
 * @copyright  2008, 2009 Digg, Inc. All rights reserved.
 * @filesource
 */
require_once $relpa . 'lib/PDB/Pattern/Subject.php';
require_once $relpa . 'lib/PDB/Pattern/Observer.php';
/**
 * Pattern_Observer_Common
 *
 * @package    Pattern
 * @subpackage Observer
 * @author     Ian Eure <ian@digg.com>
 * @version    Release: @package-version@
 */
abstract class Pattern_Observer_Common implements Pattern_Observer {
	/**
	 * The subject we're observing
	 *
	 * @var Pattern_Subject
	 */
	protected $subject;
	/**
	 * Action counts
	 *
	 * @var array
	 */
	protected $counts = array();
	/**
	 * This is called when we're attached to a subject
	 *
	 * @param Pattern_Subject $subject Object we're observing
	 *
	 * @return void
	 */
	public function attached(Pattern_Subject $subject) {
		if (isset($this->subject)) {
			throw new InvalidArgumentException("Already attached.");
		}
		$this->subject = $subject;
	}
	/**
	 * Return the subject
	 *
	 * @return Pattern_Subject The subject we're observing
	 */
	public function getSubject() {
		return $this->subject;
	}
	/**
	 * Detach this observer
	 *
	 * @return void
	 */
	public function detach() {
		$this->getSubject()->detach($this);
		$this->subject = null;
		$this->counts = array();
	}
	/**
	 * __call
	 *
	 * @param string $func Function we're calling
	 * @param array  $args Function arguments
	 *
	 * @return void
	 */
	public function __call($func, array $args = array()) {
		if (!isset($this->counts[$func])) {
			$this->counts[$func] = 1;
		} else {
			$this->counts[$func]++;
		}
		$func = 'observe_' . $func;
		if (method_exists($this, $func)) {
			call_user_func_array(array($this, $func), $args);
		}
	}
	/**
	 * Get the number of observations made
	 *
	 * If $action is set, return the count for that action. Otherwise,
	 * return the count of all observed actions.
	 *
	 * @param string $action The action we want counts for
	 *
	 * @return int Number of actions we've observed
	 */
	public function getCount($action = '') {
		if ($action == '') {
			return array_sum($this->counts);
		}
		return isset($this->counts[$action]) ? $this->counts[$action] : 0;
	}
}
