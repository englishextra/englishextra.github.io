var myMap;
// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);
function init() {
	// Создание экземпляра карты и его привязка к контейнеру с
	// заданным id ("map").
	myMap = new ymaps.Map('map', {
			// При инициализации карты обязательно нужно указать
			// её центр и коэффициент масштабирования.
			center : [55.841608306208684, 37.45720129160105], // Москва
			zoom : 16
		}, {
			searchControlProvider : 'yandex#search'
		});
	// document.getElementById('destroyButton').onclick = function () {
		// Для уничтожения используется метод destroy.
		// myMap.destroy();
	// };
}
