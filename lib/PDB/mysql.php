<?php
/**
 * PDB_mysql driver for {@link PDB}
 *
 * PHP version 5.2+
 *
 * Copyright (c) 2007, 2009, Digg, Inc.
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
require_once 'Common.php';
/**
 * PDB_mysql driver for PDB
 *
 * @category   DB
 * @package    PDB
 * @author     Joe Stump <joe@joestump.net>
 * @copyright  2007-2008 (c) Digg.com
 * @license    http://tinyurl.com/42zef New BSD License
 * @version    Release: @package_version@
 * @link       http://pear.php.net/package/PDB
 */
class PDB_mysql extends PDB_Common {
	/**
	 * Query the DB
	 *
	 * We override the {@link PDB_Common::query()} method here because of a
	 * somewhat common error during long DB operations (think cron jobs, etc.)
	 * and attempt to reconnect a few times if the DB has "gone away". All
	 * other errors are returned as expected.
	 *
	 * If the server disappears while we're doing other things this will
	 * automagically reconnect to the DB and continue on without the code
	 * ever knowing the difference.
	 *
	 * @param string $sql  The query
	 * @param array  $args The query arguments
	 *
	 * @return object Instance of {@link PDB_Result}
	 * @throws {@link PDB_Exception} on failure
	 * @see PDB_Common::query()
	 */
	public function query($sql, array $args = array()) {
		$attempts = 0;
		do {
			try {
				return parent::query($sql, $args);
			} catch (PDB_Exception $e) {
				if (strpos($e->getMessage(), '2006 MySQL') !== false &&
						$this->getAttribute(PDB::RECONNECT)) {
					$this->reconnect();
				} else {
					throw $e;
				}
			}
		} while ($attempts++ < 3);
		throw new PDB_Exception('Exhausted retries on query');
	}
}
