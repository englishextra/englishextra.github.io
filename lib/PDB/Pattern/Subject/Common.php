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
 * Subject pattern, common code
 *
 * PHP version 5
 *
 * @package    Pattern
 * @subpackage Subject
 * @author     Ian Eure <ian@digg.com>
 * @copyright  2008, 2009 Digg, Inc. All rights reserved.
 * @filesource
 */
require_once $relpa . 'lib/PDB/Pattern/Subject.php';
require_once $relpa . 'lib/PDB/Pattern/Observer.php';
/**
 * Pattern_Subject_Common
 *
 * @package    Pattern
 * @subpackage Subject
 * @author     Ian Eure <ian@digg.com>
 * @version    Release: @package-version@
 */
abstract class Pattern_Subject_Common implements Pattern_Subject {
	/**
	 * Classes observing this subject
	 *
	 * @var array
	 */
	protected $observers = array();
	/**
	 * Attach an observer
	 *
	 * @param Pattern_Observer $observer The observer to attach
	 *
	 * @return void
	 */
	public function attach(Pattern_Observer $observer) {
		$this->observers[] = $observer;
		$observer->attached($this);
	}
	/**
	 * Observe an action
	 *
	 * @param string $action Action which is happening
	 * @param array  $args   Action arguments
	 *
	 * @return void
	 */
	protected function observe($action, array $args = array()) {
		foreach ($this->observers as $o) {
			if (is_callable(array($o, $action))) {
				call_user_func(array($o, $action), $args);
			}
		}
	}
	/**
	 * Get attached observers
	 *
	 * @return array Array of Pattern_Observer instances
	 */
	public function getObservers() {
		return $this->observers;
	}
	/**
	 * Detach an observer
	 *
	 * @param Pattern_Observer $observer The observer to detach
	 *
	 * @return void
	 * @throws InvalidArgumentException When the observer isn't attached
	 */
	public function detach(Pattern_Observer $observer) {
		$len = count($this->observers);
		foreach ($this->observers as $k => &$attached) {
			if ($observer === $attached) {
				unset($this->observers[$k]);
			}
		}
		if (count($this->observers) == $len) {
			throw new InvalidArgumentException("Observer " .
					get_class($observer) .
					" isn't attached.");
		}
	}
}
