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
/**
 * General purpose PHP class to work with strings and files
 *
 * PHP version 5.4+
 *
 * Copyright (c) 2012 Shimansky.biz
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms,with or without
 * modification,are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice,this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice,this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. All advertising materials mentioning features or use of this software
 *    must display the following acknowledgement:
 *    This product includes software developed by the organization.
 * 4. Neither the name of the organizatio> nor the
 *    names of its contributors may be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY COPYRIGHT HOLDER ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES,INCLUDING,BUT NOT LIMITED TO,THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER BE LIABLE FOR ANY
 * DIRECT,INDIRECT,INCIDENTAL,SPECIAL,EXEMPLARY,OR CONSEQUENTIAL DAMAGES
 * (INCLUDING,BUT NOT LIMITED TO,PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE,DATA,OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY,WHETHER IN CONTRACT,STRICT LIABILITY,OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE,EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Methods:
 *
 * 1. is_utf8
 * 2. safe_str
 * 3. get_post
 * 4. ensure_amp
 * 5. ensure_lt_gt
 * 6. ord_space
 * 7. ord_underscore
 * 8. ord_hypher
 * 9. ord_newline
 * 10. remove_tags
 * 11. remove_ents
 * 12. remove_comments
 * 13. has_http
 * 14. is_ip
 * 15. write_file
 * 16. clear_data
 * 17. remove_dir_content
 * 18. remove_bbcoded
 * 19. text_symbs_to_num_ents
 * 20. acc_text_to_num_ents
 * 21. safe_html
 * 22. random_anchor
 *
 * PHP version 5.4+
 *
 * @category PHP
 * @access public
 * @copyright (c) 2012 Shimansky.biz
 * @author Serguei Shimansky <serguei@shimansky.biz>
 * @license http://opensource.org/licenses/bsd-license.php
 * @package shimansky.biz
 * @version 0.1
 * @https://github.com/englishextra/shimansky.biz
 */
