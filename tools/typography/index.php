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
ob_start();
$a_inc = array(
	'lib/swamper.class.php',
	'lib/entities.class.php',
	'inc/regional.inc'/* ,
	'inc/adminauth.inc' */
);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
/**
 * https://github.com/dryabov/rustypo/blob/master/16/rustypo.php
 */
define('TAGBEGIN', "\x01");
define('TAGEND', "\x02");
define('NOBRSPACE', "\x03");
define('NOBRHYPHEN', "\x04");
define('THINSP', "\x05");
define('DASH', "\x06");
define('NUMDASH', "\x07");
class Typography {
	function __construct() {
	}
	public function safe_str($s) {
		return str_replace(array("\n", "\r", "\t", "\v", "\0", "\x0B"), '', preg_replace("/[^\x20-\xFF]/", "", trim(@strval($s))));
	}
	public function proof($s) {
		$htmlents = array(
			'&#8222;'=>'„','&#8220;'=>'“','&#8221;'=>'”','&#8216;'=>'‘','&#8217;'=>'’',
			'&laquo;'=>'«','&raquo;'=>'»','&hellip;'=>'…','&euro;'=>'€','&permil;'=>'‰',
			'&bull;'=>'•','&middot;'=>'·','&ndash;'=>'–','&mdash;'=>'—','&nbsp;'=>' ',
			'&trade;'=>'™','&copy;'=>'©','&reg;'=>'®','&sect;'=>'§','&#8470;'=>'№',
			'&plusmn;'=>'±','&deg;'=>'°');
		$s = strtr( $s, $htmlents ); // Делаем замены html entity на соответствующие символы
		// РАБОТА С ТЕГАМИ. ЧАСТЬ 1
		$s = preg_replace( '/(?> | )+(?=$|<br|<\/p)/u', '', $s ); // Убираем лишние пробелы перед концом строки
		$s = preg_replace( '/<a +href([^>]*)> *(?:"|&quot;)([^<"]*)(?:"|&quot;) *<\/a>/u', '"<a href\\1>\\2</a>"', $s ); // Выносим кавычки из ссылок
		$s = preg_replace( '/([а-яА-Яa-zA-Z]) ([а-яА-Яa-zA-Z]{1,5}(?>[.!?…]*))(?=$|<\/p>|<\/div>|<br>|<br \/>)/u','\\1'.NOBRSPACE.'\\2', $s); // Последнее короткое слово в абзаце привязывать к предыдущему
		// ПРЯМАЯ РЕЧЬ
		$s = preg_replace( '/(^|<p>|<br>|<br \/>)[  ]?- /u','\\1— ', $s ); // Прямая речь - дефис в начале строки и после тегов <p>, <br> и <br />
		// УГЛЫ (ГРАДУСЫ, МИНУТЫ И СЕКУНДЫ)
		$s = preg_replace( '/((?>\d{1,3})) ?° ?((?>\d{1,2})) ?\' ?((?>\d{1,2})) ?"/u','\\1° \\2&prime; \\3&Prime;', $s ); // 10° 11' 12"
		$s = preg_replace( '/((?>\d{1,3})) ?° ?((?>\d{1,2})) ?\'/u','\\1° \\2&prime;', $s ); // 10° 11'
		$s = preg_replace( '/((?>\d{1,3})) °(?![^CcСсF])/u','\\1°', $s ); // 10°, но не 10 °C
		$s = preg_replace( '/((?>\d{1,2})) ?\' ?((?>\d{1,2})) ?"/u','\\1&prime; \\2&Prime;', $s ); // 11' 12"
		$s = preg_replace( '/((?>\d{1,2})) \'/u','\\1&prime;', $s ); // 11'
		// РАССТАВЛЯЕМ КАВЫЧКИ
		/* can break the code */
		//$s = preg_replace( '/(['.TAGEND.'\(  ]|^)"([^"]*)([^  "\(])"/u', '\\1«\\2\\3»', $s ); // Расстановка кавычек-"елочек"
		/*if( stristr( $s, '"' ) ) // Если есть вложенные кавычки
		{
		$s = preg_replace( '/(['.TAGEND.'(  ]|^)"([^"]*)([^  "(])"/u', '\\1«\\2\\3»', $s );
		while( preg_match( '/«[^»]*«[^»]*»/u', $s ) ) {
			$s = preg_replace( '/«([^»]*)«([^»]*)»/u', '«\\1„\\2“', $s );
			}
		}*/
		// ДЕЛАЕМ ЗАМЕНЫ
		// $s = str_replace( '• ','•'.NOBRSPACE, $s ); // Пункт (для списков)
		// Тире
		$s = str_replace( ' - ',NOBRSPACE.DASH.' ', $s );
		$s = preg_replace( '/ - /u',NOBRSPACE.DASH.' ', $s );
		$s = str_replace( '...','…', $s ); // Многоточие
		$s = str_replace( '+/-','±', $s ); // плюс-минус
		$s = str_replace( '(r)','<sup>®</sup>', $s );
		$s = str_replace( '(R)','<sup>®</sup>', $s ); // registered
		$s = preg_replace( '/\((c|C|с|С)\)/u','©', $s );
		$s = preg_replace( '/© /u','©'.NOBRSPACE, $s ); // copyright
		// trademark
		$s = str_replace( '(tm)','™', $s );
		$s = str_replace( '(TM)','™', $s );
		$s = str_replace( '&lt;=','&le;', $s ); // Меньше/равно
		$s = str_replace( '&gt;=','&ge;', $s ); // Больше/равно
		// ДРОБИ
		$s = preg_replace( '/(^|[  ("«„])1\/2(?=$|[  )"»“.,!?:;…])/u','\\1½', $s);
		$s = preg_replace( '/(^|[  ("«„])1\/4(?=$|[  )"»“.,!?:;…])/u','\\1¼', $s);
		$s = preg_replace( '/(^|[  ("«„])3\/4(?=$|[  )"»“.,!?:;…])/u','\\1¾', $s);
		$s = preg_replace( '/(^|[  ("«„])1\/3(?=$|[  )"»“.,!?:;…])/u','\\1⅓', $s);
		$s = preg_replace( '/(^|[  ("«„])2\/3(?=$|[  )"»“.,!?:;…])/u','\\1⅔', $s);
		$s = preg_replace( '/(^|[  ("«„])1\/8(?=$|[  )"»“.,!?:;…])/u','\\1⅛', $s);
		$s = preg_replace( '/(^|[  ("«„])3\/8(?=$|[  )"»“.,!?:;…])/u','\\1⅜', $s);
		$s = preg_replace( '/(^|[  ("«„])5\/8(?=$|[  )"»“.,!?:;…])/u','\\1⅝', $s);
		$s = preg_replace( '/(^|[  ("«„])7\/8(?=$|[  )"»“.,!?:;…])/u','\\1⅞', $s);
		// ИНИЦИАЛЫ И ФАМИЛИИ
		$s = preg_replace( '/(?<=[^а-яА-ЯёЁa-zA-Z][А-ЯЁA-Z]\.|^[А-ЯЁA-Z]\.) ?([А-ЯЁA-Z]\.) ?(?=[А-ЯЁA-Z][а-яА-ЯёЁa-zA-Z])/u', THINSP.'\\1'.NOBRSPACE, $s ); // Инициалы + фамилия
		$s = preg_replace( '/((?>[А-ЯЁA-Z][а-яА-ЯёЁa-zA-Z]+)) ([А-ЯЁA-Z]\.) ?(?=[А-ЯЁA-Z]\.)/u', '\\1'.NOBRSPACE.'\\2'.THINSP, $s ); // Фамилия + инициалы
		$s = preg_replace( '/(?<=[^а-яА-ЯёЁa-zA-Z][А-ЯЁA-Z]\.|^[А-ЯЁA-Z]\.) ?(?=[А-ЯЁA-Z][а-яА-ЯёЁa-zA-Z])/u', NOBRSPACE, $s ); // Инициал + фамилия
		$s = preg_replace( '/((?>[А-ЯЁA-Z][а-яА-ЯёЁa-zA-Z]+)) (?=[А-ЯЁA-Z]\.)/u', '\\1'.NOBRSPACE, $s ); // Фамилия + инициал
		// СОКРАЩЕНИЯ
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z]|^)(г\.|ул\.|пер\.|пл\.|пос\.|р\.|проф\.|доц\.|акад\.|гр\.) ?(?=[А-ЯЁ])/u', '\\1\\2'.NOBRSPACE, $s ); // Сокращения
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z]|^)(с\.|стр\.|рис\.|гл\.|илл\.|табл\.|кв\.|дом|д.\|офис|оф\.|ауд\.) ?(?=\d)/u', '\\1\\2'.NOBRSPACE, $s ); // Сокращения
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z]|^)(см\.|им\.|каф\.) ?(?=[а-яА-ЯёЁa-zA-Z\d])/u', '\\1\\2'.NOBRSPACE, $s ); // Сокращения
		// ЕДИНИЦЫ ИЗМЕРЕНИЯ
		$s = preg_replace( '/([а-яёa-z\d\.]) (?=экз\.|тыс\.|млн\.|млрд\.|руб\.|коп\.|у\.е\.|\$|€)/u', '\\1'.NOBRSPACE, $s ); // Единицы измерения
		$s = preg_replace( '/([а-яёa-z\d\.]) (?=евро([ \.,!\?:;]|$))/u', '\\1'.NOBRSPACE, $s ); // Евро
		// ПРИВЯЗЫВАЕМ КОРОТКИЕ СЛОВА
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z0-9])(я|ты|мы|вы|он|не|ни|на|но|в|во|до|от|и|а|с|со|о|об|по|ну|к|ко|за|их|из|ее|её|ей|ой|ай|у) (?=[а-яА-ЯёЁa-zA-Z]{3})/u', '\\1\\2'.NOBRSPACE, $s ); // Короткие слова прикрепляем к следующим (если те сами не короткие)
		$s = preg_replace( '/([а-яА-ЯёЁ]) (?=(же|ж|ли|ль|бы|б|ка|то)([\.,!\?:;])?( |$))/u', '\\1'.NOBRSPACE, $s ); // Частицы
		$s = preg_replace( '/([.!?…] [А-ЯЁA-Z][а-яА-ЯёЁa-zA-Z]{0,3}) /u', '\\1'.NOBRSPACE, $s ); // Слова от 1 до 3 букв в начале предложения
		// И Т.Д., И Т.П., Т.К., ...
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z]и) (д|п)(?=р\.)/u', '\\1'.NOBRSPACE.'\\2', $s ); // и др., и пр.
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z]и) т\. ?(?=(д|п)\.)/u', '\\1'.NOBRSPACE.'т.'.THINSP, $s ); // и т.д., и т.п.
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z]в) т\. ?(?=ч\.)/u', '\\1'.NOBRSPACE.'т.'.THINSP, $s ); // в т.ч.
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z]т\.) ?(?=(к|н|е)\.)/u', '\\1'.THINSP, $s ); // т.к., т.н., т.е.
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z](?=к|д)\.) ?(ф\.-м|х|б|т|ф|п)\. ?(?=н\.)/u', '\\1'.THINSP.'\\2.'.THINSP, $s ); // к.т.н., д.ф.-м.н., ...
		// ИСПРАВЛЕНИЕ ГРАММАТИЧЕСКИХ ОШИБОК
		$s = preg_replace( '/\( *([^)]+?) *\)/u', '(\\1)', $s ); // удаляем пробелы после открывающей скобки и перед закрыващей скобкой
		$s = preg_replace( '/([а-яА-ЯёЁa-zA-Z.,!?:;…])\(/u', '\\1 (', $s ); // добавляем пробел между словом и открывающей скобкой, если его нет (отключите, если у Вас на сайте есть формулы)
		$s = preg_replace( '/([а-яА-ЯёЁa-zA-Z]),(?=\d)/u','\\1, ', $s); // Делает проверку в расстановке запятых и меняет слово,число на слово, число (ул. Дружбы, 46)
		// Тире от запятой и точки не отбивается
		$s = str_replace( ','.NOBRSPACE.DASH.' ',','.DASH.' ', $s );
		$s = str_replace( '.'.NOBRSPACE.DASH.' ','.'.DASH.' ', $s );
		$s = str_replace( '!?','?!', $s ); // Правильно в таком порядке
		$s = preg_replace( '/(!|\?)(?:…|\.\.\.)/u','\\1..', $s ); // Убираем лишние точки
		//TODO: Обработка .NET
		$s = preg_replace( '/ (?=[.,!?:;])/u','', $s ); // Убираем пробелы перед знаками препинания
		$s = preg_replace( '/(№|§) ?(?=\d)/u', '\\1 ', $s ); // пробел между знаком "№" или "§" и числом.
		$s = preg_replace( '/№ №/u', '№№', $s ); // слитное написание "№№"
		$s = preg_replace( '/§ §/u', '§§', $s ); // слитное написание "§§"
		//TODO: Выносим знаки препинания (.,:;) вне кавычек, а (!?…) в кавычки
		/* can break the code */
		// ВСЁ О ЧИСЛАХ
		//$s = preg_replace( '/(\d) *(?:\*|х|x|X|Х) *(?=\d)/u', '\\1&times;', $s ); // обрабатываем размерные конструкции (200x500)
		// Делает неразрывными номера телефонов
		$s = preg_replace( '/(\+7|8) ?(\(\d+\)) ?(\d+)-(\d{2})-(?=\d{2})/u','\\1'.NOBRSPACE.'\\2'.NOBRSPACE.'\\3'.NOBRHYPHEN.'\\4'.NOBRHYPHEN, $s );
		$s = preg_replace( '/(\(\d+\)) ?(\d+)-(\d{2})-(?=\d{2})/u','\\1'.NOBRSPACE.'\\2'.NOBRHYPHEN.'\\3'.NOBRHYPHEN, $s );
		$s = preg_replace( '/(\d+)-(\d{2})-(?=\d{2})/u','\\1'.NOBRHYPHEN.'\\2'.NOBRHYPHEN, $s );
		// Обрабатываем диапазон численных значений
		$s = preg_replace( '/((?>\d+))-(?=(?>\d+)([ .,!?:;…]|$))/u','\\1'.NUMDASH, $s );
		$s = preg_replace( '/((?>[IVXLCDM]+))-(?=(?>[IVXLCDM]+)([ .,!?:;…]|$))/u','\\1'.NUMDASH, $s );
		$s = preg_replace( '/ -(?=\d)/u',' &minus;', $s ); // Минус перед цифрами
		$s = preg_replace( '/([ '.DASH.NUMDASH.']|^)((?>\d+)) /u','\\1\\2'.NOBRSPACE, $s ); // Неразрывный пробел после арабских цифр
		$s = preg_replace( '/([ '.DASH.NUMDASH.']|^)((?>[IVXLCDM]+)) /u','\\1\\2'.NOBRSPACE, $s ); // Неразрывный пробел после римских цифр
		//TODO: Неразрывный пробел в конструкциях вида 10 кг и т.д. (если предыдущее правило отключено)
		//TODO: Вставлять неразрывный пробел между числом и сокращением размерностью, чтобы не было 1кг (причем только для общепринятых сокращений размерностей...)
		/* can break the code */
		/* $s = preg_replace( '/([-+]?(?>\d+)(?:[.,](?>\d*))?)[  '.NOBRSPACE.']?[CС]\b/u','\\1&deg; C', $s); // Заменяет C в конструкциях градусов на °C */
		$s = preg_replace( '/(\d)[  '.NOBRSPACE.'](?=%|‰)/u','\\1', $s); // Знаки процента (%) и промилле (‰) прикреплять к числам, к которым они относятся
		$s = preg_replace( '/(\d) (?=\d)/u','\\1'.NOBRSPACE, $s ); // Не разрывать 25 000
		// РАЗНОЕ
		$s = preg_replace( '/(ООО|ОАО|ЗАО|ЧП) ?(?="|«)/u','\\1'.NOBRSPACE, $s); // Делает неразрывными названия организаций и абревиатуру формы собственности
		$s = preg_replace( '/([^а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z]{1,8})-(?=[а-яА-ЯёЁa-zA-Z]{1,8}[^а-яА-ЯёЁa-zA-Z])/u','\\1'.NOBRHYPHEN, $s); // Делает неразрывными двойные слова (светло-красный, фамилии Иванов-Васильев)
		$s = strtr( $s, array_flip( $htmlents ) ); // Делаем обратные замены на html-entity
		/* can break the code */
		//$s = str_replace( '"','&quot;', $s ); // Заменяем " на &quot;
		//$s = str_replace( "'",'&#39;', $s ); // Заменяем ' на &#39;
		// НЕРАЗРЫВНЫЙ ПРОБЕЛ
		//$s = preg_replace( '/(^| |'.TAGEND.')([^ '.TAGBEGIN.TAGEND.NOBRSPACE.NOBRHYPHEN.DASH.NUMDASH.']+['.NOBRSPACE.NOBRHYPHEN.DASH.NUMDASH.'][^ '.TAGBEGIN.']*)(?=$| |'.TAGBEGIN.')/u','\\1<nobr>\\2</nobr>', $s );
		//$s = str_replace( NOBRSPACE,' ', $s );
		//$s = preg_replace( '/(?<=^| |'.TAGEND.')([^ '.TAGBEGIN.TAGEND.NOBRSPACE.NOBRHYPHEN.DASH.NUMDASH.']+['.NOBRSPACE.NOBRHYPHEN.DASH.NUMDASH.'][^ '.TAGBEGIN.']*)(?=$| |'.TAGBEGIN.')/u','<span style="white-space:nowrap">\\1</span>', $s );
		//$s = str_replace( NOBRSPACE,' ', $s );
		//$s = preg_replace( '/(?<=^| |'.TAGEND.')([^ '.TAGBEGIN.TAGEND.NOBRHYPHEN.DASH.NUMDASH.']+['.NOBRHYPHEN.DASH.NUMDASH.'][^ '.TAGBEGIN.']+)(?=$| |'.TAGBEGIN.')/u','<nobr>\\1</nobr>', $s );
		// $s = preg_replace( '/(?<=^| |'.TAGEND.')([^ '.TAGBEGIN.TAGEND.NOBRHYPHEN.DASH.']+['.NOBRHYPHEN.DASH.'][^ '.TAGBEGIN.']+)(?=$| |'.TAGBEGIN.')/u','<span style="white-space:nowrap">\\1</span>', $s );
		$s = str_replace( NOBRSPACE,'&#160;', $s );
		// НЕРАЗРЫВНЫЙ ДЕФИС
		$s = str_replace( NOBRHYPHEN,'&#8210;', $s );
		// ТИРЕ
		$s = str_replace( DASH,'&#8212;', $s );
		// ТИРЕ В ДИАПАЗОНЕ
		$s = str_replace( NUMDASH,'&#8211;', $s ); // ndash
		//Начальные и конечные пробелы и знаки препинания внутри текста ссылки выносить за пределы ссылки.
		/* can break the code */
		//$s = preg_replace( '/<a +href([^>]*)>([ .,!?:;…]+)/u', '\\2<a href\\1>', $s );
		//$s = preg_replace( '/(!\.\.|\?\.\.)<\/a>/u', '</a>\\1', $s );
		//$s = preg_replace( '/([ .,!?:;…]+)<\/a>/u', '</a>\\1', $s );
		$s = str_replace( ' <su', '<su', $s ); // Не отрывать верхние и нижние индексы от предыдущих символов
		$s = str_replace( THINSP,'&#8239;', $s );
		return trim($s);
	}
	public function parse($s) {
		$s = preg_replace("/[\ ]+/", " ", $s);
		$s = $this->proof($s);
		$a = array(
			'&#8222;'=>'&amp;#8222;','&#8219;'=>'&amp;#8219;','&#8220;'=>'&amp;#8220;','&#8216;'=>'&amp;#8216;','&#8217;'=>'&amp;#8217;',
			'&laquo;'=>'&amp;#171;','&raquo;'=>'&amp;#187;','&hellip;'=>'&amp;#8230;','&euro;'=>'&amp;#8364;','‰'=>'&amp;#8240;',
			'&bull;'=>'&amp;#8226;','&middot;'=>'&amp;#183;','&ndash;'=>'&amp;#8211;','&mdash;'=>'&amp;#8212;','&nbsp;'=>' ',
			'&trade;'=>'&amp;#8212;™','&copy;'=>'&amp;#169;','&reg;'=>'&amp;#174;','&sect;'=>'&amp;#167;','&#8470;'=>'&amp;#8470;',
			'&plusmn;'=>'&amp;#177;','&deg;'=>'&amp;#176;'
			);
		$s = strtr( $s, $a );
		/* figure dash 	‒ 	U+2012 	none 	&#x2012; or &#8210;
		en dash 	– 	U+2013 	&ndash; 	&#x2013; or &#8211;
		em dash 	— 	U+2014 	&mdash; 	&#x2014; or &#8212;
		horizontal bar 	― 	U+2015 	none 	&#x2015; or &#8213; */
		$a1 = array(
					/*add rare symbols - convert them directly for textarea*/
					'‚',
					'‘',
					'’',
					'„',
					'“',
					'”',
					'…',
					'‑',
					'‐',
					'⁃',
					'‒',
					'―',
					/*if they were already present as htmlentities, convert them for textarea*/
					'&#160;',
					'&#171;',
					'&#187;',
					'&#8210;',
					'&#8211;',
					'&#8212;',
					'&#8213;',
					'&#8216;',
					'&#8217;',
					'&#8218;',
					'&#8219;',
					'&#8220;',
					'&#8221;',
					'&#8222;',
					'&#8230;',
					//'&#39;',
					//'&quot;',
					' &amp;#8210;',
					' &amp;#8211;',
					' &amp;#8212;',
					/*this can ruin class names when changing x to &times;*/
					'&times;'
					);
		$a2 = array(
					/*add rare symbols - convert them directly for textarea*/
					'&amp;#8218;',
					'&amp;#8216;',
					'&amp;#8217;',
					'&amp;#8222;',
					'&amp;#8220;',
					'&amp;#8221;',
					'&amp;#8230;',
					'&amp;#8209;',
					'&amp;#8208;',
					'&amp;#8259;',
					'&amp;#8210;',
					'&amp;#8213;',
					/*if they were already present as htmlentities, convert them for textarea*/
					'&amp;#160;',
					'&amp;#171;',
					'&amp;#187;',
					'&amp;#8210;',
					'&amp;#8211;',
					'&amp;#8212;',
					'&amp;#8213;',
					'&amp;#8216;',
					'&amp;#8217;',
					'&amp;#8218;',
					'&amp;#8219;',
					'&amp;#8220;',
					'&amp;#8221;',
					'&amp;#8222;',
					'&amp;#8230;',
					//'&amp;#39;',
					//'&amp;quot;',
					'&amp;#160;&amp;#8210;',
					'&amp;#160;&amp;#8211;',
					'&amp;#160;&amp;#8212;',
					/*this can ruin class names when changing x to &times;*/
					'x'
					);
		$s = str_replace( $a1, $a2, $s );
		return $s;
	}
}
$source = (isset($_REQUEST['source'])) ? $_REQUEST['source'] : '';
$safe_str = (isset($_REQUEST['safe_str'])) ? $_REQUEST['safe_str'] : '';
$nbsp_to_space = (isset($_REQUEST['nbsp_to_space'])) ? $_REQUEST['nbsp_to_space'] : '';
$ent_parse = (isset($_REQUEST['ent_parse'])) ? $_REQUEST['ent_parse'] : '';
$ent_amp = (isset($_REQUEST['ent_amp'])) ? $_REQUEST['ent_amp'] : '';
$ent_single_quotes = (isset($_REQUEST['ent_single_quotes'])) ? $_REQUEST['ent_single_quotes'] : '';
$ent_double_quotes = (isset($_REQUEST['ent_double_quotes'])) ? $_REQUEST['ent_double_quotes'] : '';
$ent_lt_gt = (isset($_REQUEST['ent_lt_gt'])) ? $_REQUEST['ent_lt_gt'] : '';
$ent_hyphenminus = (isset($_REQUEST['ent_hyphenminus'])) ? $_REQUEST['ent_hyphenminus'] : '';
$p = '';
if (!empty($source)) {
	$p = $source;
	if (!empty($ent_parse)) {
		if (!isset($Typography) || empty($Typography)) {
			$Typography = new Typography();
		}
		$p = $Typography->parse($p);
		if (!isset($Entities) || empty($Entities)) {
			$Entities = new Entities();
		}
		$p = $Entities->ipa_text_to_dec_ents($p);
		//$p = $Entities->text_digits_to_dec_ents($p);
		$p = $Entities->text_symbs_to_dec_ents($p);
		$p = $Entities->named_symbs_to_dec_ents($p);
		//$p = $Entities->latin_text_chars_to_dec_ents($p);
		$p = $Entities->acc_text_to_dec_ents($p);
		$p = $Entities->acc_named_to_dec_ents($p);
		//$p = $Entities->cyr_text_chars_to_dec_ents($p);
		$p = $Entities->cyr_named_chars_to_dec_ents($p);
		$p = $Entities->hex_ents_to_dec_ents($p);
	}
	$p = str_replace("&", "&amp;", $p);
	if (!empty($ent_amp)) {
		$p = str_replace("&", "&amp;amp;", $p);
		$p = preg_replace("/(\&amp;amp;amp;)([A-Za-z]+)(\;)/", "&amp;\\2;", $p);
		$p = preg_replace("/(\&amp;amp;amp;#)([0-9]+)(\;)/", "&amp;#\\2;", $p);
	}
	$p = preg_replace("/(\&amp;amp;)([A-Za-z]+)(\;)/", "&amp;\\2;", $p);
	$p = preg_replace("/(\&amp;amp;#)([0-9]+)(\;)/", "&amp;#\\2;", $p);
	$p = str_replace("'", '&#39;', $p);
	$p = str_replace('"', '&quot;', $p);
	$p = str_replace(array('<','>'), array('&lt;','&gt;'), $p);
	if (!empty($ent_single_quotes)) {$p = str_replace( "&#39;",'&amp;#39;', $p );}
	if (!empty($ent_double_quotes)) {$p = str_replace( '&quot;','&amp;quot;', $p );}
	if (!empty($ent_lt_gt)) {$p = str_replace(array('&lt;','&gt;'), array('&amp;lt;','&amp;gt;'), $p);}
	if (!empty($ent_hyphenminus)) {$p = str_replace(array('-'), array('&amp;#45;'), $p);}
	if (!empty($safe_str)) {$p = $Typography->safe_str($p);}
	if (!empty($nbsp_to_space)) {$p = str_replace(array('&amp;nbsp;','&amp;#160;'), array(' ',' '), $p);$p = preg_replace("/[\ ]+/", " ", $p);}
}
$page_title = 'Типографика';
?><!DOCTYPE html>
<html id="html-no-js" lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="description" content="Типографика, кавычки-елочки, кавычки-лапки, тире, длинное тире, минус, онлайн инструмент" />
		<title><?php echo $page_title;?></title>
		<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap/3.3.7/css/bootstrap.min.css" />
		<style>
			input[type^="text"] {
				width: 99%;
			}
			textarea {
				width: 98%;
			}
			.container {
				max-width: 80%;
				margin: 0 auto;
			}
			#top-link-block.affix-top {
				position: absolute;
				bottom: -82px;
				right: 10px;
			}
			#top-link-block.affix {
				position: fixed;
				bottom: 18px;
				right: 10px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<h1><?php echo $page_title;?></h1>
			<fieldset>
				<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>" enctype="application/x-www-form-urlencoded">
					<p>
						<label for="source">text:</label>
						<textarea name="source" id="source" cols="30" rows="3" style="width:98%;"><?php
							if (!empty($source)) {echo htmlspecialchars($source);}
						?></textarea>
					</p>
					<p>
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&amp;#160;'));" value="nobr space (&#160;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8194;'));" value="en space (&#8194;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8195;'));" value="em space (&#8195;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8201;'));" value="thin space (&#8201;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8204;'));" value="zero width non-joiner (&#8204;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8205;'));" value="zero width joiner (&#8205;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8206;'));" value="left-to-right mark (&#8206;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8207;'));" value="right-to-left mark (&#8207;)" class="button" type="button" />
						<br />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('\x27'));" value="single quote (&#39;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('\x22'));" value="double quote (&#34;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8217;'));" value="apostrophe (&#8217;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#180;'));" value="acute (&#180;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#96;'));" value="grave (&#96;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8242;'));" value="prime (&#8242;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8243;'));" value="double prime (&#8243;)" class="button" type="button" />
						<br />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#45;'));" value="hyphen-minus (&#45;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8208;'));" value="hyphen (&#8208;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8722;'));" value="minus (&#8722;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#43;'));" value="plus (&#43;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8259;'));" value="hyphen bullet (&#8259;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#173;'));" value="soft hyphen (&#173;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8209;'));" value="nobr hyphen (&#8209;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8211;'));" value="en dash/range (&#8211;)" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8212;'));" value="em dash (&#8212;)" class="button" type="button" />
						<br />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8230;'));" value="&#8230;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('\x27...\x27'));" value="&#39;...&#39;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('\x22...\x22'));" value="&#34;...&#34;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8216;...&#8217;'));" value="&#8216;...&#8217;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8220;...&#8221;'));" value="&#8220;...&#8221;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8222;...&#8220;'));" value="&#8222;...&#8220;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#171;...&#187;'));" value="&#171;...&#187;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('\x27... \x22...\x22 ...\x27'));" value="&#39;... &#34;...&#34; ...&#39;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('\x22... \x27...\x27 ...\x22'));" value="&#34;... &#39;...&#39; ...&#34;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#171;... &#8222;...&#8220; ...&#187;'));" value="&#171;... &#8222;...&#8220; ...&#187;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#8216;... &#8220;...&#8221; ...&#8217;'));" value="&#8216;... &#8220;...&#8221; ...&#8217;" class="button" type="button" />
						<input onclick="document.getElementById('source').appendChild(document.createTextNode('&#187;... &#8220;...&#8221; ...&#171;'));" value="&#187;... &#8220;...&#8221; ...&#171;" class="button" type="button" />
					</p>
					<p>
						<label for="ent_parse">parse:</label>
						<input name="ent_parse" id="ent_parse" type="checkbox" checked="checked" />
						<label for="safe_str">строкой:</label>
						<input name="safe_str" id="safe_str" type="checkbox" />
						<label for="nbsp_to_space">&amp;nbsp;/&amp;#160;&#160;&#8594;&#160;" ":</label>
						<input name="nbsp_to_space" id="nbsp_to_space" type="checkbox" />
						<label for="ent_amp">&amp;&#160;&#8594;&#160;&amp;amp;:</label>
						<input name="ent_amp" id="ent_amp" type="checkbox" />
						<label for="ent_lt_gt">&lt;&#160;&#8594;&#160;&amp;lt;&#160;&#160;&gt;&#160;&#8594;&#160;&amp;gt;:</label>
						<input name="ent_lt_gt" id="ent_lt_gt" type="checkbox" />
						<label for="ent_single_quotes">&#39;&#160;&#8594;&#160;&amp;#39;:</label>
						<input name="ent_single_quotes" id="ent_single_quotes" type="checkbox" />
						<label for="ent_double_quotes">&quot;&#160;&#8594;&#160;&amp;quot;:</label>
						<input name="ent_double_quotes" id="ent_double_quotes" type="checkbox" />
						<label for="ent_hyphenminus">&#45;&#160;&#8594;&#160;&amp;#45;</label>
						<input name="ent_hyphenminus" id="ent_hyphenminus" type="checkbox" />
						<input name="f_reset" id="f_reset" onclick="document.getElementById('source').innerHTML='';document.getElementById('markup').innerHTML=''" value="Reset" class="button" type="reset" />
						<input name="f_submit" id="f_submit" value="Submit" class="button" type="submit" />
					</p>
				</form>
				<form id="typography_form" action="#" method="post" enctype="application/x-www-form-urlencoded">
					<p>
						<label for="markup">markup:</label>
						<textarea name="markup" id="markup" cols="30" rows="3" style="width:98%"><?php
							if (!empty($p)) {echo $p;}
						?></textarea>
					</p>
				</form>
			</fieldset>
			<p><a href="../charref/" target="_blank">Character Entity Reference Chart</a></p>
			<h3>Alt+Numpad</h3>
			<table class="table table-striped entities_num"><tr><td>ALT+0160</td><td>&nbsp;</td></tr><tr><td>ALT+0150</td><td>–</td></tr><tr><td>ALT+0151</td><td>—</td></tr><tr><td>ALT+0133</td><td>…</td></tr><tr><td>ALT+0149</td><td>•</td></tr><tr><td>ALT+0183</td><td>&middot;</td></tr><tr><td>ALT+0180</td><td>&acute;</td></tr><tr><td>ALT+0145</td><td>‘</td></tr><tr><td>ALT+0146</td><td>’</td></tr><tr><td>ALT+0132</td><td>„</td></tr><tr><td>ALT+0147</td><td>“</td></tr><tr><td>ALT+0148</td><td>”</td></tr><tr><td>ALT+0171</td><td>&laquo;</td></tr><tr><td>ALT+0187</td><td>&raquo;</td></tr><tr><td>ALT+0135</td><td>†</td></tr><tr><td>ALT+0169</td><td>&copy;</td></tr><tr><td>ALT+0174</td><td>&reg;</td></tr><tr><td>ALT+0153</td><td>™</td></tr><tr><td>ALT+0128</td><td>€</td></tr><tr><td>ALT+0163</td><td>&pound;</td></tr><tr><td>ALT+0134</td><td>†</td></tr><tr><td>ALT+0131</td><td>ƒ</td></tr><tr><td>ALT+0152</td><td>˜</td></tr><tr><td>ALT+0136</td><td>ˆ</td></tr><tr><td>ALT+0139</td><td>‹</td></tr><tr><td>ALT+0155</td><td>›</td></tr><tr><td>ALT+0137</td><td>‰</td></tr><tr><td>ALT+0168</td><td>&uml;</td></tr><tr><td>ALT+0138</td><td>Š</td></tr><tr><td>ALT+0140</td><td>Œ</td></tr><tr><td>ALT+0142</td><td>Ž</td></tr><tr><td>ALT+0154</td><td>š</td></tr><tr><td>ALT+0156</td><td>œ</td></tr><tr><td>ALT+0158</td><td>ž</td></tr><tr><td>ALT+0159</td><td>&yuml;</td></tr><tr><td>ALT+0161</td><td>&iexcl;</td></tr><tr><td>ALT+0162</td><td>&cent;</td></tr><tr><td>ALT+0164</td><td>&curren;</td></tr><tr><td>ALT+0165</td><td>&yen;</td></tr><tr><td>ALT+0166</td><td>&brvbar;</td></tr><tr><td>ALT+0167</td><td>&sect;</td></tr><tr><td>ALT+0170</td><td>&ordf;</td></tr><tr><td>ALT+0172</td><td>&not;</td></tr><tr><td>ALT+0173</td><td>&shy;</td></tr><tr><td>ALT+0175</td><td>&macr;</td></tr><tr><td>ALT+0176</td><td>&deg;</td></tr><tr><td>ALT+0177</td><td>&plusmn;</td></tr><tr><td>ALT+0178</td><td>&sup2;</td></tr><tr><td>ALT+0179</td><td>&sup3;</td></tr><tr><td>ALT+0181</td><td>&micro;</td></tr><tr><td>ALT+0182</td><td>&para;</td></tr><tr><td>ALT+0184</td><td>&cedil;</td></tr><tr><td>ALT+0185</td><td>&sup1;</td></tr><tr><td>ALT+0186</td><td>&ordm;</td></tr><tr><td>ALT+0188</td><td>&frac14;</td></tr><tr><td>ALT+0189</td><td>&frac12;</td></tr><tr><td>ALT+0190</td><td>&frac34;</td></tr><tr><td>ALT+0191</td><td>&iquest;</td></tr><tr><td>ALT+0192</td><td>&Agrave;</td></tr><tr><td>ALT+0193</td><td>&Aacute;</td></tr><tr><td>ALT+0194</td><td>&Acirc;</td></tr><tr><td>ALT+0195</td><td>&Atilde;</td></tr><tr><td>ALT+0196</td><td>&Auml;</td></tr><tr><td>ALT+0197</td><td>&Aring;</td></tr><tr><td>ALT+0198</td><td>&AElig;</td></tr><tr><td>ALT+0199</td><td>&Ccedil;</td></tr><tr><td>ALT+0200</td><td>&Egrave;</td></tr><tr><td>ALT+0201</td><td>&Eacute;</td></tr><tr><td>ALT+0202</td><td>&Ecirc;</td></tr><tr><td>ALT+0203</td><td>&Euml;</td></tr><tr><td>ALT+0204</td><td>&Igrave;</td></tr><tr><td>ALT+0205</td><td>&Iacute;</td></tr><tr><td>ALT+0206</td><td>&Icirc;</td></tr><tr><td>ALT+0207</td><td>&Iuml;</td></tr><tr><td>ALT+0208</td><td>&ETH;</td></tr><tr><td>ALT+0209</td><td>&Ntilde;</td></tr><tr><td>ALT+0210</td><td>&Ograve;</td></tr><tr><td>ALT+0211</td><td>&Oacute;</td></tr><tr><td>ALT+0212</td><td>&Ocirc;</td></tr><tr><td>ALT+0213</td><td>&Otilde;</td></tr><tr><td>ALT+0214</td><td>&Ouml;</td></tr><tr><td>ALT+0215</td><td>&times;</td></tr><tr><td>ALT+0216</td><td>&Oslash;</td></tr><tr><td>ALT+0217</td><td>&Ugrave;</td></tr><tr><td>ALT+0218</td><td>&Uacute;</td></tr><tr><td>ALT+0219</td><td>&Ucirc;</td></tr><tr><td>ALT+0220</td><td>&Uuml;</td></tr><tr><td>ALT+0221</td><td>&Yacute;</td></tr><tr><td>ALT+0222</td><td>&THORN;</td></tr><tr><td>ALT+0223</td><td>&szlig;</td></tr><tr><td>ALT+0224</td><td>&agrave;</td></tr><tr><td>ALT+0225</td><td>&aacute;</td></tr><tr><td>ALT+0226</td><td>&acirc;</td></tr><tr><td>ALT+0227</td><td>&atilde;</td></tr><tr><td>ALT+0228</td><td>&auml;</td></tr><tr><td>ALT+0229</td><td>&aring;</td></tr><tr><td>ALT+0230</td><td>&aelig;</td></tr><tr><td>ALT+0231</td><td>&ccedil;</td></tr><tr><td>ALT+0232</td><td>&egrave;</td></tr><tr><td>ALT+0233</td><td>&eacute;</td></tr><tr><td>ALT+0234</td><td>&ecirc;</td></tr><tr><td>ALT+0235</td><td>&euml;</td></tr><tr><td>ALT+0236</td><td>&igrave;</td></tr><tr><td>ALT+0237</td><td>&iacute;</td></tr><tr><td>ALT+0238</td><td>&icirc;</td></tr><tr><td>ALT+0239</td><td>&iuml;</td></tr><tr><td>ALT+0240</td><td>&eth;</td></tr><tr><td>ALT+0241</td><td>&ntilde;</td></tr><tr><td>ALT+0242</td><td>&ograve;</td></tr><tr><td>ALT+0243</td><td>&oacute;</td></tr><tr><td>ALT+0244</td><td>&ocirc;</td></tr><tr><td>ALT+0245</td><td>&otilde;</td></tr><tr><td>ALT+0246</td><td>&ouml;</td></tr><tr><td>ALT+0247</td><td>&divide;</td></tr><tr><td>ALT+0248</td><td>&oslash;</td></tr><tr><td>ALT+0249</td><td>&ugrave;</td></tr><tr><td>ALT+0250</td><td>&uacute;</td></tr><tr><td>ALT+0251</td><td>&ucirc;</td></tr><tr><td>ALT+0252</td><td>&uuml;</td></tr><tr><td>ALT+0253</td><td>&yacute;</td></tr><tr><td>ALT+0254</td><td>&thorn;</td></tr><tr><td>ALT+0255</td><td>&yuml;</td></tr></table><h3>Framemaker</h3><table class="table table-striped entities_num"><tr><td>beginning of paragraph</td><td>\P</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>end of paragraph</td><td>\p</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>hellip</td><td>\u2026</td><td>…</td><td>&amp;#8230;</td></tr><tr><td>quotesingle</td><td>\x27</td><td>'</td><td>&amp;#39;</td></tr><tr><td>quotesinglebase</td><td>\xe2</td><td>‚</td><td>&amp;#8218;</td></tr><tr><td>quoteleft</td><td>\xd4</td><td>‘</td><td>&amp;#8216;</td></tr><tr><td>quoteright</td><td>\xd5</td><td>’</td><td>&amp;#8217;</td></tr></table><h3>Special Characters</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;quot;</td><td>&amp;#34;</td><td>"</td><td>quotation mark</td><td>u+0022 ISOnum</td><td>p:before { content:"\0022"; }</td><td onclick="alert(&quot;\42&quot;)">alert("\42")</td></tr><tr><td>&amp;amp;</td><td>&amp;#38;</td><td>&amp;</td><td>ampersand</td><td>u+0026 ISOnum</td><td>p:before { content:"\0026"; }</td><td onclick="alert(&quot;\46&quot;)">alert("\46")</td></tr><tr><td>&amp;lt;</td><td>&amp;#60;</td><td>&lt;</td><td>less-than sign</td><td>u+003C ISOnum</td><td>p:before { content:"\003c"; }</td><td onclick="alert(&quot;\74&quot;)">alert("\74");</td></tr><tr><td>&amp;gt;</td><td>&amp;#62;</td><td>&gt;</td><td>greater-than sign</td><td>u+003E ISOnum</td><td>p:before { content:"\003e"; }</td><td onclick="alert(&quot;\76&quot;)">alert("\76");</td></tr></tbody></table><h3>Latin-1 entity set for HTML</h3><table class="table table-striped entities_num"><tbody><tr><th>Name</th><th>&nbsp;</th><th>Numeric</th><th>Description</th><th>Hex</th><th>ISO in CSS content </th><th>Octal</th></tr><tr><td>&amp;nbsp;</td><td>&nbsp;</td><td>&amp;#160;</td><td>no-break space</td><td>%A0</td><td>p:before { content:"\00a0"; }</td><td onclick="alert(&quot;\240&quot;)">alert("\240");</td></tr><tr><td>&amp;iexcl;</td><td>¡</td><td>&amp;#161;</td><td>inverted exclamation mark</td><td>%A1</td><td>p:before { content:"\00a1"; }</td><td onclick="alert(&quot;\241&quot;)">alert("\241");</td></tr><tr><td>&amp;cent;</td><td>¢</td><td>&amp;#162;</td><td>cent sign</td><td>%A2</td><td>p:before { content:"\00a2"; }</td><td onclick="alert(&quot;\242&quot;)">alert("\242");</td></tr><tr><td>&amp;pound;</td><td>£</td><td>&amp;#163;</td><td>pound sterling sign</td><td>%A3</td><td>p:before { content:"\00a3"; }</td><td onclick="alert(&quot;\243&quot;)">alert("\243");</td></tr><tr><td>&amp;curren;</td><td>¤</td><td>&amp;#164;</td><td>general currency sign</td><td>%A4</td><td>p:before { content:"\00a4"; }</td><td onclick="alert(&quot;\244&quot;)">alert("\244");</td></tr><tr><td>&amp;yen;</td><td>¥</td><td>&amp;#165;</td><td>yen sign</td><td>%A5</td><td>p:before { content:"\00a5"; }</td><td onclick="alert(&quot;\245&quot;)">alert("\245");</td></tr><tr><td>&amp;brvbar;</td><td>¦</td><td>&amp;#166;</td><td>broken (vertical) bar</td><td>%A6</td><td>p:before { content:"\00a6"; }</td><td onclick="alert(&quot;\246&quot;)">alert("\246");</td></tr><tr><td>&amp;sect;</td><td>§</td><td>&amp;#167;</td><td>section sign</td><td>%A7</td><td>p:before { content:"\00a7"; }</td><td onclick="alert(&quot;\247&quot;)">alert("\247");</td></tr><tr><td>&amp;uml;</td><td>¨</td><td>&amp;#168;</td><td>umlaut (dieresis)</td><td>%A8</td><td>p:before { content:"\00a8"; }</td><td onclick="alert(&quot;\250&quot;)">alert("\250");</td></tr><tr><td>&amp;copy;</td><td>©</td><td>&amp;#169;</td><td>copyright sign</td><td>%A9</td><td>p:before { content:"\00a9"; }</td><td onclick="alert(&quot;\251&quot;)">alert("\251");</td></tr><tr><td>&amp;ordf;</td><td>ª</td><td>&amp;#170;</td><td>ordinal indicator, feminine</td><td>%AA</td><td>p:before { content:"\00aa"; }</td><td onclick="alert(&quot;\252&quot;)">alert("\252");</td></tr><tr><td>&amp;laquo;</td><td>«</td><td>&amp;#171;</td><td>angle quotation mark, left</td><td>%AB</td><td>p:before { content:"\00ab"; }</td><td onclick="alert(&quot;\253&quot;)">alert("\253");</td></tr><tr><td>&amp;not;</td><td>¬</td><td>&amp;#172;</td><td>not sign</td><td>%AC</td><td>p:before { content:"\00ac"; }</td><td onclick="alert(&quot;\254&quot;)">alert("\254");</td></tr><tr><td>&amp;shy;</td><td>­</td><td>&amp;#173;</td><td>soft hyphen</td><td>%AD</td><td>p:before { content:"\00ad"; }</td><td onclick="alert(&quot;\255&quot;)">alert("\255");</td></tr><tr><td>&amp;reg;</td><td>®</td><td>&amp;#174;</td><td>registered sign</td><td>%AE</td><td>p:before { content:"\00ae"; }</td><td onclick="alert(&quot;\256&quot;)">alert("\256");</td></tr><tr><td>&amp;macr;</td><td>¯</td><td>&amp;#175;</td><td>macron</td><td>%AF</td><td>p:before { content:"\00af"; }</td><td onclick="alert(&quot;\257&quot;)">alert("\257");</td></tr><tr><td>&amp;deg;</td><td>°</td><td>&amp;#176;</td><td>degree sign</td><td>%B0</td><td>p:before { content:"\00b0"; }</td><td onclick="alert(&quot;\260&quot;)">alert("\260");</td></tr><tr><td>&amp;plusmn;</td><td>±</td><td>&amp;#177;</td><td>plus-or-minus sign</td><td>%B1</td><td>p:before { content:"\00b1"; }</td><td onclick="alert(&quot;\261&quot;)">alert("\261");</td></tr><tr><td>&amp;sup2;</td><td>²</td><td>&amp;#178;</td><td>superscript two</td><td>%B2</td><td>p:before { content:"\00b2"; }</td><td onclick="alert(&quot;\262&quot;)">alert("\262");</td></tr><tr><td>&amp;sup3;</td><td>³</td><td>&amp;#179;</td><td>superscript three</td><td>%B3</td><td>p:before { content:"\00b3"; }</td><td onclick="alert(&quot;\263&quot;)">alert("\263");</td></tr><tr><td>&amp;acute;</td><td>´</td><td>&amp;#180;</td><td>acute accent</td><td>%B4</td><td>p:before { content:"\00b4"; }</td><td onclick="alert(&quot;\264&quot;)">alert("\264");</td></tr><tr><td>&amp;micro;</td><td>µ</td><td>&amp;#181;</td><td>micro sign</td><td>%B5</td><td>p:before { content:"\00b5"; }</td><td onclick="alert(&quot;\265&quot;)">alert("\265");</td></tr><tr><td>&amp;para;</td><td>¶</td><td>&amp;#182;</td><td>pilcrow (paragraph sign)</td><td>%B6</td><td>p:before { content:"\00b6"; }</td><td onclick="alert(&quot;\266&quot;)">alert("\266");</td></tr><tr><td>&amp;middot;</td><td>·</td><td>&amp;#183;</td><td>middle dot</td><td>%B7</td><td>p:before { content:"\00b7"; }</td><td onclick="alert(&quot;\267&quot;)">alert("\267");</td></tr><tr><td>&amp;cedil;</td><td>¸</td><td>&amp;#184;</td><td>cedilla</td><td>%B8</td><td>p:before { content:"\00b8"; }</td><td onclick="alert(&quot;\270&quot;)">alert("\270");</td></tr><tr><td>&amp;sup1;</td><td>¹</td><td>&amp;#185;</td><td>superscript one</td><td>%B9</td><td>p:before { content:"\00b9"; }</td><td onclick="alert(&quot;\271&quot;)">alert("\271");</td></tr><tr><td>&amp;ordm;</td><td>º</td><td>&amp;#186;</td><td>ordinal indicator, masculine</td><td>%BA</td><td>p:before { content:"\00ba"; }</td><td onclick="alert(&quot;\272&quot;)">alert("\272");</td></tr><tr><td>&amp;raquo;</td><td>»</td><td>&amp;#187;</td><td>angle quotation mark, right</td><td>%BB</td><td>p:before { content:"\00bb"; }</td><td onclick="alert(&quot;\273&quot;)">alert("\273");</td></tr><tr><td>&amp;frac14;</td><td>¼</td><td>&amp;#188;</td><td>fraction one-quarter</td><td>%BC</td><td>p:before { content:"\00bc"; }</td><td onclick="alert(&quot;\274&quot;)">alert("\274");</td></tr><tr><td>&amp;frac12;</td><td>½</td><td>&amp;#189;</td><td>fraction one-half</td><td>%BD</td><td>p:before { content:"\00bd"; }</td><td onclick="alert(&quot;\275&quot;)">alert("\275");</td></tr><tr><td>&amp;frac34;</td><td>¾</td><td>&amp;#190;</td><td>fraction three-quarters</td><td>%BE</td><td>p:before { content:"\00be"; }</td><td onclick="alert(&quot;\276&quot;)">alert("\276");</td></tr><tr><td>&amp;iquest;</td><td>¿</td><td>&amp;#191;</td><td>inverted question mark</td><td>%BF</td><td>p:before { content:"\00bf"; }</td><td onclick="alert(&quot;\277&quot;)">alert("\277");</td></tr><tr><td>&amp;Agrave;</td><td>À</td><td>&amp;#192;</td><td>capital A, grave accent</td><td>%C0</td><td>p:before { content:"\00c0"; }</td><td onclick="alert(&quot;\300&quot;)">alert("\300");</td></tr><tr><td>&amp;Aacute;</td><td>Á</td><td>&amp;#193;</td><td>capital A, acute accent</td><td>%C1</td><td>p:before { content:"\00c1"; }</td><td onclick="alert(&quot;\301&quot;)">alert("\301");</td></tr><tr><td>&amp;Acirc;</td><td>Â</td><td>&amp;#194;</td><td>capital A, circumflex accent</td><td>%C2</td><td>p:before { content:"\00c2"; }</td><td onclick="alert(&quot;\302&quot;)">alert("\302");</td></tr><tr><td>&amp;Atilde;</td><td>Ã</td><td>&amp;#195;</td><td>capital A, tilde</td><td>%C3</td><td>p:before { content:"\00c3"; }</td><td onclick="alert(&quot;\303&quot;)">alert("\303");</td></tr><tr><td>&amp;Auml;</td><td>Ä</td><td>&amp;#196;</td><td>capital A, dieresis or umlaut mark</td><td>%C4</td><td>p:before { content:"\00c4"; }</td><td onclick="alert(&quot;\304&quot;)">alert("\304");</td></tr><tr><td>&amp;Aring;</td><td>Å</td><td>&amp;#197;</td><td>capital A, ring</td><td>%C5</td><td>p:before { content:"\00c5"; }</td><td onclick="alert(&quot;\305&quot;)">alert("\305");</td></tr><tr><td>&amp;AElig;</td><td>Æ</td><td>&amp;#198;</td><td>capital AE diphthong (ligature)</td><td>%C6</td><td>p:before { content:"\00c6"; }</td><td onclick="alert(&quot;\306&quot;)">alert("\306");</td></tr><tr><td>&amp;Ccedil;</td><td>Ç</td><td>&amp;#199;</td><td>capital C, cedilla</td><td>%C7</td><td>p:before { content:"\00c7"; }</td><td onclick="alert(&quot;\307&quot;)">alert("\307");</td></tr><tr><td>&amp;Egrave;</td><td>È</td><td>&amp;#200;</td><td>capital E, grave accent</td><td>%C8</td><td>p:before { content:"\00c8"; }</td><td onclick="alert(&quot;\310&quot;)">alert("\310");</td></tr><tr><td>&amp;Eacute;</td><td>É</td><td>&amp;#201;</td><td>capital E, acute accent</td><td>%C9</td><td>p:before { content:"\00c9"; }</td><td onclick="alert(&quot;\311&quot;)">alert("\311");</td></tr><tr><td>&amp;Ecirc;</td><td>Ê</td><td>&amp;#202;</td><td>capital E, circumflex accent</td><td>%CA</td><td>p:before { content:"\00ca"; }</td><td onclick="alert(&quot;\312&quot;)">alert("\312");</td></tr><tr><td>&amp;Euml;</td><td>Ë</td><td>&amp;#203;</td><td>capital E, dieresis or umlaut mark</td><td>%CB</td><td>p:before { content:"\00cb"; }</td><td onclick="alert(&quot;\313&quot;)">alert("\313");</td></tr><tr><td>&amp;Igrave;</td><td>Ì</td><td>&amp;#204;</td><td>capital I, grave accent</td><td>%CC</td><td>p:before { content:"\00cc"; }</td><td onclick="alert(&quot;\314&quot;)">alert("\314");</td></tr><tr><td>&amp;Iacute;</td><td>Í</td><td>&amp;#205;</td><td>capital I, acute accent</td><td>%CD</td><td>p:before { content:"\00cd"; }</td><td onclick="alert(&quot;\315&quot;)">alert("\315");</td></tr><tr><td>&amp;Icirc;</td><td>Î</td><td>&amp;#206;</td><td>capital I, circumflex accent</td><td>%CE</td><td>p:before { content:"\00ce"; }</td><td onclick="alert(&quot;\316&quot;)">alert("\316");</td></tr><tr><td>&amp;Iuml;</td><td>Ï</td><td>&amp;#207;</td><td>capital I, dieresis or umlaut mark</td><td>%CF</td><td>p:before { content:"\00cf"; }</td><td onclick="alert(&quot;\317&quot;)">alert("\317");</td></tr><tr><td>&amp;ETH;</td><td>Ð</td><td>&amp;#208;</td><td>capital Eth, Icelandic</td><td>%D0</td><td>p:before { content:"\00d0"; }</td><td onclick="alert(&quot;\320&quot;)">alert("\320");</td></tr><tr><td>&amp;Ntilde;</td><td>Ñ</td><td>&amp;#209;</td><td>capital N, tilde</td><td>%D1</td><td>p:before { content:"\00d1"; }</td><td onclick="alert(&quot;\321&quot;)">alert("\321");</td></tr><tr><td>&amp;Ograve;</td><td>Ò</td><td>&amp;#210;</td><td>capital O, grave accent</td><td>%D2</td><td>p:before { content:"\00d2"; }</td><td onclick="alert(&quot;\322&quot;)">alert("\322");</td></tr><tr><td>&amp;Oacute;</td><td>Ó</td><td>&amp;#211;</td><td>capital O, acute accent</td><td>%D3</td><td>p:before { content:"\00d3"; }</td><td onclick="alert(&quot;\323&quot;)">alert("\323");</td></tr><tr><td>&amp;Ocirc;</td><td>Ô</td><td>&amp;#212;</td><td>capital O, circumflex accent</td><td>%D4</td><td>p:before { content:"\00d4"; }</td><td onclick="alert(&quot;\324&quot;)">alert("\324");</td></tr><tr><td>&amp;Otilde;</td><td>Õ</td><td>&amp;#213;</td><td>capital O, tilde</td><td>%D5</td><td>p:before { content:"\00d5"; }</td><td onclick="alert(&quot;\325&quot;)">alert("\325");</td></tr><tr><td>&amp;Ouml;</td><td>Ö</td><td>&amp;#214;</td><td>capital O, dieresis or umlaut mark</td><td>%D6</td><td>p:before { content:"\00d6"; }</td><td onclick="alert(&quot;\326&quot;)">alert("\326");</td></tr><tr><td>&amp;times;</td><td>×</td><td>&amp;#215;</td><td>multiply sign</td><td>%D7</td><td>p:before { content:"\00d7"; }</td><td onclick="alert(&quot;\327&quot;)">alert("\327");</td></tr><tr><td>&amp;Oslash;</td><td>Ø</td><td>&amp;#216;</td><td><p>capital O, slash</p></td><td>%D8</td><td>p:before { content:"\00d8"; }</td><td onclick="alert(&quot;\330&quot;)">alert("\330");</td></tr><tr><td>&amp;Ugrave;</td><td>Ù</td><td>&amp;#217;</td><td>capital U, grave accent</td><td>%D9</td><td>p:before { content:"\00d9"; }</td><td onclick="alert(&quot;\331&quot;)">alert("\331");</td></tr><tr><td>&amp;Uacute;</td><td>Ú</td><td>&amp;#218;</td><td>capital U, acute accent</td><td>%DA</td><td>p:before { content:"\00da"; }</td><td onclick="alert(&quot;\332&quot;)">alert("\332");</td></tr><tr><td>&amp;Ucirc;</td><td>Û</td><td>&amp;#219;</td><td>capital U, circumflex accent</td><td>%DB</td><td>p:before { content:"\00db"; }</td><td onclick="alert(&quot;\333&quot;)">alert("\333");</td></tr><tr><td>&amp;Uuml;</td><td>Ü</td><td>&amp;#220;</td><td>capital U, dieresis or umlaut mark</td><td>%DC</td><td>p:before { content:"\00dc"; }</td><td onclick="alert(&quot;\334&quot;)">alert("\334");</td></tr><tr><td>&amp;Yacute;</td><td>Ý</td><td>&amp;#221;</td><td>capital Y, acute accent</td><td>%DD</td><td>p:before { content:"\00dd"; }</td><td onclick="alert(&quot;\335&quot;)">alert("\335");</td></tr><tr><td>&amp;THORN;</td><td>Þ</td><td>&amp;#222;</td><td>capital THORN, Icelandic</td><td>%DE</td><td>p:before { content:"\00de"; }</td><td onclick="alert(&quot;\336&quot;)">alert("\336");</td></tr><tr><td>&amp;szlig;</td><td>ß</td><td>&amp;#223;</td><td>small sharp s, German (sz ligature)</td><td>%DF</td><td>p:before { content:"\00df"; }</td><td onclick="alert(&quot;\337&quot;)">alert("\337");</td></tr><tr><td>&amp;agrave;</td><td>à</td><td>&amp;#224;</td><td>small a, grave accent</td><td>%E0</td><td>p:before { content:"\00e0"; }</td><td onclick="alert(&quot;\340&quot;)">alert("\340");</td></tr><tr><td>&amp;aacute;</td><td>á</td><td>&amp;#225;</td><td>small a, acute accent</td><td>%E1</td><td>p:before { content:"\00e1"; }</td><td onclick="alert(&quot;\341&quot;)">alert("\341");</td></tr><tr><td>&amp;acirc;</td><td>â</td><td>&amp;#226;</td><td>small a, circumflex accent</td><td>%E2</td><td>p:before { content:"\00e2"; }</td><td onclick="alert(&quot;\342&quot;)">alert("\342");</td></tr><tr><td>&amp;atilde;</td><td>ã</td><td>&amp;#227;</td><td>small a, tilde</td><td>%E3</td><td>p:before { content:"\00e3"; }</td><td onclick="alert(&quot;\343&quot;)">alert("\343");</td></tr><tr><td>&amp;auml;</td><td>ä</td><td>&amp;#228;</td><td>small a, dieresis or umlaut mark</td><td>%E4</td><td>p:before { content:"\00e4"; }</td><td onclick="alert(&quot;\344&quot;)">alert("\344");</td></tr><tr><td>&amp;aring;</td><td>å</td><td>&amp;#229;</td><td>small a, ring</td><td>%E5</td><td>p:before { content:"\00e5"; }</td><td onclick="alert(&quot;\345&quot;)">alert("\345");</td></tr><tr><td>&amp;aelig;</td><td>æ</td><td>&amp;#230;</td><td>small ae diphthong (ligature)</td><td>%E6</td><td>p:before { content:"\00e6"; }</td><td onclick="alert(&quot;\346&quot;)">alert("\346");</td></tr><tr><td>&amp;ccedil;</td><td>ç</td><td>&amp;#231;</td><td>small c, cedilla</td><td>%E7</td><td>p:before { content:"\00e7"; }</td><td onclick="alert(&quot;\347&quot;)">alert("\347");</td></tr><tr><td>&amp;egrave;</td><td>è</td><td>&amp;#232;</td><td>small e, grave accent</td><td>%E8</td><td>p:before { content:"\00e8"; }</td><td onclick="alert(&quot;\350&quot;)">alert("\350");</td></tr><tr><td>&amp;eacute;</td><td>é</td><td>&amp;#233;</td><td>small e, acute accent</td><td>%E9</td><td>p:before { content:"\00e9"; }</td><td onclick="alert(&quot;\351&quot;)">alert("\351");</td></tr><tr><td>&amp;ecirc;</td><td>ê</td><td>&amp;#234;</td><td>small e, circumflex accent</td><td>%EA</td><td>p:before { content:"\00ea"; }</td><td onclick="alert(&quot;\352&quot;)">alert("\352");</td></tr><tr><td>&amp;euml;</td><td>ë</td><td>&amp;#235;</td><td>small e, dieresis or umlaut mark</td><td>%EB</td><td>p:before { content:"\00eb"; }</td><td onclick="alert(&quot;\353&quot;)">alert("\353");</td></tr><tr><td>&amp;igrave;</td><td>ì</td><td>&amp;#236;</td><td>small i, grave accent</td><td>%EC</td><td>p:before { content:"\00ec"; }</td><td onclick="alert(&quot;\354&quot;)">alert("\354");</td></tr><tr><td>&amp;iacute;</td><td>í</td><td>&amp;#237;</td><td>small i, acute accent</td><td>%ED</td><td>p:before { content:"\00ed"; }</td><td onclick="alert(&quot;\355&quot;)">alert("\355");</td></tr><tr><td>&amp;icirc;</td><td>î</td><td>&amp;#238;</td><td>small i, circumflex accent</td><td>%EE</td><td>p:before { content:"\00ee"; }</td><td onclick="alert(&quot;\356&quot;)">alert("\356");</td></tr><tr><td>&amp;iuml;</td><td>ï</td><td>&amp;#239;</td><td>small i, dieresis or umlaut mark</td><td>%EF</td><td>p:before { content:"\00ef"; }</td><td onclick="alert(&quot;\357&quot;)">alert("\357");</td></tr><tr><td>&amp;eth;</td><td>ð</td><td>&amp;#240;</td><td>small eth, Icelandic</td><td>%F0</td><td>p:before { content:"\00f0"; }</td><td onclick="alert(&quot;\360&quot;)">alert("\360");</td></tr><tr><td>&amp;ntilde;</td><td>ñ</td><td>&amp;#241;</td><td>small n, tilde</td><td>%F1</td><td>p:before { content:"\00f1"; }</td><td onclick="alert(&quot;\361&quot;)">alert("\361");</td></tr><tr><td>&amp;ograve;</td><td>ò</td><td>&amp;#242;</td><td>small o, grave accent</td><td>%F2</td><td>p:before { content:"\00f2"; }</td><td onclick="alert(&quot;\362&quot;)">alert("\362");</td></tr><tr><td>&amp;oacute;</td><td>ó</td><td>&amp;#243;</td><td>small o, acute accent</td><td>%F3</td><td>p:before { content:"\00f3"; }</td><td onclick="alert(&quot;\363&quot;)">alert("\363");</td></tr><tr><td>&amp;ocirc;</td><td>ô</td><td>&amp;#244;</td><td>small o, circumflex accent</td><td>%F4</td><td>p:before { content:"\00f4"; }</td><td onclick="alert(&quot;\364&quot;)">alert("\364");</td></tr><tr><td>&amp;otilde;</td><td>õ</td><td>&amp;#245;</td><td>small o, tilde</td><td>%F5</td><td>p:before { content:"\00f5"; }</td><td onclick="alert(&quot;\365&quot;)">alert("\365");</td></tr><tr><td>&amp;ouml;</td><td>ö</td><td>&amp;#246;</td><td>small o, dieresis or umlaut mark</td><td>%F6</td><td>p:before { content:"\00f6"; }</td><td onclick="alert(&quot;\366&quot;)">alert("\366");</td></tr><tr><td>&amp;divide;</td><td>÷</td><td>&amp;#247;</td><td>divide sign</td><td>%F7</td><td>p:before { content:"\00f7"; }</td><td onclick="alert(&quot;\367&quot;)">alert("\367");</td></tr><tr><td>&amp;oslash;</td><td>ø</td><td>&amp;#248;</td><td>small o, slash</td><td>%F8</td><td>p:before { content:"\00f8"; }</td><td onclick="alert(&quot;\370&quot;)">alert("\370");</td></tr><tr><td>&amp;ugrave;</td><td>ù</td><td>&amp;#249;</td><td>small u, grave accent</td><td>%F9</td><td>p:before { content:"\00f9"; }</td><td onclick="alert(&quot;\371&quot;)">alert("\371");</td></tr><tr><td>&amp;uacute;</td><td>ú</td><td>&amp;#250;</td><td>small u, acute accent</td><td>%FA</td><td>p:before { content:"\00fa"; }</td><td onclick="alert(&quot;\372&quot;)">alert("\372");</td></tr><tr><td>&amp;ucirc;</td><td>û</td><td>&amp;#251;</td><td>small u, circumflex accent</td><td>%FB</td><td>p:before { content:"\00fb"; }</td><td onclick="alert(&quot;\373&quot;)">alert("\373");</td></tr><tr><td>&amp;uuml;</td><td>ü</td><td>&amp;#252;</td><td>small u, dieresis or umlaut mark</td><td>%FC</td><td>p:before { content:"\00fc"; }</td><td onclick="alert(&quot;\374&quot;)">alert("\374");</td></tr><tr><td>&amp;yacute;</td><td>ý</td><td>&amp;#253;</td><td>small y, acute accent</td><td>%FD</td><td>p:before { content:"\00fd"; }</td><td onclick="alert(&quot;\375&quot;)">alert("\375");</td></tr><tr><td>&amp;thorn;</td><td>þ</td><td>&amp;#254;</td><td>small thorn, Icelandic</td><td>%FE</td><td>p:before { content:"\00fe"; }</td><td onclick="alert(&quot;\376&quot;)">alert("\376");</td></tr><tr><td>&amp;yuml;</td><td>ÿ</td><td>&amp;#255;</td><td>small y, dieresis or umlaut mark</td><td>%FF</td><td>p:before { content:"\00ff"; }</td><td onclick="alert(&quot;\377&quot;)">alert("\377");</td></tr></tbody></table><h3>Latin Extended-A</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;OElig;</td><td>Œ</td><td>&amp;#338;</td><td>latin capital ligature oe</td><td>u+0152 ISOlat2</td><td>p:before { content:"\0152"; }</td><td onclick="alert(&quot;\u0152&quot;)">alert("\u0152");</td></tr><tr><td>&amp;oelig;</td><td>œ</td><td>&amp;#339;</td><td>latin small ligature oe<br />(ligature is a misnomer, this is a separate character in some languages)</td><td>u+0153 ISOlat2</td><td>p:before { content:"\0153"; }</td><td onclick="alert(&quot;\u0152&quot;)">alert("\u0153");</td></tr><tr><td>&amp;Scaron;</td><td>Š</td><td>&amp;#352;</td><td>latin capital letter s with caron</td><td>u+0160 ISOlat2</td><td>p:before { content:"\0160"; }</td><td onclick="alert(&quot;\u0160&quot;)">alert("\u0160");</td></tr><tr><td>&amp;scaron;</td><td>š</td><td>&amp;#353;</td><td>latin small letter s with caron</td><td>u+0161 ISOlat2</td><td>p:before { content:"\0161"; }</td><td onclick="alert(&quot;\u0161&quot;)">alert("\u0161");</td></tr><tr><td>&amp;Yuml;</td><td>Ÿ</td><td>&amp;#376;</td><td>latin capital letter y with diaeresis</td><td>u+0178 ISOlat2</td><td>p:before { content:"\0178"; }</td><td onclick="alert(&quot;\u0178&quot;)">alert("\u0178");</td></tr></tbody></table><h3>Latin Extended-B</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;fnof;</td><td>ƒ</td><td>&amp;#402;</td><td>latin small f with hook, a.k.a. function, a.k.a. florin</td><td>u+0192 ISOtech</td><td>p:before { content:"\0192"; }</td><td onclick="alert(&quot;\u0192&quot;)">alert("\u0192");</td></tr></tbody></table><h3>Spacing Modifier Letters</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;circ;</td><td>ˆ</td><td>modifier letter circumflex accent</td><td>u+02C6 ISOpub</td><td>p:before { content:"\02c6"; }</td><td onclick="alert(&quot;\u02c6&quot;)">alert("\u02c6");</td></tr><tr><td>&amp;tilde;</td><td>˜</td><td>small tilde</td><td>u+02DC ISOdia</td><td>p:before { content:"\02dc"; }</td><td onclick="alert(&quot;\u02dc&quot;)">alert("\u02dc");</td></tr></tbody></table><h3>Greek</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;Alpha;</td><td>Α</td><td>&amp;#913;</td><td>greek capital letter alpha</td><td>u+0391</td><td>p:before { content:"\0391"; }</td><td onclick="alert(&quot;\u0391&quot;)">alert("\u0391");</td></tr><tr><td>&amp;Beta;</td><td>Β</td><td>&amp;#914;</td><td>greek capital letter beta</td><td>u+0392</td><td>p:before { content:"\0392"; }</td><td onclick="alert(&quot;\u0392&quot;)">alert("\u0392");</td></tr><tr><td>&amp;Gamma;</td><td>Γ</td><td>&amp;#915;</td><td>greek capital letter gamma</td><td>u+0393 ISOgrk3</td><td>p:before { content:"\0393"; }</td><td onclick="alert(&quot;\u0393&quot;)">alert("\u0395");</td></tr><tr><td>&amp;Delta;</td><td>Δ</td><td>&amp;#916;</td><td>greek capital letter delta</td><td>u+0394 ISOgrk3</td><td>p:before { content:"\0394"; }</td><td onclick="alert(&quot;\u0394&quot;)">alert("\u0394");</td></tr><tr><td>&amp;Epsilon;</td><td>Ε</td><td>&amp;#917;</td><td>greek capital letter epsilon</td><td>u+0395</td><td>p:before { content:"\0395"; }</td><td onclick="alert(&quot;\u0395&quot;)">alert("\u0395");</td></tr><tr><td>&amp;Zeta;</td><td>Ζ</td><td>&amp;#918;</td><td>greek capital letter zeta</td><td>u+0396</td><td>p:before { content:"\0396"; }</td><td onclick="alert(&quot;\u0396&quot;)">alert("\u0396");</td></tr><tr><td>&amp;Eta ;</td><td>Η</td><td>&amp;#919;</td><td>greek capital letter eta</td><td>u+0397</td><td>p:before { content:"\0397"; }</td><td onclick="alert(&quot;\u0397&quot;)">alert("\u0397");</td></tr><tr><td>&amp;Theta;</td><td>Θ</td><td>&amp;#920;</td><td>greek capital letter theta</td><td>u+0398 ISOgrk3</td><td>p:before { content:"\0398"; }</td><td onclick="alert(&quot;\u0398&quot;)">alert("\u0398");</td></tr><tr><td>&amp;Iota;</td><td>Ι</td><td>&amp;#921;</td><td>greek capital letter iota</td><td>u+0399</td><td>p:before { content:"\0399"; }</td><td onclick="alert(&quot;\u0399&quot;)">alert("\u0399");</td></tr><tr><td>&amp;Kappa;</td><td>Κ</td><td>&amp;#922;</td><td>greek capital letter kappa</td><td>u+039A</td><td>p:before { content:"\039a"; }</td><td onclick="alert(&quot;\u039a&quot;)">alert("\u039a");</td></tr><tr><td>&amp;Lambda;</td><td>Λ</td><td>&amp;#923;</td><td>greek capital letter lambda</td><td>u+039B ISOgrk3</td><td>p:before { content:"\039b"; }</td><td onclick="alert(&quot;\u039b&quot;)">alert("\u039b");</td></tr><tr><td>&amp;Mu  ;</td><td>Μ</td><td>&amp;#924;</td><td>greek capital letter mu</td><td>u+039C</td><td>p:before { content:"\039c"; }</td><td onclick="alert(&quot;\u039c&quot;)">alert("\u039c");</td></tr><tr><td>&amp;Nu  ;</td><td>Ν</td><td>&amp;#925;</td><td>greek capital letter nu</td><td>u+039D</td><td>p:before { content:"\039d"; }</td><td onclick="alert(&quot;\u039D&quot;)">alert("\u039D");</td></tr><tr><td>&amp;Xi  ;</td><td>Ξ</td><td>&amp;#926;</td><td>greek capital letter xi</td><td>u+039E ISOgrk3</td><td>p:before { content:"\039e"; }</td><td onclick="alert(&quot;\u039e&quot;)">alert("\u039e");</td></tr><tr><td>&amp;Omicron;</td><td>Ο</td><td>&amp;#927;</td><td>greek capital letter omicron</td><td>u+039F</td><td>p:before { content:"\039f"; }</td><td onclick="alert(&quot;\u039f&quot;)">alert("\u039f");</td></tr><tr><td>&amp;Pi  ;</td><td>Π</td><td>&amp;#928;</td><td>greek capital letter pi</td><td>u+03A0 ISOgrk3</td><td>p:before { content:"\03a0"; }</td><td onclick="alert(&quot;\u03a0&quot;)">alert("\u03a0");</td></tr><tr><td>&amp;Rho ;</td><td>Ρ</td><td>&amp;#929;</td><td>greek capital letter rho</td><td>u+03A1</td><td>p:before { content:"\03a1"; }</td><td onclick="alert(&quot;\u03a1&quot;)">alert("\u03a1");</td></tr><tr><td colspan="7">there is no Sigmaf, and no u+03A2 character either)</td></tr><tr><td>&amp;Sigma;</td><td>Σ</td><td>&amp;#931;</td><td>greek capital letter sigma</td><td>u+03A3 ISOgrk3</td><td>p:before { content:"\03a3"; }</td><td onclick="alert(&quot;\u03a3&quot;)">alert("\u03A3");</td></tr><tr><td>&amp;Tau ;</td><td>Τ</td><td>&amp;#932;</td><td>greek capital letter tau</td><td>u+03A4</td><td>p:before { content:"\03a4"; }</td><td onclick="alert(&quot;\u03A4&quot;)">alert("\u03A4");</td></tr><tr><td>&amp;Upsilon;</td><td>Υ</td><td>&amp;#933;</td><td>greek capital letter upsilon</td><td>u+03A5 ISOgrk3</td><td>p:before { content:"\03a5"; }</td><td onclick="alert(&quot;\u03A5&quot;)">alert("\u03A5");</td></tr><tr><td>&amp;Phi ;</td><td>Φ</td><td>&amp;#934;</td><td>greek capital letter phi</td><td>u+03A6 ISOgrk3</td><td>p:before { content:"\03a6"; }</td><td onclick="alert(&quot;\u03A6&quot;)">alert("\u03A6");</td></tr><tr><td>&amp;Chi ;</td><td>Χ</td><td>&amp;#935;</td><td>greek capital letter chi</td><td>u+03A7</td><td>p:before { content:"\03a7"; }</td><td onclick="alert(&quot;\u03A7&quot;)">alert("\u03A7");</td></tr><tr><td>&amp;Psi ;</td><td>Ψ</td><td>&amp;#936;</td><td>greek capital letter psi</td><td>u+03A8 ISOgrk3</td><td>p:before { content:"\03a8"; }</td><td onclick="alert(&quot;\u03A8&quot;)">alert("\u03A8");</td></tr><tr><td>&amp;Omega;</td><td>Ω</td><td>&amp;#937;</td><td>greek capital letter omega</td><td>u+03A9 ISOgrk3</td><td>p:before { content:"\03a9"; }</td><td onclick="alert(&quot;\u03A9&quot;)">alert("\u03A9");</td></tr><tr><td>&amp;alpha;</td><td>α</td><td>&amp;#945;</td><td>greek small letter alpha</td><td>u+03B1 ISOgrk3</td><td>p:before { content:"\03b1"; }</td><td onclick="alert(&quot;\u03b1&quot;)">alert("\u03b1");</td></tr><tr><td>&amp;beta;</td><td>β</td><td>&amp;#946;</td><td>greek small letter beta</td><td>u+03B2 ISOgrk3</td><td>p:before { content:"\03b2"; }</td><td onclick="alert(&quot;\u03b2&quot;)">alert("\u03b2");</td></tr><tr><td>&amp;gamma;</td><td>γ</td><td>&amp;#947;</td><td>greek small letter gamma</td><td>u+03B3 ISOgrk3</td><td>p:before { content:"\03b3"; }</td><td onclick="alert(&quot;\u03b3&quot;)">alert("\u03b3");</td></tr><tr><td>&amp;delta;</td><td>δ</td><td>&amp;#948;</td><td>greek small letter delta</td><td>u+03B4 ISOgrk3</td><td>p:before { content:"\03b4"; }</td><td onclick="alert(&quot;\u03b4&quot;)">alert("\u03b4");</td></tr><tr><td>&amp;epsilon;</td><td>ε</td><td>&amp;#949;</td><td>greek small letter epsilon</td><td>u+03B5 ISOgrk3</td><td>p:before { content:"\03b5"; }</td><td onclick="alert(&quot;\u03b5&quot;)">alert("\u03b5");</td></tr><tr><td>&amp;zeta;</td><td>ζ</td><td>&amp;#950;</td><td>greek small letter zeta</td><td>u+03B6 ISOgrk3</td><td>p:before { content:"\03b6"; }</td><td onclick="alert(&quot;\u03b6&quot;)">alert("\u03b6");</td></tr><tr><td>&amp;eta ;</td><td>η</td><td>&amp;#951;</td><td>greek small letter eta</td><td>u+03B7 ISOgrk3</td><td>p:before { content:"\03b7"; }</td><td onclick="alert(&quot;\u03b7&quot;)">alert("\u03b7");</td></tr><tr><td>&amp;theta;</td><td>θ</td><td>&amp;#952;</td><td>greek small letter theta</td><td>u+03B8 ISOgrk3</td><td>p:before { content:"\03b8"; }</td><td onclick="alert(&quot;\u03b8&quot;)">alert("\u03b8");</td></tr><tr><td>&amp;iota;</td><td>ι</td><td>&amp;#953;</td><td>greek small letter iota</td><td>u+03B9 ISOgrk3</td><td>p:before { content:"\03b9"; }</td><td onclick="alert(&quot;\u03b9&quot;)">alert("\u03b9");</td></tr><tr><td>&amp;kappa;</td><td>κ</td><td>&amp;#954;</td><td>greek small letter kappa</td><td>u+03BA ISOgrk3</td><td>p:before { content:"\03ba"; }</td><td onclick="alert(&quot;\u03ba&quot;)">alert("\u03ba");</td></tr><tr><td>&amp;lambda;</td><td>λ</td><td>&amp;#955;</td><td>greek small letter lambda</td><td>u+03BB ISOgrk3</td><td>p:before { content:"\03bb"; }</td><td onclick="alert(&quot;\u03bb&quot;)">alert("\u03bb");</td></tr><tr><td>&amp;mu  ;</td><td>μ</td><td>&amp;#956;</td><td>greek small letter mu</td><td>u+03BC ISOgrk3</td><td>p:before { content:"\03bc"; }</td><td onclick="alert(&quot;\u03bc&quot;)">alert("\u03bc");</td></tr><tr><td>&amp;nu  ;</td><td>ν</td><td>&amp;#957;</td><td>greek small letter nu</td><td>u+03BD ISOgrk3</td><td>p:before { content:"\03bd"; }</td><td onclick="alert(&quot;\u03bd&quot;)">alert("\u03bd");</td></tr><tr><td>&amp;xi  ;</td><td>ξ</td><td>&amp;#958;</td><td>greek small letter xi</td><td>u+03BE ISOgrk3</td><td>p:before { content:"\03be"; }</td><td onclick="alert(&quot;\u03be&quot;)">alert("\u03be");</td></tr><tr><td>&amp;omicron;</td><td>ο</td><td>&amp;#959;</td><td>greek small letter omicron</td><td>u+03BF NEW</td><td>p:before { content:"\03bf"; }</td><td onclick="alert(&quot;\u03bf&quot;)">alert("\u03bf");</td></tr><tr><td>&amp;pi  ;</td><td>π</td><td>&amp;#960;</td><td>greek small letter pi</td><td>u+03C0 ISOgrk3</td><td>p:before { content:"\03c0"; }</td><td onclick="alert(&quot;\u03c0&quot;)">alert("\u03c0");</td></tr><tr><td>&amp;rho ;</td><td>ρ</td><td>&amp;#961;</td><td>greek small letter rho</td><td>u+03C1 ISOgrk3</td><td>p:before { content:"\03c1"; }</td><td onclick="alert(&quot;\u03c1&quot;)">alert("\u03c1");</td></tr><tr><td>&amp;sigmaf;</td><td>ς</td><td>&amp;#962;</td><td>greek small letter final sigma</td><td>u+03C2 ISOgrk3</td><td>p:before { content:"\03C2"; }</td><td onclick="alert(&quot;\u03c2&quot;)">alert("\u03c2");</td></tr><tr><td>&amp;sigma;</td><td>σ</td><td>&amp;#963;</td><td>greek small letter sigma</td><td>u+03C3 ISOgrk3</td><td>p:before { content:"\03C3"; }</td><td onclick="alert(&quot;\u03c3&quot;)">alert("\u03c3");</td></tr><tr><td>&amp;tau ;</td><td>τ</td><td>&amp;#964;</td><td>greek small letter tau</td><td>u+03C4 ISOgrk3</td><td>p:before { content:"\03C4"; }</td><td onclick="alert(&quot;\u03c4&quot;)">alert("\u03c4");</td></tr><tr><td>&amp;upsilon;</td><td>υ</td><td>&amp;#965;</td><td>greek small letter upsilon</td><td>u+03C5 ISOgrk3</td><td>p:before { content:"\03C5"; }</td><td onclick="alert(&quot;\u03c5&quot;)">alert("\u03c5");</td></tr><tr><td>&amp;phi ;</td><td>φ</td><td>&amp;#966;</td><td>greek small letter phi</td><td>u+03C6 ISOgrk3</td><td>p:before { content:"\03C6"; }</td><td onclick="alert(&quot;\u03c6&quot;)">alert("\03c6");</td></tr><tr><td>&amp;chi ;</td><td>χ</td><td>&amp;#967;</td><td>greek small letter chi</td><td>u+03C7 ISOgrk3</td><td>p:before { content:"\03C7"; }</td><td onclick="alert(&quot;\u03c7&quot;)">alert("\u03c7");</td></tr><tr><td>&amp;psi ;</td><td>ψ</td><td>&amp;#968;</td><td>greek small letter psi</td><td>u+03C8 ISOgrk3</td><td>p:before { content:"\03C8"; }</td><td onclick="alert(&quot;\u03c8&quot;)">alert("\u03c8");</td></tr><tr><td>&amp;omega;</td><td>ω</td><td>&amp;#969;</td><td>greek small letter omega</td><td>u+03C9 ISOgrk3</td><td>p:before { content:"\03C9"; }</td><td onclick="alert(&quot;\u03c9&quot;)">alert("\u03c9");</td></tr><tr><td>&amp;thetasym;</td><td>ϑ</td><td>&amp;#977;</td><td>greek small letter theta symbol</td><td>u+03D1 NEW</td><td>p:before { content:"\03D1"; }</td><td onclick="alert(&quot;\u03D1&quot;)">alert("\u03D1");</td></tr><tr><td>&amp;upsih;</td><td>ϒ</td><td>&amp;#978;</td><td>greek upsilon with hook symbol</td><td>u+03D2 NEW</td><td>p:before { content:"\03D2"; }</td><td onclick="alert(&quot;\u03D2&quot;)">alert("\u03D2");</td></tr><tr><td>&amp;piv ;</td><td>ϖ</td><td>&amp;#982;</td><td>greek pi symbol</td><td>u+03D6 ISOgrk3</td><td>p:before { content:"\03D6"; }</td><td onclick="alert(&quot;\u03D6&quot;)">alert("\u03D6");</td></tr></tbody></table><h3>Punctuation</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;ensp;</td><td> </td><td>&amp;#8194;</td><td>en space</td><td>u+2002 ISOpub</td><td>p:before { content:"\2002";}</td><td onclick="alert(&quot;\u2002&quot;)">alert("\u2002");</td></tr><tr><td>&amp;emsp;</td><td> </td><td>&amp;#8195;</td><td>em space</td><td>u+2003 ISOpub</td><td>p:before { content:"\2003";}</td><td onclick="alert(&quot;\u2003&quot;)">alert("\u2003");</td></tr><tr><td>&amp;thinsp;</td><td> </td><td>&amp;#8201;</td><td>thin space</td><td>u+2009 ISOpub</td><td>p:before { content:"\2009";}</td><td onclick="alert(&quot;\u2009&quot;)">alert("\u2009");</td></tr><tr><td>&amp;zwnj;</td><td>‌</td><td>&amp;#8204;</td><td>zero width non-joiner</td><td>u+200C NEW RFC 2070</td><td>p:before { content:"\200C";}</td><td onclick="alert(&quot;\u200C&quot;)">alert("\u200C");</td></tr><tr><td>&amp;zwj;</td><td>‍</td><td>&amp;#8205;</td><td>zero width joiner</td><td>u+200D NEW RFC 2070</td><td>p:before { content:"\200D";}</td><td onclick="alert(&quot;\u200d&quot;)">alert("\u200d");</td></tr><tr><td>&amp;lrm;</td><td>‎</td><td>&amp;#8206;</td><td>left-to-right mark</td><td>u+200E NEW RFC 2070</td><td>p:before { content:"\200E";}</td><td onclick="alert(&quot;\u200e&quot;)">alert("\u200e");</td></tr><tr><td>&amp;rlm;</td><td>‏</td><td>&amp;#8207;</td><td>right-to-left mark</td><td>u+200F NEW RFC 2070</td><td>p:before { content:"\200F";}</td><td onclick="alert(&quot;\u200f&quot;)">alert("\u200f");</td></tr><tr><td>&amp;ndash;</td><td>–</td><td>&amp;#8211;</td><td>en dash</td><td>u+2013 ISOpub</td><td>p:before { content:"\2013";}</td><td onclick="alert(&quot;\u2013&quot;)">alert("\u2013");</td></tr><tr><td>&amp;mdash;</td><td>—</td><td>&amp;#8212;</td><td>em dash</td><td>u+2014 ISOpub</td><td>p:before { content:"\2014";}</td><td onclick="alert(&quot;\u2014&quot;)">alert("\u2014");</td></tr><tr><td>&amp;lsquo;</td><td>‘</td><td>&amp;#8216;</td><td>left single quotation mark</td><td>u+2018 ISOnum</td><td>p:before { content:"\2018";}</td><td onclick="alert(&quot;\u2018&quot;)">alert("\u2018");</td></tr><tr><td>&amp;rsquo;</td><td>’</td><td>&amp;#8217;</td><td>right single quotation mark</td><td>u+2019 ISOnum</td><td>p:before { content:"\2019";}</td><td onclick="alert(&quot;\u2019&quot;)">alert("\u2019");</td></tr><tr><td>&amp;sbquo;</td><td>‚</td><td>&amp;#8218;</td><td>single low-9 quotation mark</td><td>u+201A NEW</td><td>p:before { content:"\201A";}</td><td onclick="alert(&quot;\u201a&quot;)">alert("\u201a");</td></tr><tr><td>&amp;ldquo;</td><td>“</td><td>&amp;#8220;</td><td>left double quotation mark</td><td>u+201C ISOnum</td><td>p:before { content:"\201C";}</td><td onclick="alert(&quot;\u201c&quot;)">alert("\u201c");</td></tr><tr><td>&amp;rdquo;</td><td>”</td><td>&amp;#8221;</td><td>right double quotation mark</td><td>u+201D ISOnum</td><td>p:before { content:"\201D";}</td><td onclick="alert(&quot;\u201d&quot;)">alert("\u201d");</td></tr><tr><td>&amp;bdquo;</td><td>„</td><td>&amp;#8222;</td><td>double low-9 quotation mark</td><td>u+201E NEW</td><td>p:before { content:"\201E";}</td><td onclick="alert(&quot;\u201e&quot;)">alert("\u201e");</td></tr><tr><td>&amp;dagger;</td><td>†</td><td>&amp;#8224;</td><td>dagger</td><td>u+2020 ISOpub</td><td>p:before { content:"\2020";}</td><td onclick="alert(&quot;\u2020&quot;)">alert("\u2020");</td></tr><tr><td>&amp;Dagger;</td><td>‡</td><td>&amp;#8225;</td><td>double dagger</td><td>u+2021 ISOpub</td><td>p:before { content:"\2021";}</td><td onclick="alert(&quot;\u2021&quot;)">alert("\u2021");</td></tr><tr><td>&amp;permil;</td><td>‰</td><td>&amp;#8240;</td><td>per mille sign</td><td>u+2030 ISOtech</td><td>p:before { content:"\2030";}</td><td onclick="alert(&quot;\u2030&quot;)">alert("\u2030");</td></tr><tr><td>&amp;lsaquo;</td><td>‹</td><td>&amp;#8249;</td><td>single left-pointing angle quotation mark<br />(lsaquo is proposed but not yet ISO standardised)</td><td>u+2039 ISO proposed</td><td>p:before { content:"\2039";}</td><td onclick="alert(&quot;\u2039&quot;)">alert("\u2039");</td></tr><tr><td>&amp;rsaquo;</td><td>›</td><td>&amp;#8250;</td><td>single right-pointing angle quotation mark<br />rsaquo is proposed but not yet ISO standardised</td><td>u+203A ISO proposed</td><td>p:before { content:"\203A";}</td><td onclick="alert(&quot;\u203a&quot;)">alert("\u203a");</td></tr></tbody></table><p class="entities">General Punctuation</p><table class="table table-striped entities_num"><tbody><tr><td>&amp;bull;</td><td>•</td><td>&amp;#8226;</td><td>bullet, a.k.a. black small circle<br />bullet is NOT the same as bullet operator — u+2219</td><td>u+2022 ISOpub</td><td onclick="alert(&quot;\u2219&quot;)">alert("\u2219");</td></tr><tr><td>&amp;hellip;</td><td>…</td><td>&amp;#8230;</td><td>horizontal ellipsis, a.k.a. three dot leader</td><td>u+2026 ISOpub</td><td onclick="alert(&quot;\u2026&quot;)">alert("\u2026");</td></tr><tr><td>&amp;prime;</td><td>′</td><td>&amp;#8242;</td><td>prime, a.k.a. minutes, a.k.a. feet</td><td>u+2032 ISOtech</td><td onclick="alert(&quot;\u2032&quot;)">alert("\u2032");</td></tr><tr><td>&amp;Prime;</td><td>″</td><td>&amp;#8243;</td><td>double prime, a.k.a. seconds, a.k.a. inches</td><td>u+2033 ISOtech</td><td onclick="alert(&quot;\u2033&quot;)">alert("\u2033");</td></tr><tr><td>&amp;oline;</td><td>‾</td><td>&amp;#8254;</td><td>overline, a.k.a. spacing overscore</td><td>u+203E NEW</td><td onclick="alert(&quot;\u203e&quot;)">alert("\u203e");</td></tr><tr><td>&amp;frasl;</td><td>⁄</td><td>&amp;#8260;</td><td>fraction slash</td><td>u+2044 NEW</td><td onclick="alert(&quot;\u8260&quot;)">alert("\u8260");</td></tr></tbody></table><h3>Letterlike Symbols</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;weierp;</td><td>℘</td><td>&amp;#8472;</td><td>script capital P, a.k.a. power set, a.k.a. Weierstrass p</td><td>u+2118 ISOamso</td><td onclick="alert(&quot;\u2118&quot;)">alert("\u2118");</td></tr><tr><td>&amp;image;</td><td>ℑ</td><td>&amp;#8465;</td><td>blackletter capital I, a.k.a. imaginary part</td><td>u+2111 ISOamso</td><td onclick="alert(&quot;\u2111&quot;)">alert("\u2111");</td></tr><tr><td>&amp;real;</td><td>ℜ</td><td>&amp;#8476;</td><td>blackletter capital R, a.k.a. real part symbol</td><td>u+211C ISOamso</td><td onclick="alert(&quot;\u211c&quot;)">alert("\u211c");</td></tr><tr><td>&amp;trade;</td><td>™</td><td>&amp;#8482;</td><td>trade mark sign</td><td>u+2122 ISOnum</td><td onclick="alert(&quot;\u2122&quot;)">alert("\u2122");</td></tr><tr><td>&amp;alefsym;</td><td>ℵ</td><td>&amp;#8501;</td><td>alef symbol, a.k.a. first transfinite cardinal<br />alef symbol is NOT the same as hebrew letter alef — u+05D0 although the same glyph<br />could be used to depict both characters</td><td>u+2135 NEW</td><td onclick="alert(&quot;\u&quot;)">alert("\u");</td></tr></tbody></table><h3>Arrows</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;larr;</td><td>←</td><td>&amp;#8592;</td><td>leftwards arrow</td><td>u+2190 ISOnum</td><td onclick="alert(&quot;\u2190&quot;)">alert("\u2190");</td></tr><tr><td>&amp;uarr;</td><td>↑</td><td>&amp;#8593;</td><td>upwards arrow</td><td>u+2191 ISOnum</td><td onclick="alert(&quot;\u2191&quot;)">alert("\u2191");</td></tr><tr><td>&amp;rarr;</td><td>→</td><td>&amp;#8594;</td><td>rightwards arrow</td><td>u+2192 ISOnum</td><td onclick="alert(&quot;\u2192&quot;)">alert("\u2192");</td></tr><tr><td>&amp;darr;</td><td>↓</td><td>&amp;#8595;</td><td>downwards arrow</td><td>u+2193 ISOnum</td><td onclick="alert(&quot;\u2193&quot;)">alert("\u2193");</td></tr><tr><td>&amp;harr;</td><td>↔</td><td>&amp;#8596;</td><td>left right arrow</td><td>u+2194 ISOamsa</td><td onclick="alert(&quot;\u2194&quot;)">alert("\u2194");</td></tr><tr><td>&amp;crarr;</td><td>↵</td><td>&amp;#8629;</td><td>downwards arrow with corner leftwards, a.k.a. carriage return</td><td>u+21B5 NEW</td><td onclick="alert(&quot;\u21b5&quot;)">alert("\u21b5");</td></tr><tr><td>&amp;lArr;</td><td>⇐</td><td>&amp;#8656;</td><td>leftwards double arrow<br />can be used for ‘is implied by’</td><td>u+21D0 ISOtech</td><td onclick="alert(&quot;\u21d0&quot;)">alert("\u21d0");</td></tr><tr><td>&amp;uArr;</td><td>⇑</td><td>&amp;#8657;</td><td>upwards double arrow</td><td>u+21D1 ISOamsa</td><td onclick="alert(&quot;\u21d1&quot;)">alert("\u21d1");</td></tr><tr><td>&amp;rArr;</td><td>⇒</td><td>&amp;#8658;</td><td>rightwards double arrow</td><td>u+21D2 ISOtech</td><td onclick="alert(&quot;\u21d2&quot;)">alert("\u21d2");</td></tr><tr><td>&amp;dArr;</td><td>⇓</td><td>&amp;#8659;</td><td>downwards double arrow</td><td>u+21D3 ISOamsa</td><td onclick="alert(&quot;\u21d3&quot;)">alert("\ud1d3");</td></tr><tr><td>&amp;hArr;</td><td>⇔</td><td>&amp;#8660;</td><td>left right double arrow</td><td>u+21D4 ISOamsa</td><td onclick="alert(&quot;\u21d4&quot;)">alert("\u21d4");</td></tr></tbody></table><h3>Mathematical Operators</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;forall;</td><td>∀</td><td>&amp;#8704;</td><td>for all</td><td>u+2200 ISOtech</td><td onclick="alert(&quot;\u2200&quot;)">alert("\u2200");</td></tr><tr><td>&amp;part;</td><td>∂</td><td>&amp;#8706;</td><td>partial differential</td><td>u+2202 ISOtech</td><td onclick="alert(&quot;\u2202&quot;)">alert("\u2202");</td></tr><tr><td>&amp;exist;</td><td>∃</td><td>&amp;#8707;</td><td>there exists</td><td>u+2203 ISOtech</td><td onclick="alert(&quot;\u2203&quot;)">alert("\u2203");</td></tr><tr><td>&amp;empty;</td><td>∅</td><td>&amp;#8709;</td><td>empty set, a.k.a. null set, a.k.a. diameter</td><td>u+2205 ISOamso</td><td onclick="alert(&quot;\u2205&quot;)">alert("\u2205");</td></tr><tr><td>&amp;nabla;</td><td>∇</td><td>&amp;#8711;</td><td>nabla, a.k.a. backward difference</td><td>u+2207 ISOtech</td><td onclick="alert(&quot;\u2207&quot;)">alert("\u2207");</td></tr><tr><td>&amp;isin;</td><td>∈</td><td>&amp;#8712;</td><td>element of</td><td>u+2208 ISOtech</td><td onclick="alert(&quot;\u2208&quot;)">alert("\u2208");</td></tr><tr><td>&amp;notin;</td><td>∉</td><td>&amp;#8713;</td><td>not an element of</td><td>u+2209 ISOtech</td><td onclick="alert(&quot;\u2209&quot;)">alert("\u2209");</td></tr><tr><td>&amp;ni  ;</td><td>∋</td><td>&amp;#8715;</td><td>contains as member</td><td>u+220B ISOtech</td><td onclick="alert(&quot;\u220b&quot;)">alert("\u220b");</td></tr><tr><td>&amp;prod;</td><td>∏</td><td>&amp;#8719;</td><td>n-ary product, a.k.a. product sign<br />prod is NOT the same character as u+03A0 ‘greek capital letter pi’ though the same<br />glyph might be used for both</td><td>u+220F ISOamsb</td><td onclick="alert(&quot;\u03a0&quot;)">alert("\u03a0");</td></tr><tr><td>&amp;sum ;</td><td>∑</td><td>&amp;#8721;</td><td>n-ary sumation<br />sum is NOT the same character as u+03A3 ‘greek capital letter sigma’ though the same<br />glyph might be used for both</td><td>u+2211 ISOamsb</td><td onclick="alert(&quot;\u03a3&quot;)">alert("\u03a3");</td></tr><tr><td>&amp;minus;</td><td>−</td><td>&amp;#8722;</td><td>minus sign</td><td>u+2212 ISOtech</td><td onclick="alert(&quot;\u2212&quot;)">alert("\u2212");</td></tr><tr><td>&amp;lowast;</td><td>∗</td><td>&amp;#8727;</td><td>asterisk operator</td><td>u+2217 ISOtech</td><td onclick="alert(&quot;\u2217&quot;)">alert("\u2217");</td></tr><tr><td>&amp;radic;</td><td>√</td><td>&amp;#8730;</td><td>square root, a.k.a. radical sign</td><td>u+221A ISOtech</td><td onclick="alert(&quot;\u221a&quot;)">alert("\u221a");</td></tr><tr><td>&amp;prop;</td><td>∝</td><td>&amp;#8733;</td><td>proportional to</td><td>u+221D ISOtech</td><td onclick="alert(&quot;\u221d&quot;)">alert("\u221d");</td></tr><tr><td>&amp;infin;</td><td>∞</td><td>&amp;#8734;</td><td>infinity</td><td>u+221E ISOtech</td><td onclick="alert(&quot;\u221e&quot;)">alert("\u221e");</td></tr><tr><td>&amp;ang ;</td><td>∠</td><td>&amp;#8736;</td><td>angle</td><td>u+2220 ISOamso</td><td onclick="alert(&quot;\u2220&quot;)">alert("\u2220");</td></tr><tr><td>&amp;and ;</td><td>⊥</td><td>&amp;#8869;</td><td>logical and, a.k.a. wedge</td><td>u+2227 ISOtech</td><td onclick="alert(&quot;\u2227&quot;)">alert("\u2227");</td></tr><tr><td>&amp;or  ;</td><td>⊦</td><td>&amp;#8870;</td><td>logical or, a.k.a. vee</td><td>u+2228 ISOtech</td><td onclick="alert(&quot;\u2228&quot;)">alert("\u2228");</td></tr><tr><td>&amp;cap ;</td><td>∩</td><td>&amp;#8745;</td><td>intersection, a.k.a. cap</td><td>u+2229 ISOtech</td><td onclick="alert(&quot;\u2229&quot;)">alert("\u2229");</td></tr><tr><td>&amp;cup ;</td><td>∪</td><td>&amp;#8746;</td><td>union, a.k.a. cup</td><td>u+222A ISOtech</td><td onclick="alert(&quot;\u222a&quot;)">alert("\u222a");</td></tr><tr><td>&amp;int ;</td><td>∫</td><td>&amp;#8747;</td><td>integral</td><td>u+222B ISOtech</td><td onclick="alert(&quot;\u222b&quot;)">alert("\u222b");</td></tr><tr><td>&amp;there4;</td><td>∴</td><td>&amp;#8756;</td><td>therefore</td><td>u+2234 ISOtech</td><td onclick="alert(&quot;\u2234&quot;)">alert("\u2234");</td></tr><tr><td>&amp;sim ;</td><td>∼</td><td>&amp;#8764;</td><td>tilde operator, a.k.a. varies with, <br />similar to tilde operator, but is NOT the same character as the tilde u+007E, <br />although the same  glyph might be used to represent both</td><td>u+223C ISOtech</td><td onclick="alert(&quot;\u223c&quot;)">alert("\u223c");</td></tr><tr><td>&amp;cong;</td><td>≅</td><td>&amp;#8773;</td><td>approximately equal to</td><td>u+2245 ISOtech</td><td onclick="alert(&quot;\u2245&quot;)">alert("\u2245");</td></tr><tr><td>&amp;asymp;</td><td>≈</td><td>&amp;#8776;</td><td>almost equal to, a.k.a. asymptotic to</td><td>u+2248 ISOamsr</td><td onclick="alert(&quot;\u2248&quot;)">alert("\u2248");</td></tr><tr><td>&amp;ne  ;</td><td>≠</td><td>&amp;#8800;</td><td>not equal to</td><td>u+2260 ISOtech</td><td onclick="alert(&quot;\u2260&quot;)">alert("\u2260");</td></tr><tr><td>&amp;equiv;</td><td>≡</td><td>&amp;#8801;</td><td>identical to</td><td>u+2261 ISOtech</td><td onclick="alert(&quot;\u2261&quot;)">alert("\u2261");</td></tr><tr><td>&amp;le  ;</td><td>≤</td><td>&amp;#8804;</td><td>less-than or equal to</td><td>u+2264 ISOtech</td><td onclick="alert(&quot;\u2264&quot;)">alert("\u2264");</td></tr><tr><td>&amp;ge  ;</td><td>≥</td><td>&amp;#8805;</td><td>greater-than or equal to</td><td>u+2265 ISOtech</td><td onclick="alert(&quot;\u2265&quot;)">alert("\u2265");</td></tr><tr><td>&amp;sub ;</td><td>⊂</td><td>&amp;#8834;</td><td>subset of</td><td>u+2282 ISOtech</td><td onclick="alert(&quot;\u2282&quot;)">alert("\u2282");</td></tr><tr><td>&amp;sup ;</td><td>⊃</td><td>&amp;#8835;</td><td>superset of<br />note that nsup, ‘not a superset of u+2283′ is not covered by the Symbol font<br />encoding and is not included.</td><td>u+2283 ISOtech</td><td onclick="alert(&quot;\u2283&quot;)">alert("\u2283");</td></tr><tr><td>&amp;nsub;</td><td>⊄</td><td>&amp;#8836;</td><td>not a subset of</td><td>u+2284 ISOamsn</td><td onclick="alert(&quot;\u2284&quot;)">alert("\u2284");</td></tr><tr><td>&amp;sube;</td><td>⊆</td><td>&amp;#8838;</td><td>subset of or equal to</td><td>u+2286 ISOtech</td><td onclick="alert(&quot;\u2286&quot;)">alert("\u2286");</td></tr><tr><td>&amp;supe;</td><td>⊇</td><td>&amp;#8839;</td><td>superset of or equal to</td><td>u+2287 ISOtech</td><td onclick="alert(&quot;\u2287&quot;)">alert("\u2287");</td></tr><tr><td>&amp;oplus;</td><td>⊕</td><td>&amp;#8853;</td><td>circled plus, a.k.a. direct sum</td><td>u+2295 ISOamsb</td><td onclick="alert(&quot;\u2295&quot;)">alert("\u2295");</td></tr><tr><td>&amp;otimes;</td><td>⊗</td><td>&amp;#8855;</td><td>circled times, a.k.a. vector product</td><td>u+2297 ISOamsb</td><td onclick="alert(&quot;\u2297&quot;)">alert("\u2297");</td></tr><tr><td>&amp;perp;</td><td>⊥</td><td>&amp;#8869;</td><td>up tack, a.k.a. orthogonal to, a.k.a. perpendicular</td><td>u+22A5 ISOtech</td><td onclick="alert(&quot;\u22a5&quot;)">alert("\u22a5");</td></tr><tr><td>&amp;sdot;</td><td>⋅</td><td>&amp;#8901;</td><td>dot operator<br />dot operator is NOT the same character as u+00B7 middle dot</td><td>u+22C5 ISOamsb</td><td onclick="alert(&quot;\u22c5&quot;)">alert("\u22c5");</td></tr></tbody></table><h3>Miscellaneous Technical</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;lceil;</td><td>⌈</td><td>&amp;#8968;</td><td>left ceiling, a.k.a. apl upstile</td><td>u+2308, ISOamsc</td><td onclick="alert(&quot;\u2308&quot;)">alert("\u2308");</td></tr><tr><td>&amp;rceil;</td><td>⌉</td><td>&amp;#8969;</td><td>right ceiling</td><td>u+2309, ISOamsc</td><td onclick="alert(&quot;\u2309&quot;)">alert("\u2309");</td></tr><tr><td>&amp;lfloor;</td><td>⌊</td><td>&amp;#8970;</td><td>left floor, a.k.a. apl downstile</td><td>u+230A, ISOamsc</td><td onclick="alert(&quot;\u230a&quot;)">alert("\u230a");</td></tr><tr><td>&amp;rfloor;</td><td>⌋</td><td>&amp;#8971;</td><td>right floor</td><td>u+230B, ISOamsc</td><td onclick="alert(&quot;\u230b&quot;)">alert("\u230b");</td></tr><tr><td>&amp;lang;</td><td>〈</td><td>&amp;#9001;</td><td>left-pointing angle bracket, a.k.a. bra<br />lang is NOT the same character as u+003C ‘less than’<br />or u+2039 ’single left-pointing angle quotation mark’</td><td>u+2329 ISOtech</td><td onclick="alert(&quot;\u2329&quot;)">alert("\u2329");</td></tr><tr><td>&amp;rang;</td><td>〉</td><td>&amp;#9002;</td><td>right-pointing angle bracket, a.k.a. ket<br />rang is NOT the same character as u+003E ‘greater than’<br />or u+203A ’single right-pointing angle quotation mark’</td><td>u+232A ISOtech</td><td onclick="alert(&quot;\u232a&quot;)">alert("\u232a");</td></tr></tbody></table><h3>Geometric Shapes</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;loz ;</td><td>◊</td><td>&amp;#9674;</td><td>lozenge</td><td>u+25CA ISOpub</td><td onclick="alert(&quot;\u25ca&quot;)">alert("\u25ca");</td></tr></tbody></table><h3>Miscellaneous Symbols</h3><table class="table table-striped entities_num"><tbody><tr><td>&amp;spades;</td><td>♠</td><td>&amp;#9824;</td><td>black spade suit</td><td>u+2660 ISOpub</td><td onclick="alert(&quot;\u2660&quot;)">alert("\u2660");</td></tr><tr><td>&amp;clubs;</td><td>♣</td><td>&amp;#9827;</td><td>black club suit, a.k.a. shamrock</td><td>u+2663 ISOpub</td><td onclick="alert(&quot;\u2663&quot;)">alert("\u2663");</td></tr><tr><td>&amp;hearts;</td><td>♥</td><td>&amp;#9829;</td><td>black heart suit, a.k.a. valentine</td><td>u+2665 ISOpub</td><td onclick="alert(&quot;\u2665&quot;)">alert("\u2665");</td></tr><tr><td>&amp;diams;</td><td>♦</td><td>&amp;#9830;</td><td>black diamond suit</td><td>u+2666 ISOpub</td><td onclick="alert(&quot;\u2666&quot;)">alert("\u2666");</td></tr></tbody></table>
			<h3>Подготовка текста</h3>
			<p>Очень частая ошибка начинающих&#160;&#8212; использование текстовых редакторов для верстки, тем более цветной. Действительно, современные пакеты для подготовки текстов, вроде MS Word, имеют множество избыточных функций (весьма полезных для офисной работы), создающих у&#160;неопытного пользователя иллюзию возможности их&#160;использования для полиграфических целей. Но&#160;это не&#160;так: вывод из MS Word может осуществляться только без цветоделения, без крестов и&#160;меток обреза. Если, без сомнения, чисто случайно в&#160;документ Word тайком сами вкрались иллюстрации, то изображение на&#160;выведенной пленке в&#160;большинстве случаев убедительно покажет, что лучше&#160;бы их&#160;там никогда не&#160;было. В&#160;конце концов, подобные приложения разрабатывались для проверки синтаксиса и&#160;расстановки мягких переносов, а не&#160;для работы с&#160;цветом, и MS Word&#160;&#8212; замечательная программа, но&#160;исключительно для набора сплошных текстов. Если&#160;предполагается этот текст далее использовать для верстки, то необходимо соблюдать следующие правила.</p>
			<h3>Правила</h3>
			<p>&#8226; Набор осуществляется через один пробел и не&#160;более чем через один перевод строки.<br />&#8226; Нельзя использовать таблицы и&#160;многоколоночный&#160;набор.<br />&#8226; Для выравнивания используйте табуляцию, но ни в&#160;коем случае не&#160;пробелы.<br />&#8226; Используйте только мягкие переносы, например, расставляемые пакетами типа Orfo; ни&#160;под каким видом нельзя расставлять жесткие переносы&#160;&#8212; пусть Вас не&#160;беспокоят неровные края текста, верстка все равно будет выполняться в&#160;другой программе.<br />&#8226; Если работа не&#160;будет передаваться на&#160;Macintosh, то при назначении атрибутов длинному тексту неплохо использовать стили&#160;&#8212; их&#160;могут прочитать некоторые программы верстки, что впоследствии позволит быстро изменять атрибуты шрифта, редактируя только сам&#160;стиль.<br />Лучше используйте MS Word 6&#160;&#8212; текст из&#160;его файлов смогут прочитать почти все полиграфические программы, кроме того, есть некоторая вероятность, что он&#160;может случайно оказаться в&#160;сервисном бюро, имеющем PC. Если&#160;там одни Маки, сохраните работу как текст MS&#8210;DOS, но ни в&#160;коем случае не&#160;как Word for&#160;Mac.<br />Здесь уместно напомнить о&#160;некоторых правилах, применяемых в&#160;типографской традиции.<br />&#8226; Кавычки в&#160;русском языке&#160;&#8212; это &#171;елочки&#187; и &#8222;лапки&#8220;, соответственно Alt+0171 / 0187&#160;и 0132&#160;/ 0147. Кавычки внутри кавычек должны различаться между собой рисунком: &#171;&#8230; &#8222;&#8230;&#8220; &#8230;&#187;. &#171;Елочки&#187; предпочтительнее в&#160;газетном и&#160;журнальном наборе, а &#8222;лапки&#8220;&#160;&#8212; для детских изданий и&#160;рукописных шрифтов.<br />В английском языке&#160;&#8212; &#8216;&#8230;&#8217; и &#8220;&#8230;&#8221;, соответственно Alt+0145 / 0146&#160;и 0147&#160;/ 0148.<br />В немецком языке&#160;&#8212; &#187;&#8230;&#171; и &#8220;&#8230;&#8221;. В&#160;любом случае использование иноязычных кавычек, смена следования открывающей и&#160;закрывающей кавычек, а&#160;тем более использование в их&#160;качестве знака дюйма (&quot;) является грубейшей ошибкой.<br />&#8226; В качестве многоточия (&#8230;) лучше использовать специальный символ (вводится Alt+0133), а не&#160;три точки. Многоточие от&#160;слова не&#160;отделяется.<br />&#8226; Точка не&#160;ставится в&#160;заголовке и&#160;подзаголовке, если он&#160;отделен от&#160;текста, в&#160;конце подписи под рисунком, в&#160;заголовке таблицы и&#160;внутри&#160;нее.<br />&#8226; Если скобка завершает предложение, точку ставят после нее. Если&#160;точка необходима внутри скобки, то снаружи ее&#160;уже не&#160;ставят.<br />&#8226; Не отбиваются пробелом от&#160;предшествующего слова или цифры точка, запятая, двоеточие, точка с&#160;запятой, вопросительный и&#160;восклицательный знаки, знак процента, градуса, минуты, секунды.<br />&#8226; Символы &#171;номер&#187; и &#171;параграф&#187; отбиваются от&#160;идущей за&#160;ними цифры узким неразрывным пробелом. Если&#160;они удваиваются, то не&#160;отбиваются друг от&#160;друга.<br />&#8226; Дроби не&#160;отбивают от&#160;целой части (1,5), как и&#160;математические знаки (-3+2) и&#160;обозначения степени. Размерность от&#160;числа отбивают неразрывным пробелом (5 мм).<br />Для улучшения удобочитаемости длинные числа разбиваются неразрывным пробелом по три цифры: 1&#160;234&#160;567.<br />Разделитель дроби в&#160;русском языке&#160;&#8212; запятая, в&#160;английском&#160;&#8212; точка. Сейчас это не&#160;очень принципиально (правила языка со&#160;временем постоянно изменяются), но, во&#160;всяком случае в&#160;тексте необходимо использовать однотипное разделение.&#8226; Инициалы друг от&#160;друга отбивают узким неразрывным пробелом, а от&#160;фамилий&#160;&#8212; обычным неразрывным пробелом.<br />&#8226; Кавычки и&#160;скобки набираются вплотную к&#160;слову без пробелов.<br />&#8226; Абзацные отступы должны быть одинаковыми во&#160;всем издании.<br />&#8226; Если абзацный отступ не&#160;используется, последняя строка, желательно, должна быть неполной.<br />&#8226; Последняя строка абзаца должна быть не&#160;короче двух размеров высота шрифта и не&#160;меньше абзацного отступа (обычно 4&#8211;5 знаков).<br />&#8226; Затрудняют чтение и&#160;некрасиво выглядят вертикальные и&#160;наклонные коридоры из&#160;пробелов, допустимая длина коридора&#160;&#8212; не&#160;более четырех&#160;строк.<br />&#8226; Заканчивать переносами желательно не&#160;более трех строк подряд. Во&#160;флаговом наборе два переноса подряд недопустимы.<br />&#8226; Если абзац переносится в&#160;следующую колонку текста или на&#160;следующую страницу, не&#160;следует оставлять внизу одну строку или переносить последнюю строку в&#160;начало следующей колонки.<br />&#8226; Буква, в&#160;алфавите следующая за &#171;е&#187;, используется при наборе детских изданий, имен, фамилий, географических названий. В&#160;остальных случаях, для улучшения удобочитаемости, она обычно опускается.<br />&#8226; В качестве тире используется M&#8210;тире (Alt+0151) (тире с&#160;шириной знака &#171;M&#187;) которое отбивается узкими пробелами: &#171;это&#160;&#8212; он&#187;. Тире&#160;не&#160;должно быть в&#160;начале строки, за&#160;исключением прямой речи. При&#160;задании диапазона изменения используется N&#8210;тире (Alt+0150) без отбивки пробелами: &#171;20&#8211;30&#187;, &#171;Москва&#8211;Петушки&#187;. Использование в&#160;этих случаях дефиса (-) также является грубейшей ошибкой.<br />&#8226; Не рекомендуется оставлять в&#160;конце строки односложные предлоги и&#160;союзы: в, и, на, и&#160;т.&#8239;п. Иногда делается весьма спорное исключение для газетной верстки, где по непонятной традиции используются слишком тесные колонки, идеальные для английского языка с&#160;его узкими буквами и&#160;короткими словами, но&#160;никак не&#160;подходящие для русского языка с&#160;его длинными словами и&#160;рядом широких литер. Это, скорее, проблема только дизайна конкретной газеты.<br />&#8226; Оптимальная ширина колонки текста: длина строки, выраженная в&#160;цицеро (12 пунктов), примерно вдвое больше кегля шрифта, выраженного в&#160;пунктах (например, колонка 20&#160;цицеро при кегле 10&#160;пунктов). Точная величина отношения зависит от&#160;рисунка шрифта, но в&#160;любом случае колонка оптимальной длины должна содержать 50&#8211;60 знаков.</p>
		</div>
		<span id="top-link-block" class="hidden">
			<a href="#top" class="well well-sm"  onclick="$('html,body').animate({scrollTop:0},'slow');return false;">
				<i class="glyphicon glyphicon-chevron-up"></i> Back to Top
			</a>
		</span>
		<script>
			(function(a){a&&a.markup.value&&a.markup.select()})(document.forms.typography_form||"");
		</script>
		<script src="//cdn.jsdelivr.net/jquery/3.1.0/jquery.min.js"></script>
		<script src="//cdn.jsdelivr.net/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		<script>
			/*!
			 * bootstrap top-link-block
			 */
			if ("undefined" !== typeof window.jQuery && "function" === typeof $.fn.affix) {
				if (($(window).height() + 100) < $(document).height()) {
					$('#top-link-block').removeClass('hidden').affix({
						offset : {
							top : 100
						}
					});
				}
			}
		</script>
	</body>
</html>
