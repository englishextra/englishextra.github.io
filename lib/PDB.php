<?php
/**
 * A simplistic wrapper for PDO
 *
 * PDB is a simplistic wrapper that adds helper functions to PDO. It was
 * creatd in the vain of DB and MDB2, but a pure PHP5/PDO implementation.
 *
 * PHP version 5
 *
 * Copyright (c) 2007, Digg, Inc.
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  - Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *  - Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *  - Neither the name of the Digg, Inc. nor the names of its contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * @category   DB
 * @package    PDB
 * @author     Joe Stump <joe@joestump.net>
 * @copyright  2007-2008 (c) Digg.com
 * @license    http://tinyurl.com/42zef New BSD License
 * @version    CVS: $Id:$
 * @link       http://www.php.net/pdo
 * @link       http://pear.php.net/package/PDB
 * @filesource
 */
/**
 * Base PDB class
 *
 * @category   DB
 * @package    PDB
 * @author     Joe Stump <joe@joestump.net>
 * @copyright  2007-2008 (c) Digg.com
 * @license    http://tinyurl.com/42zef New BSD License
 * @version    Release: @package_version@
 * @link       http://pear.php.net/package/PDB
 */
abstract class PDB {
	/**
	 * All PDB-specific attributes have this bit set
	 *
	 * @var int
	 */
	const PDB_ATTRS = 0xf0000;
	/**
	 * Whether PDB should attempt to reconnect when we get a "2006
	 * MySQL server has gone away" exception.
	 *
	 * @var int
	 */
	const RECONNECT = 0xf0001;
	/**
	 * Singleton connections
	 *
	 * @see PDB::singleton()
	 * @var array $singletons
	 */
	static protected $singletons = array();
	/**
	 * Connect to a database
	 *
	 * @param string $dsn      PDO DSN (e.g. mysql:host=127.0.0.1:dbname=foo)
	 * @param string $username The DB username
	 * @param string $password The DB password
	 * @param array  $options  PDO options
	 *
	 * @access public
	 * @throws {@link PDB_Exception} when unable to connect
	 * @link http://us.php.net/manual/en/pdo.constants.php
	 * @link http://us.php.net/manual/en/pdo.construct.php
	 * @return object Instance of PDB driver
	 */
	public static function connect($dsn, $username = null, $password = null, array $options = array()) {
		list($type, ) = explode(':', $dsn);
		$file = 'PDB/' . $type . '.php';
		include_once $file;
		$class = 'PDB_' . $type;
		if (!class_exists($class)) {
			throw new PDB_Exception('PDB class not found: ' . $class);
		}
		try {
			$instance = new $class($dsn, $username, $password, $options);
		} catch (PDOException $error) {
			throw new PDB_Exception($error);
		}
		return $instance;
	}
	/**
	 * Create a singleton DB connection
	 *
	 * @param string $dsn      PDO DSN (e.g. mysql:host=127.0.0.1:dbname=foo)
	 * @param string $username The DB username
	 * @param string $password The DB password
	 * @param array  $options  PDO options
	 *
	 * @access public
	 * @return object Instance of PDB driver
	 * @throws {@link PDB_Exception} when unable to connect
	 * @link http://us.php.net/manual/en/pdo.construct.php
	 */
	static public function singleton($dsn, $username = null, $password = null, array $options = array()) {
		$key = md5($dsn . $username . $password . serialize($options));
		if (!isset(self::$singletons[$key])) {
			self::$singletons[$key] = self::connect($dsn, $username, $password, $options);
		}
		return self::$singletons[$key];
	}
}
