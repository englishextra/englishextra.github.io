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
/**
 * Base PDB class
 *
 * PHP version 5.2+
 *
 * Copyright (c) 2007, 2008, Digg, Inc.
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
 *  - Neither the name of the Digg, INc. nor the names of its contributors
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
require_once $relpa . 'lib/PDB/Exception.php';
require_once $relpa . 'lib/PDB/Result.php';
require_once $relpa . 'lib/PDB/Pattern/Acceptor/Common.php';
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
abstract class PDB_Common extends Pattern_Acceptor_Common {
	/**
	 * Objects we accept
	 *
	 * @var array
	 */
	protected $acceptable = array('PDO' => 'PDO');
	/**
	 * PDO DSN
	 *
	 * @access protected
	 * @var string $dsn PDO DSN (e.g. mysql:host=127.0.0.1;dbname=foo)
	 */
	protected $dsn = '';
	/**
	 * DNS info as an stdClass
	 *
	 * @var stdClass
	 */
	protected $dsnObject = null;
	/**
	 * Username for DB connection
	 *
	 * @access protected
	 * @var string $username DB username
	 */
	protected $user = '';
	/**
	 * Password for DB connection
	 *
	 * @access protected
	 * @var string $password DB password
	 */
	protected $pass = '';
	/**
	 * PDO/Driver options
	 *
	 * @access protected
	 * @var array $options PDO/Driver options
	 * @link http://us.php.net/manual/en/pdo.constants.php
	 * @link http://us.php.net/manual/en/pdo.drivers.php
	 */
	protected $options = array();
	/**
	 * Default fetch mode
	 *
	 * @access      private
	 * @var         int         $fetchMode
	 */
	public $fetchMode = PDO::FETCH_NUM;
	/**
	 * Constructor
	 *
	 * @param string $dsn      The PDO DSN
	 * @param string $username The DB's username
	 * @param string $password The DB's password
	 * @param array  $options  PDO/driver options array
	 *
	 * @return void
	 * @see PDB_Common::connect(), PDB_Common::$dsn, PDB_Common::$username
	 * @see PDB_Common::$password, PDB_Common::$options
	 */
	public function __construct($dsn, $username = '', $password = '', $options = array()) {
		$this->dsn = $dsn;
		$this->user = $username;
		$this->pass = $password;
		$this->options = $options;
		$this->connect();
	}
	/**
	 * Connect to the database
	 *
	 * @return void
	 * @see PDB_Common::$dsn, PDB_Common::$username
	 * @see PDB_Common::$password, PDB_Common::$options
	 * @see PDB_Common::setAttribute
	 */
	public function connect() {
		$this->acceptDefault('PDO');
		$this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	/**
	 * Get the default connetion
	 *
	 * @return PDO
	 */
	public function getDefaultPDO() {
		return new PDO($this->dsn, $this->user, $this->pass, $this->options);
	}
	/**
	 * We accepted a new PDO instance
	 *
	 * @return void
	 */
	public function acceptedPDO($pdo) {
		return;
	}
	/**
	 * Reconnect to the database
	 *
	 * This reconnects to the database with the given parameters from
	 * before we either disconnected or lost the connection. This is useful
	 * for when MySQL (and others probably) servers "go away".
	 *
	 * @see PDB_Common::disconnect(), PDB_Common::connect()
	 * @return void
	 */
	public function reconnect() {
		$this->disconnect();
		$this->connect();
		foreach ($this->options as $attr => $val) {
			$this->setAttribute($attr, $val);
		}
	}
	/**
	 * Disconnect from the DB
	 *
	 * @return void
	 */
	public function disconnect() {
		$pdo = $this->getPDO();
		$pdo = null;
	}
	/**
	 * Get DSN as an stdClass
	 *
	 * @return stdClass The DNS info in an stdClass
	 */
	public function getDSN() {
		if ($this->dsnObject == null) {
			list($type, $parseMe) = explode(':', $this->dsn);
			$parseMe = str_replace(';', '&', $parseMe);
			$dsnParts = array();
			parse_str($parseMe, $dsnParts);
			$dsnParts['name'] = $dsnParts['dbname'];
			$dsnParts['user'] = $this->user;
			$dsnParts['pass'] = $this->pass;
			$dsnParts['type'] = $type;
			unset($dsnParts['dbname']);
			$this->dsnObject = (object) $dsnParts;
		}
		return $this->dsnObject;
	}
	/**
	 * Implement decorator pattern
	 *
	 * Originally {@link PDB} was extended from PDO, but this kept us from
	 * implementing valid {@link PDB_Common::disconnect()} and
	 * {@link PDB_Common::reconnect()} methods, which were needed for other
	 * nice functionality.
	 *
	 * As a result we use {@link PDB_Common::__call()} to implement the basic
	 * decorator pattern. Everything listed below should work without issues.
	 *
	 * @param string $function Name of function to run
	 * @param array  $args     Function's arguments
	 *
	 * @method bool beginTransaction()
	 * @method bool commit()
	 * @method string errorCode()
	 * @method array errorInfo()
	 * @method int exec(string $statement)
	 * @method mixed getAttribute(int $attribute)
	 * @method string lastInsertId([string $name])
	 * @method PDOStatement prepare(string $statement [, array $driver_options])
	 * @method string quote(string $string [, int $parameter_type])
	 * @method bool rollBack()
	 * @return mixed
	 */
	public function __call($function, array $args = array()) {
		static $whitelist;
		if (!isset($whitelist)) {
			$rc = new ReflectionClass('PDO');
			foreach ($rc->getMethods() as $method) {
				if ($method->isPublic()) {
					$whitelist[] = $method->getName();
				}
			}
		}
		if (in_array($function, $whitelist)) {
			return call_user_func_array(array($this->getPDO(), $function), $args);
		}
		return parent::__call($function, $args);
	}
	/**
	 * Query the database
	 *
	 * <code>
	 * <?php
	 *
	 * require_once 'PDB.php';
	 *
	 * $db = PDB::connect('mysql:host=127.0.0.1;dbname=foo', 'user', 'pass');
	 * $db->setFetchMode(PDO::FETCH_OBJECT);
	 *
	 * $sql = 'SELECT *
	 *         FROM items
	 *         WHERE promoted = ? AND
	 *               userid = ?';
	 *
	 * $result = $db->query($sql, array(1, (int)$_GET['userid']));
	 *
	 * // Notice that {@link PDB_Result} supports object iteration just like
	 * // PDOStatement does since it extends from it.
	 * foreach ($result as $row) {
	 *     echo '<a href="' . $row->url . '">' . $row->title . '</a>' . "\n";
	 * }
	 *
	 * ?>
	 * </code>
	 *
	 * @param string $sql  The query
	 * @param array  $args The query arguments
	 *
	 * @return object Instance of {@link PDB_Result}
	 * @throws {@link PDB_Exception} on failure
	 * @link http://us3.php.net/manual/en/class.pdostatement.php
	 * @link http://us3.php.net/manual/en/pdostatement.bindparam.php
	 */
	public function query($sql, array $args = array()) {
		try {
			$stmt = $this->prepare($sql, array(
				PDO::ATTR_STATEMENT_CLASS => array(
					'PDB_Result', array($this->getPDO(), $this->fetchMode)
				)
					));
			if (is_array($args)) {
				$cnt = count($args);
				if ($cnt > 0) {
					foreach ($args as $key => $value) {
						$param = (is_int($key) ? ($key + 1) : $key);
						$result = $stmt->bindParam($param, $args[$key]);
					}
				}
			}
			$stmt->execute();
			return $stmt;
		} catch (PDOException $error) {
			throw new PDB_Exception($error->getMessage(),
					(int) $error->getCode());
		}
	}
	/**
	 * Fetch a single row
	 *
	 * <code>
	 * <?php
	 *
	 * require_once 'PDB.php';
	 *
	 * $db = PDB::connect('mysql:host=127.0.0.1;dbname=foo', 'user', 'pass');
	 * $db->setFetchMode(PDO::FETCH_OBJECT);
	 *
	 * $sql = 'SELECT *
	 *         FROM users
	 *         WHERE userid = ?';
	 *
	 * $user = $db->getRow($sql, array((int)$_GET['userid']));
	 * echo 'Welcome back, ' . $user->username . '!';
	 *
	 * ?>
	 * </code>
	 *
	 * @param string  $sql       The query to run
	 * @param array   $params    The query parameter values
	 * @param integer $fetchMode The fetch mode for query
	 *
	 * @see PDB_Common::query(), PDB_Result
	 * @return array
	 */
	public function getRow($sql, array $params = array(), $fetchMode = null) {
		if (is_null($fetchMode)) {
			$fetchMode = $this->fetchMode;
		}
		$result = $this->query($sql, $params);
		$res = $result->fetchRow($fetchMode);
		$result->closeCursor();
		return $res;
	}
	/**
	 * Fetch a single column
	 *
	 * <code>
	 * <?php
	 *
	 * require_once 'PDB.php';
	 *
	 * $db  = PDB::connect('mysql:host=127.0.0.1;dbname=foo', 'user', 'pass');
	 * $sql = 'SELECT friendid
	 *         FROM friends
	 *         WHERE userid = ?';
	 *
	 * $friends = $db->getCol($sql, 0, array((int)$_GET['userid']));
	 * if (in_array($_SESSION['userid'], $friends)) {
	 *    echo 'You are friends with this user!';
	 * }
	 *
	 * ?>
	 * </code>
	 *
	 * @param string  $sql    The query to run
	 * @param integer $col    The column number to fetch (zero-based)
	 * @param array   $params The query parameter values
	 *
	 * @see PDB_Common::query(), PDB_Result
	 * @return array
	 */
	public function getCol($sql, $col = 0, array $params = array()) {
		$result = $this->query($sql, $params);
		$ret = array();
		while ($row = $result->fetchRow(PDO::FETCH_NUM)) {
			$ret[] = $row[$col];
		}
		$result->closeCursor();
		return $ret;
	}
	/**
	 * Fetch all records in query as array
	 *
	 * This method will fetch all records from a given query into a
	 * numerically indexed array (e.g. $result[0] is the first record).
	 *
	 * <code>
	 * <?php
	 *
	 * require_once 'PDB.php';
	 *
	 * $db = PDB::connect('mysql:host=127.0.0.1;dbname=foo', 'user', 'pass');
	 * $db->setFetchMode(PDO::FETCH_OBJECT);
	 *
	 * $sql = 'SELECT *
	 *         FROM users
	 *         WHERE type = ?';
	 *
	 * $students = $db->getAll($sql, array('student'));
	 * foreach ($students as $student) {
	 *     echo $student->firstname . "\n";
	 * }
	 *
	 * ?>
	 * </code>
	 *
	 * @param string  $sql       The query to run
	 * @param array   $params    The query parameter values
	 * @param integer $fetchMode The fetch mode for query
	 *
	 * @return array
	 * @see PDB_Result, PDB_Common::query()
	 */
	public function getAll($sql, array $params = array(), $fetchMode = null) {
		if (is_null($fetchMode)) {
			$fetchMode = $this->fetchMode;
		}
		$result = $this->query($sql, $params);
		$ret = array();
		while ($row = $result->fetchRow($fetchMode)) {
			$ret[] = $row;
		}
		$result->closeCursor();
		return $ret;
	}
	/**
	 * Get a single field
	 *
	 * This will fetch a single value from the first row's first
	 * column.
	 *
	 * <code>
	 * <?php
	 *
	 * require_once 'PDB.php';
	 *
	 * $db  = PDB::connect('mysql:host=127.0.0.1;dbname=foo', 'user', 'pass');
	 * $sql = 'SELECT COUNT(*) AS total
	 *         FROM users
	 *         WHERE type = ?';
	 *
	 * $total = $db->getOne($sql, array('student'));
	 * if (!$total) {
	 *     echo 'No students!';
	 * }
	 *
	 * ?>
	 * </code>
	 *
	 * @param string $sql    The query to run
	 * @param array  $params The query parameter values
	 *
	 * @see PDB_Common::query(), PDB_Result::fetchRow()
	 * @return mixed The value of the first row/column
	 */
	public function getOne($sql, array $params = array()) {
		$result = $this->query($sql, $params);
		$row = $result->fetchRow(PDO::FETCH_NUM);
		$result->closeCursor();
		return $row[0];
	}
	/**
	 * Set the fetch mode for all queries
	 *
	 * This should be set to one of PDO's fetch modes. Valid values include:
	 *  - PDO::FETCH_LAZY
	 *  - PDO::FETCH_ASSOC
	 *  - PDO::FETCH_NAMED
	 *  - PDO::FETCH_NUM
	 *  - PDO::FETCH_BOTH
	 *  - PDO::FETCH_OBJ
	 *
	 * @param integer $mode The DB fetch mode
	 *
	 * @throws UnexpectedArgumentException on invalid modes
	 * @access public
	 * @return void
	 */
	public function setFetchMode($mode) {
		switch ($mode) {
			case PDO::FETCH_LAZY:
			case PDO::FETCH_ASSOC:
			case PDO::FETCH_NAMED:
			case PDO::FETCH_NUM:
			case PDO::FETCH_BOTH:
			case PDO::FETCH_OBJ:
				$this->fetchMode = $mode;
				break;
			default:
				throw new InvalidArgumentException('Invalid mode');
		}
	}
	/**
	 * Set an attribute
	 *
	 * @param integer $attribute The attribute to set
	 * @param mixed   $value     The attribute's value
	 *
	 * @link http://us.php.net/manual/en/pdo.setattribute.php
	 * @return true False if something failed to set
	 */
	public function setAttribute($attribute, $value) {
		if ($attribute & PDB::PDB_ATTRS) {
			$this->options[$attribute] = $value;
			return true;
		}
		if ($this->getPDO()->setAttribute($attribute, $value)) {
			$this->options[$attribute] = $value;
			return true;
		}
		return false;
	}
	/**
	 * Get an attribute
	 *
	 * @param int $attr Attribute to get
	 *
	 * @return mixed Attribute value
	 */
	public function getAttribute($attr) {
		if ($attr & PDB::PDB_ATTRS) {
			return isset($this->options[$attr]) ? $this->options[$attr] : null;
		}
		return $this->getPDO()->getAttribute($attr);
	}
}
