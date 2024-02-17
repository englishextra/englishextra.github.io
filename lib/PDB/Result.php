<?php
/**
 * Result/Statement class for {@link PDB}
 *
 * PHP version 5.2+
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
 * Result/Statement class for PDB
 *
 * @category   DB
 * @package    PDB
 * @author     Joe Stump <joe@joestump.net>
 * @copyright  1997-2007 The PHP Group
 * @license    http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version    Release: @package_version@
 * @link       http://pear.php.net/package/PDB
 */
class PDB_Result extends PDOStatement {
	/**
	 * Instance of PDO
	 *
	 * @access protected
	 * @var object $pdo Instance of PDO
	 */
	protected $pdo = null;
	/**
	 * Default fetch mode
	 *
	 * @access protected
	 * @var integer $fetchMode The PDO fetch mode
	 */
	protected $fetchMode = PDO::FETCH_NUM;
	/**
	 * Constructor
	 *
	 * @param object $pdo Instance of PDO
	 *
	 * @access protected
	 * @see PDB_Result::$pdo
	 */
	protected function __construct(PDO $pdo, $fetchMode) {
		$this->pdo = $pdo;
		$this->fetchMode = $fetchMode;
	}
	/**
	 * Fetch a single row from the result set
	 *
	 * @param integer $fetchMode A valid PDO fetch mode
	 *
	 * @access public
	 * @return mixed
	 * @link http://us2.php.net/manual/en/pdo.constants.php
	 */
	public function fetchRow($fetchMode = null) {
		if (is_null($fetchMode)) {
			$fetchMode = $this->fetchMode;
		}
		$res = $this->fetch($fetchMode);
		return $res;
	}
	/**
	 * Fetch a row from result set into $arr
	 *
	 * @param array   $arr       Reference to fetch record into
	 * @param integer $fetchMode A valid PDO fetch mode
	 *
	 * @access public
	 * @return vaoid
	 * @link http://us2.php.net/manual/en/pdo.constants.php
	 */
	public function fetchInto(&$arr, $fetchMode = null) {
		if (is_null($fetchMode)) {
			$fetchMode = $this->fetchMode;
		}
		$arr = $this->fetch($fetchMode);
		if (!$arr) {
			return $arr;
		}
		return true;
	}
}
