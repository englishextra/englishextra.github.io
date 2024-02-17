<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/**
 * Observer pattern
 *
 * PHP version 5
 *
 * @package    Pattern
 * @subpackage Observer
 * @author     Ian Eure <ian@digg.com>
 * @copyright  2008, 2009 Digg, Inc. All rights reserved.
 * @filesource
 */
/**
 * Observer pattern
 *
 * @package    Pattern
 * @subpackage Observer
 * @author     Ian Eure <ian@digg.com>
 * @version    Release: @package-version@
 */
interface Pattern_Observer {
	/**
	 * This is called when we're attached to a subject
	 *
	 * @param object $subject Object we're observing
	 *
	 * @return void
	 */
	public function attached(Pattern_Subject $subject);
	/**
	 * Return the subject
	 *
	 * @return Pattern_Subject The subject we're observing
	 */
	public function getSubject();
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
	public function getCount($action = '');
}
