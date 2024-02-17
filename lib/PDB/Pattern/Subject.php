<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/**
 * Subject pattern
 *
 * PHP version 5
 *
 * @package    Pattern
 * @subpackage Subject
 * @author     Ian Eure <ian@digg.com>
 * @copyright  2008, 2009 Digg, Inc. All rights reserved.
 * @filesource
 */
/**
 * Subject pattern
 *
 * @package    Pattern
 * @subpackage Subject
 * @author     Ian Eure <ian@digg.com>
 * @version    Release: @package-version@
 */
interface Pattern_Subject {
	/**
	 * Attach an observer
	 *
	 * @param Pattern_Observer $observer The observer to attach
	 *
	 * @return void
	 */
	public function attach(Pattern_Observer $observer);
	/**
	 * Get attached observers
	 *
	 * @return array Array of Pattern_Observer instances
	 */
	public function getObservers();
	/**
	 * Detach an observer
	 *
	 * @param Pattern_Observer $observer The observer to detach
	 *
	 * @return void
	 * @throws InvalidArgumentException When the observer isn't attached
	 */
	public function detach(Pattern_Observer $observer);
}