class Swamper {
	/**
	 * 	There is a difference between the two: If you write an empty __construct() function,you overwrite any inherited __construct() from a parent class.
	 * 	So if you don't need it and you do not want to overwrite the parent constructor explicitly,don't write it at all.
	 */
	function __construct() {
	}
	public function is_utf8($s) {
		// From http://w3.org/International/questions/qa-forms-utf-8.html
		return preg_match('%^(?:
	    [\x09\x0A\x0D\x20-\x7E] # ASCII
	    | [\xC2-\xDF][\x80-\xBF] # non-overlong 2-byte
	    | \xE0[\xA0-\xBF][\x80-\xBF] # excluding overlongs
	    | [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2} # straight 3-byte
	    | \xED[\x80-\x9F][\x80-\xBF] # excluding surrogates
	    | \xF0[\x90-\xBF][\x80-\xBF]{2} # planes 1-3
	    | [\xF1-\xF3][\x80-\xBF]{3} # planes 4-15
	    | \xF4[\x80-\x8F][\x80-\xBF]{2} # plane 16
	    )*$%xs',$s);
	}
	public function safe_str($s) {
		return str_replace(array("\n","\r","\t","\v","\0","\x0B"),'',preg_replace("/[^\x20-\xFF]/","",trim(@strval($s))));
	}
	public function get_post($s,$v='') {
		if (isset($_GET[$s]) || isset($_POST[$s])) {
			$v=isset($_GET[$s]) ? $_GET[$s] : (isset($_POST[$s]) ? urldecode($_POST[$s]) : '');
			if (is_array($v)) {
				foreach ($v as &$v1) {
					$v1=strtr($v1,array_flip(get_html_translation_table(HTML_ENTITIES)));
					$v1=trim($v1);
					$v1=$this->safe_str($v1);
				}
				unset($v1);
			} else {
				$v=strtr($v,array_flip(get_html_translation_table(HTML_ENTITIES)));
				$v=trim($v);
				$v=$this->safe_str($v);
			}
		}
		return $v;
	}
	public function ensure_amp($s) {
		$s=str_replace('&','&amp;',$s);
		$s=str_replace(array('&amp;amp;','&amp;#'),array('&amp;','&#'),$s);
		$s=preg_replace("/(\&amp\;)([A-Za-z]+)(\;)/","&\\2;",$s);
		$s=preg_replace("/(\&amp\;\#)([0-9]+)(\;)/","&#\\2;",$s);
		return $s;
	}
	public function ensure_lt_gt($s) {
		$s=str_replace('<','&lt;',$s);
		$s=str_replace('>','&gt;',$s);
		$s=str_replace(array('&amp;lt;','&amp;gt;'),array('&lt;','&gt;'),$s);
		return $s;
	}
	public function ord_space($s) {
		return trim(preg_replace("/[\ ]+/"," ",$s));
	}
	public function ord_underscore($s) {
		return trim(preg_replace("/[\_]+/","_",$s));
	}
	public function ord_hypher($s) {
		return trim(preg_replace("/[\-]+/","-",$s));
	}
	public function ord_newline($s) {
		return preg_replace("/[\r]+/s","\r",$s);
		return preg_replace("/[\n]+/s","\n",$s);
	}
	public function remove_tags($s) {
		$s=stripslashes($s);
		$s=preg_replace("'<script[^>]*?>.*?</script>'si",' ',$s);
		$s=preg_replace("'<style[^>]*?>.*?</style>'si",' ',$s);
		$s=preg_replace("'<[\/\!]*?[^<>]*?>'si",' ',$s);
		$s=$this->ord_space($s);
		return $s;
	}
	public function remove_ents($s) {
		$s=preg_replace("'(\&)([A-Za-z0-9\#]+)(\;)'si",' ',$s);
		return $s;
	}
	public function remove_comments($s) {
		$s=preg_replace("'<!--.*?-->'si",' ',$s);
		$s=preg_replace("'\/\*.*?\*\/'si",' ',$s);
		return $s;
	}
	public function has_http($s,$r=false) {
		if (preg_match("/^(http|https|ftp)\:\/\//",$s) &&
				!preg_match("/^\//",$s)) {
			return $r=true;
		}
	}
	public function is_ip($ip) {
		//first of all the format of the ip address is matched
		if (preg_match("/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/",$ip)) {
			//now all the intger values are separated
			$ps=explode(".",$ip);
			//now we need to check each part can range from 0-255
			foreach ($ps as $ips) {
				if (intval($ips) > 255 || intval($ips) < 0) {
					return false; //if number is not within range of 0-255
				}
			}
			return true;
		} else {
			return false; //if format of ip address doesn't matches
		}
	}
	public function write_file($d,$p,$t) {
		if (!$fo=fopen($d,$t)) {
			die('Cannot open file: '.$d);
		}
		if (!is_writable($d)) {
			die('Cannot write file: '.$d);
		}
		flock($fo,LOCK_EX);
		fputs($fo,$p);
		fflush($fo);
		flock($fo,LOCK_UN);
		fclose($fo);
	}
	public function clear_data($d) {
		$this->write_file($d,'',"w+");
	}
	public function remove_dir_content($d='.') {
		if (is_dir($d)) {
			echo '<strong>'.$d.'</strong> is a directory.<br />';
			if ($h=@opendir($d)) {
				while (false !== ($f=readdir($h))) {
					if ($f != "." && $f != "..") {
						echo '<strong>'.$f.'</strong> deleted<br />';
						$fp=$d.'/'.$f;
						if (is_dir($fp)) {
							$this->remove_dir_content($fp);
							@rmdir($fp);
						} else {
							@unlink($fp);
						}
					}
				}
				closedir($h);
			}
		}
	}
	public function remove_bbcoded($s) {
		$a=array(
			'(\[img\])(.*?)(\[\/img\])'=>' ',
			'(\[img\=left\])(.*?)(\[\/img\])'=>' ',
			'(\[img\=right\])(.*?)(\[\/img\])'=>' ',
			'(\[color\=[a-zA-Z0-9\#]+\])(.*?)(\[\/color\])'=>' ',
			'(\[)(.*?)(\])'=>' '
		);
		foreach ($a as $k=>$v) {
			$s=preg_replace("/${k}/",$v,$s);
			$s=$this->ord_space($s);
		}
		return $s;
	}
	public function text_symbs_to_dec_ents($s) {
		/*
		$a[]=null;
		dont include these:
		$a[]=array(' ','&#160;');
		$a[]=array('&','&#38;');
		$a[]=array('#','&#35;');
		$a[]=array(';','&#59;');
		$a[]=array('0','&#48;');
		$a[]=array('1','&#49;');
		$a[]=array('2','&#50;');
		$a[]=array('3','&#51;');
		$a[]=array('4','&#52;');
		$a[]=array('5','&#53;');
		$a[]=array('6','&#54;');
		$a[]=array('7','&#55;');
		$a[]=array('8','&#56;');
		$a[]=array('9','&#57;');
		*/
		$a=null;
		$a=array(
		'¡'=>'&#161;','¢'=>'&#162;','£'=>'&#163;','¤'=>'&#164;','¥'=>'&#165;','¦'=>'&#166;','§'=>'&#167;','¨'=>'&#168;','©'=>'&#169;','ª'=>'&#170;','«'=>'&#171;','¬'=>'&#172;','­'=>'&#173;','®'=>'&#174;','¯'=>'&#175;','°'=>'&#176;','±'=>'&#177;','²'=>'&#178;','³'=>'&#179;','´'=>'&#180;','µ'=>'&#181;','¶'=>'&#182;','·'=>'&#183;','¸'=>'&#184;','¹'=>'&#185;','º'=>'&#186;','»'=>'&#187;','¼'=>'&#188;','½'=>'&#189;','¾'=>'&#190;','¿'=>'&#191;','À'=>'&#192;','Á'=>'&#193;','Â'=>'&#194;','Ã'=>'&#195;','Ä'=>'&#196;','Å'=>'&#197;','Æ'=>'&#198;','Ç'=>'&#199;','È'=>'&#200;','É'=>'&#201;','Ê'=>'&#202;','Ë'=>'&#203;','Ì'=>'&#204;','Í'=>'&#205;','Î'=>'&#206;','Ï'=>'&#207;','Ð'=>'&#208;','Ñ'=>'&#209;','Ò'=>'&#210;','Ó'=>'&#211;','Ô'=>'&#212;','Õ'=>'&#213;','Ö'=>'&#214;','×'=>'&#215;','Ø'=>'&#216;','Ù'=>'&#217;','Ú'=>'&#218;','Û'=>'&#219;','Ü'=>'&#220;','Ý'=>'&#221;','Þ'=>'&#222;','ß'=>'&#223;','à'=>'&#224;','á'=>'&#225;','â'=>'&#226;','ã'=>'&#227;','ä'=>'&#228;','å'=>'&#229;','æ'=>'&#230;','ç'=>'&#231;','è'=>'&#232;','é'=>'&#233;','ê'=>'&#234;','ë'=>'&#235;','ì'=>'&#236;','í'=>'&#237;','î'=>'&#238;','ï'=>'&#239;','ð'=>'&#240;','ñ'=>'&#241;','ò'=>'&#242;','ó'=>'&#243;','ô'=>'&#244;','õ'=>'&#245;','ö'=>'&#246;','÷'=>'&#247;','ø'=>'&#248;','ù'=>'&#249;','ú'=>'&#250;','û'=>'&#251;','ü'=>'&#252;','ý'=>'&#253;','þ'=>'&#254;','ÿ'=>'&#255;','Œ'=>'&#338;','œ'=>'&#339;','Š'=>'&#352;','š'=>'&#353;','Ÿ'=>'&#376;','ƒ'=>'&#402;','ˆ'=>'&#710;','˜'=>'&#732;','Α'=>'&#913;','Β'=>'&#914;','Γ'=>'&#915;','Δ'=>'&#916;','Ε'=>'&#917;','Ζ'=>'&#918;','Η'=>'&#919;','Θ'=>'&#920;','Ι'=>'&#921;','Κ'=>'&#922;','Λ'=>'&#923;','Μ'=>'&#924;','Ν'=>'&#925;','Ξ'=>'&#926;','Ο'=>'&#927;','Π'=>'&#928;','Ρ'=>'&#929;','Σ'=>'&#931;','Τ'=>'&#932;','Υ'=>'&#933;','Φ'=>'&#934;','Χ'=>'&#935;','Ψ'=>'&#936;','Ω'=>'&#937;','α'=>'&#945;','β'=>'&#946;','γ'=>'&#947;','δ'=>'&#948;','ε'=>'&#949;','ζ'=>'&#950;','η'=>'&#951;','θ'=>'&#952;','ι'=>'&#953;','κ'=>'&#954;','λ'=>'&#955;','μ'=>'&#956;','ν'=>'&#957;','ξ'=>'&#958;','ο'=>'&#959;','π'=>'&#960;','ρ'=>'&#961;','ς'=>'&#962;','σ'=>'&#963;','τ'=>'&#964;','υ'=>'&#965;','φ'=>'&#966;','χ'=>'&#967;','ψ'=>'&#968;','ω'=>'&#969;','ϑ'=>'&#977;','ϒ'=>'&#978;','ϖ'=>'&#982;',' '=>'&#8194;',' '=>'&#8195;',' '=>'&#8201;','‌'=>'&#8204;','‍'=>'&#8205;','‎'=>'&#8206;','‏'=>'&#8207;','–'=>'&#8211;','—'=>'&#8212;','‘'=>'&#8216;','’'=>'&#8217;','‚'=>'&#8218;','“'=>'&#8220;','”'=>'&#8221;','„'=>'&#8222;','†'=>'&#8224;','‡'=>'&#8225;','•'=>'&#8226;','…'=>'&#8230;','‰'=>'&#8240;','′'=>'&#8242;','″'=>'&#8243;','‹'=>'&#8249;','›'=>'&#8250;','‾'=>'&#8254;','⁄'=>'&#8260;','€'=>'&#8364;','ℑ'=>'&#8465;','℘'=>'&#8472;','ℜ'=>'&#8476;','™'=>'&#8482;','ℵ'=>'&#8501;','←'=>'&#8592;','↑'=>'&#8593;','→'=>'&#8594;','↓'=>'&#8595;','↔'=>'&#8596;','↵'=>'&#8629;','⇐'=>'&#8656;','⇑'=>'&#8657;','⇒'=>'&#8658;','⇓'=>'&#8659;','⇔'=>'&#8660;','∀'=>'&#8704;','∂'=>'&#8706;','∃'=>'&#8707;','∅'=>'&#8709;','∇'=>'&#8711;','∈'=>'&#8712;','∉'=>'&#8713;','∋'=>'&#8715;','∏'=>'&#8719;','∑'=>'&#8721;','−'=>'&#8722;','∗'=>'&#8727;','√'=>'&#8730;','∝'=>'&#8733;','∞'=>'&#8734;','∠'=>'&#8736;','∧'=>'&#8743;','∨'=>'&#8744;','∩'=>'&#8745;','∪'=>'&#8746;','∫'=>'&#8747;','∴'=>'&#8756;','∼'=>'&#8764;','≅'=>'&#8773;','≈'=>'&#8776;','≠'=>'&#8800;','≡'=>'&#8801;','≤'=>'&#8804;','≥'=>'&#8805;','⊂'=>'&#8834;','⊃'=>'&#8835;','⊄'=>'&#8836;','⊆'=>'&#8838;','⊇'=>'&#8839;','⊕'=>'&#8853;','⊗'=>'&#8855;','⊥'=>'&#8869;','⋅'=>'&#8901;','⌈'=>'&#8968;','⌉'=>'&#8969;','⌊'=>'&#8970;','⌋'=>'&#8971;','◊'=>'&#9674;','♠'=>'&#9824;','♣'=>'&#9827;','♥'=>'&#9829;','♦'=>'&#9830;','〈'=>'&#9001;','〉'=>'&#9002;',
		/* '!'=>'&#33;',*/
		/* '"'=>'&#34;',*/
		/* '$'=>'&#36;',*/
		/* '%'=>'&#37;',*/
		/* '('=>'&#40;',*/
		/* ')'=>'&#41;',*/
		/* '*'=>'&#42;',*/
		/* '+'=>'&#43;',*/
		/* ','=>'&#44;',*/
		/* '-'=>'&#45;',*/
		/* '.'=>'&#46;',*/
		/* '/'=>'&#47;',*/
		/* ':'=>'&#58;',*/
 		/* '<'=>'&#60;',*/
		/* '='=>'&#61;',*/
		/* '>'=>'&#62;',*/
		/* '?'=>'&#63;',*/
		'@'=>'&#64;',
		/* '['=>'&#91;',*/
		/* '\''=>'&#39;',*/
		/* '\\'=>'&#92;',*/
		/* ']'=>'&#93;',*/
		'^'=>'&#94;',
		/* '_'=>'&#95;',*/
		'`'=>'&#96;',
		/* '{'=>'&#123;',*/
		/* '|'=>'&#124;',*/
		/* '}'=>'&#125;',*/
		/* '~'=>'&#126;',*/
		'✁'=>'&#9985;','✂'=>'&#9986;','✃'=>'&#9987;','✄'=>'&#9988;','✆'=>'&#9990;','✇'=>'&#9991;','✈'=>'&#9992;','✉'=>'&#9993;','✌'=>'&#9996;','✍'=>'&#9997;','✎'=>'&#9998;','✏'=>'&#9999;','✐'=>'&#10000;','✑'=>'&#10001;','✒'=>'&#10002;','✓'=>'&#10003;','✔'=>'&#10004;','✕'=>'&#10005;','✖'=>'&#10006;','✗'=>'&#10007;','✘'=>'&#10008;','✙'=>'&#10009;','✚'=>'&#10010;','✛'=>'&#10011;','✜'=>'&#10012;','✝'=>'&#10013;','✞'=>'&#10014;','✟'=>'&#10015;','✠'=>'&#10016;','✡'=>'&#10017;','✢'=>'&#10018;','✣'=>'&#10019;','✤'=>'&#10020;','✥'=>'&#10021;','✦'=>'&#10022;','✧'=>'&#10023;','✩'=>'&#10025;','✪'=>'&#10026;','✫'=>'&#10027;','✬'=>'&#10028;','✭'=>'&#10029;','✮'=>'&#10030;','✯'=>'&#10031;','✰'=>'&#10032;','✱'=>'&#10033;','✲'=>'&#10034;','✳'=>'&#10035;','✴'=>'&#10036;','✵'=>'&#10037;','✶'=>'&#10038;','✷'=>'&#10039;','✸'=>'&#10040;','✹'=>'&#10041;','✺'=>'&#10042;','✻'=>'&#10043;','✼'=>'&#10044;','✽'=>'&#10045;','✾'=>'&#10046;','✿'=>'&#10047;','❀'=>'&#10048;','❁'=>'&#10049;','❂'=>'&#10050;','❃'=>'&#10051;','❄'=>'&#10052;','❅'=>'&#10053;','❆'=>'&#10054;','❇'=>'&#10055;','❈'=>'&#10056;','❉'=>'&#10057;','❊'=>'&#10058;','❋'=>'&#10059;','❍'=>'&#10061;','❏'=>'&#10063;','❐'=>'&#10064;','❑'=>'&#10065;','❒'=>'&#10066;','❖'=>'&#10070;','❘'=>'&#10072;','❙'=>'&#10073;','❚'=>'&#10074;','❛'=>'&#10075;','❜'=>'&#10076;','❝'=>'&#10077;','❞'=>'&#10078;','❡'=>'&#10081;','❢'=>'&#10082;','❣'=>'&#10083;','❤'=>'&#10084;','❥'=>'&#10085;','❦'=>'&#10086;','❧'=>'&#10087;','❶'=>'&#10102;','❷'=>'&#10103;','❸'=>'&#10104;','❹'=>'&#10105;','❺'=>'&#10106;','❻'=>'&#10107;','❼'=>'&#10108;','❽'=>'&#10109;','❾'=>'&#10110;','❿'=>'&#10111;','➀'=>'&#10112;','➁'=>'&#10113;','➂'=>'&#10114;','➃'=>'&#10115;','➄'=>'&#10116;','➅'=>'&#10117;','➆'=>'&#10118;','➇'=>'&#10119;','➈'=>'&#10120;','➉'=>'&#10121;','➊'=>'&#10122;','➋'=>'&#10123;','➌'=>'&#10124;','➍'=>'&#10125;','➎'=>'&#10126;','➏'=>'&#10127;','➐'=>'&#10128;','➑'=>'&#10129;','➒'=>'&#10130;','➓'=>'&#10131;','➔'=>'&#10132;','➘'=>'&#10136;','➙'=>'&#10137;','➚'=>'&#10138;','➛'=>'&#10139;','➜'=>'&#10140;','➝'=>'&#10141;','➞'=>'&#10142;','➟'=>'&#10143;','➠'=>'&#10144;','➡'=>'&#10145;','➢'=>'&#10146;','➣'=>'&#10147;','➤'=>'&#10148;','➥'=>'&#10149;','➦'=>'&#10150;','➧'=>'&#10151;','➨'=>'&#10152;','➩'=>'&#10153;','➪'=>'&#10154;','➫'=>'&#10155;','➬'=>'&#10156;','➭'=>'&#10157;','➮'=>'&#10158;','➯'=>'&#10159;','➱'=>'&#10161;','➲'=>'&#10162;','➳'=>'&#10163;','➴'=>'&#10164;','➵'=>'&#10165;','➶'=>'&#10166;','➷'=>'&#10167;','➸'=>'&#10168;','➹'=>'&#10169;','➺'=>'&#10170;','➻'=>'&#10171;','➼'=>'&#10172;','➽'=>'&#10173;','➾'=>'&#10174;');
		foreach($a as $k=>$v) {
			$s=str_replace($k,$v,$s);
		}
		return $s;
	}
	public function acc_text_to_dec_ents($s) {
		$a=null;
		$a=array('Á'=>'&#193;','Â'=>'&#194;','Æ'=>'&#198;','À'=>'&#192;','Å'=>'&#197;','Ã'=>'&#195;','Ä'=>'&#196;','Ç'=>'&#199;','É'=>'&#201;','Ê'=>'&#202;','È'=>'&#200;','Ð'=>'&#208;','Ë'=>'&#203;','ƒ'=>'&#402;','Í'=>'&#205;','Î'=>'&#206;','Ì'=>'&#204;','Ï'=>'&#207;','Ñ'=>'&#209;','Ó'=>'&#211;','Ô'=>'&#212;','Œ'=>'&#338;','Ò'=>'&#210;','Ø'=>'&#216;','Õ'=>'&#213;','Ö'=>'&#214;','Š'=>'&#352;','ß'=>'&#223;','Þ'=>'&#222;','Ú'=>'&#218;','Û'=>'&#219;','Ù'=>'&#217;','ü'=>'&#252;','Ý'=>'&#221;','Ÿ'=>'&#376;','á'=>'&#225;','â'=>'&#226;','æ'=>'&#230;','à'=>'&#224;','å'=>'&#229;','ã'=>'&#227;','ä'=>'&#228;','ç'=>'&#231;','é'=>'&#233;','ê'=>'&#234;','è'=>'&#232;','ð'=>'&#240;','ë'=>'&#235;','ƒ'=>'&#402;','í'=>'&#237;','î'=>'&#238;','ì'=>'&#236;','ï'=>'&#239;','ñ'=>'&#241;','ó'=>'&#243;','ô'=>'&#244;','œ'=>'&#339;','ò'=>'&#242;','ø'=>'&#248;','õ'=>'&#245;','ö'=>'&#246;','š'=>'&#353;','ß'=>'&#223;','þ'=>'&#254;','ú'=>'&#250;','û'=>'&#251;','ù'=>'&#249;','Ü'=>'&#220;','ý'=>'&#253;','ÿ'=>'&#255;');
		foreach($a as $k=>$v) {
			$s=str_replace($k,$v,$s);
		}
		return $s;
	}
	public function safe_html($s,$l='') {
		$s=$this->safe_str($s);
		$s=$this->remove_comments($s);
		$s=$this->remove_tags($s);
		$s=$this->ensure_lt_gt($s);
		if (!empty($l) && (mb_strlen($s,mb_detect_encoding($s)) > $l)) {
			$s=html_entity_decode($s,ENT_QUOTES,'UTF-8');
			$s=mb_substr($s,0,($l - 5),mb_detect_encoding($s)).' [&#8230;]';
		}
		$s = str_replace(array(
"‘",
"‚",
"„",
"“",
"”",
"€",
"@",
"№",
"«",
"»",
"-",
"–",
"—",
"’",
"'",
"…"
), array(
"&#8216;",
"&#8218;",
"&#8222;",
"&#8220;",
"&#8221;",
"&#8364;",
"&#64;",
"&#8470;",
"&#171;",
"&#187;",
"&#8211;",
"&#8211;",
"&#8212;",
"&#39;",
"&#39;",
"&#8230;"
), $s);
		$s=$this->text_symbs_to_dec_ents($s);
		$s=$this->acc_text_to_dec_ents($s);
		$s=$this->ord_space($s);
		$s=$this->ord_newline($s);
		$s=$this->ensure_amp($s);
		return $s;
	}
	public function random_anchor() {
		$r=range(0,9);
		shuffle($r);
		$ds='';
		foreach ($r as $d) {
			$ds .= $d;
		}
		return $ds;
	}
}
/* if (!isset($Swamper) || empty($Swamper)) {
	$Swamper=new Swamper();
} */
