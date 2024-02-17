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
require_once $relpa . 'lib/PDB/Pattern/Acceptor.php';
require_once $relpa . 'lib/PDB/Pattern/Subject/Common.php';
/**
 * Acceptor
 *
 * @package Pattern
 * @author  Ian Eure <ian@digg.com>
 * @version Release: @package-version@
 */
abstract class Pattern_Acceptor_Common extends Pattern_Subject_Common implements Pattern_Acceptor {
	/**
	 * Objects we've accepted
	 *
	 * @var array
	 */
	private $objects = array();
	/**
	 * Objects we can accept
	 *
	 * Format is:
	 * 'name' => 'class', …
	 *
	 * e.g. to accept a PDO object as 'DB':
	 *
	 * 'DB' => 'PDO'
	 *
	 * You can then call $this->getDB() to return the object.
	 *
	 * @var array
	 */
	protected $acceptable = array();
	/**
	 * Accept a new object
	 *
	 * @param mixed $object The object to accept
	 *
	 * @return void
	 * @throws InvalidArgumentException When object is unacceptable
	 */
	public function accept($object) {
		if (!is_object($object)) {
			throw new InvalidArgumentException("Can't accept non-objects.");
		}
		foreach ($this->getAcceptable() as $name => $bases) {
			$bases = is_array($bases) ? $bases : array($bases);
			foreach ($bases as $base) {
				if ($object instanceof $base) {
					$this->objects[$name] = $object;
					if (is_callable(array($this, 'accepted' . $name))) {
						call_user_func(array($this, 'accepted' . $name), $object);
					}
					$this->observe('accept', array('name' => $name,
						'object' => $object));
					return;
				}
			}
		}
		throw new InvalidArgumentException("Objects of class " .
				get_class($object) .
				" are unacceptable.");
	}
	/**
	 * Unaccept an object
	 *
	 * @param string $name Name of the object to unaccept
	 *
	 * @return void
	 */
	public function unaccept($name) {
		unset($this->objects[$name]);
	}
	/**
	 * Accept the default object instance
	 *
	 * @param string $object The object to accept a default instance of
	 *
	 * @return void
	 */
	public function acceptDefault($object) {
		$acceptable = $this->getAcceptable();
		$methods = array(array($this, 'getDefault' . $object),
			array(get_class($this), 'getDefault' . $object));
		foreach ($methods as $default) {
			if (call_user_func_array('method_exists', $default)) {
				$instance = call_user_func($default);
				if (!($instance instanceof $acceptable[$object])) {
					$msg = "Whoa nelly! getDefault{$object}() returned " .
							get_class($instance) . " instance when we were " .
							"expecting a " . $acceptable[$object] .
							"instance.";
					throw new LogicException($msg);
				}
				return $this->accept($instance);
			}
		}
		throw new RuntimeException("Object $object wasn't accepted " .
				"and no getDefault{$object}() " .
				"method exists.");
	}
	/**
	 * Get a list of acceptable classes
	 *
	 * @return array Array of instances this object accepts
	 */
	public function getAcceptable() {
		return $this->acceptable;
	}
	/**
	 * Magic call to return objects
	 *
	 * @param string $method The method being called
	 * @param array  $args   Arguments to the function
	 *
	 * @return mixed Object or null
	 */
	public function __call($method, array $args = array()) {
		return (strpos($method, 'get') === 0) ?
				$this->getAccepted(substr($method, 3)) : null;
	}
	/**
	 * Get an accepted object
	 *
	 * @param string $object Object name
	 *
	 * @return mixed Object
	 * @throws InvalidArgumentException When object is not available
	 */
	public function getAccepted($object) {
		$acceptable = $this->getAcceptable();
		if (!isset($acceptable[$object])) {
			throw new InvalidArgumentException("Can't get unacceptable object " .
					$object);
		}
		if (!isset($this->objects[$object])) {
			$this->acceptDefault($object);
		}
		return $this->objects[$object];
	}
}
