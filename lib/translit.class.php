<?php
/**
 * shimansky.biz
 *
 * Static web site core scripts
 * @package shimansky.biz
 * @author Serguei Shimansky <serguei@shimansky.biz>
 * @copyright Serguei Shimansky 10:07 24.06.2012
 * @access public
 * @version 0.2
 * @link https://bitbucket.org/englishextra/shimansky.biz
 * @link https://github.com/englishextra/shimansky.biz.git
 * @link https://gist.github.com/2981888
 * @link http://pastebin.com/y2Gs4bzE
 */
/**
 * Translit PHP class by Avram, avramyu@gmail.com
 * Dedicated to my early died brother Filip
 * Credit is due
 */
class Translit {
	var $html_aware = false;
	var $case_sensitive = false;
	//var $cirilica = array("љ", "њ", "е", "р", "т", "з", "у", "и", "о", "п", "ш", "ђ", "ж", "а", "с", "д", "ф", "г", "х", "ј", "к", "л", "ч", "ћ", "џ", "ц", "в", "б", "н", "м", "Љ", "Њ", "Е", "Р", "Т", "З", "У", "И", "О", "П", "Ш", "Ђ", "Ж", "А", "С", "Д", "Ф", "Г", "Х", "Ј", "К", "Л", "Ч", "Ћ", "Џ", "Ц", "В", "Б", "Н", "М");
	//var $latinica = array("lj", "nj", "e", "r", "t", "z", "u", "i", "o", "p", "š", "đ", "ž", "a", "s", "d", "f", "g", "h", "j", "k", "l", "č", "ć", "dž", "c", "v", "b", "n", "m", "Lj", "Nj", "E", "R", "T", "Z", "U", "I", "O", "P", "Š", "Đ", "Ž", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Č", "Đ", "DŽ", "C", "V", "B", "N", "M");
	var $cirilica = array(
		"Щ", "Ш", "Ч", "Ц", "Ю", "Я", "Ж", "А", "Б", "В", "Г", "Д", "Е", "Ё", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ь", "Ы", "Ъ", "Э", "Є", "Ї",
		"щ", "ш", "ч", "ц", "ю", "я", "ж", "а", "б", "в", "г", "д", "е", "е", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ь", "ы", "ъ", "э", "є", "ї",
		"љ", "њ", "е", "р", "т", "з", "у", "и", "о", "п", "ш", "ђ", "ж", "а", "с", "д", "ф", "г", "х", "ј", "к", "л", "ч", "ћ", "џ", "ц", "в", "б", "н", "м", "Љ", "Њ", "Е", "Р", "Т", "З", "У", "И", "О", "П", "Ш", "Ђ", "Ж", "А", "С", "Д", "Ф", "Г", "Х", "Ј", "К", "Л", "Ч", "Ћ", "Џ", "Ц", "В", "Б", "Н", "М");
	var $latinica = array(
		"Shh", "Sh", "Ch", "C", "Ju", "Ja", "Zh", "A", "B", "V", "G", "D", "Je", "Jo", "Z", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "F", "Kh", "'", "Y", "'", "E", "Je", "Ji",
		"shh", "sh", "ch", "c", "ju", "ja", "zh", "a", "b", "v", "g", "d", "je", "jo", "z", "i", "j", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "f", "kh", "'", "y", "'", "e", "je", "ji",
		"lj", "nj", "e", "r", "t", "z", "u", "i", "o", "p", "š", "đ", "ž", "a", "s", "d", "f", "g", "h", "j", "k", "l", "č", "ć", "dž", "c", "v", "b", "n", "m", "Lj", "Nj", "E", "R", "T", "Z", "U", "I", "O", "P", "Š", "Đ", "Ž", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Č", "Đ", "DŽ", "C", "V", "B", "N", "M");
	function tagsafe_replace($search, $replace, $subject, $casesensitive = false) {
		$subject = '>' . $subject . '<';
		$search = preg_quote($search);
		$cs = !$casesensitive ? 'i' : '';
		preg_match_all('/>[^<]*(' . $search . ')[^<]*</i', $subject, $matches, PREG_PATTERN_ORDER);
		foreach ($matches[0] as $match) {
			$tmp = preg_replace("/($search)/", $replace, $match);
			$subject = str_replace($match, $tmp, $subject);
		}
		return substr($subject, 1, -1);
	}
	function Transliterate($cyrilic) {
		if ($this->html_aware) {
			for ($i = 0; $i < count($this->cirilica); $i++) {
				$cyrilic = $this->tagsafe_replace($this->cirilica[$i], $this->latinica[$i], $cyrilic, $this->case_sensitive);
			}
			return $cyrilic;
		} else {
			return str_replace($this->cirilica, $this->latinica, $cyrilic);
		}
	}
	/* function fix_filename_str($s) {
	  //old code
	  //remove tags
	  $s = stripslashes($s);
	  $s = preg_replace("'<script[^>]*?>.*?</script>'si", ' ', $s);
	  $s = preg_replace("'<[\/\!]*?[^<>]*?>'si", ' ', $s);
	  // ord space
	  $s = trim(preg_replace("/[\ ]+/", " ", $s));
	  //remove ents
	  $s = preg_replace("/(\&)([A-Za-z0-9\#]+)(\;)/ei", "''", $s);
	  //Transliterate
	  $s = $this->Transliterate($s);
	  //remove symbols
	  $s = str_replace(array("…","–","'","`",",","!","-","(",")","/",".","?",":"," "),array("","-","_","_","","","_","","","","_","","","_"), $s);
	  //ord underscore
	  $s = trim(preg_replace("/[\_]+/", "_", $s));
	  //mb strtolower
	  $s = mb_strtolower($s, mb_detect_encoding($s, 'UTF-8'));
	  return $s;
	  } */
}
/* if (!isset($Translit) || empty($Translit)) {
	$Translit = new Translit();
}
$p = $Translit->Transliterate($p); */
