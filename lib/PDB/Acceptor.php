<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/**
 * Accept other objects
 *
 * PHP version 5
 *
 * @category   Patterns
 * @package    Pattern
 * @subpackage Acceptor
 * @author     Ian Eure <ian@digg.com>
 * @copyright  2009 Digg, Inc. All rights reserved.
 * @filesource
 */
/**
 * Acceptor
 *
 * @package Pattern
 * @author  Ian Eure <ian@digg.com>
 * @version Release: @package-version@
 */
interface Pattern_Acceptor {
	/**
	 * Accept a new object
	 *
	 * @param mixed $object The objet to accept
	 *
	 * @return void
	 * @throws InvalidArgumentException When object is unacceptable
	 */
	public function accept($object);
	/**
	 * Unaccept an object
	 *
	 * @param string $name Name of the object to unaccept
	 *
	 * @return void
	 */
	public function unaccept($name);
	/**
	 * Get an accepted object
	 *
	 * @param string $object Object name
	 *
	 * @return mixed Object
	 * @throws InvalidArgumentException When object is not available
	 */
	public function getAccepted($object);
	/**
	 * Get a list of acceptable classes
	 *
	 * @return array Array of instances this object accepts
	 */
	public function getAcceptable();
}
