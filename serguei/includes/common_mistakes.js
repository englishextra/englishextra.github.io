/*!
 * developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
 */
self.onmessage = function (event) {
	if (event.data === "Hello") {
		try {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "common_mistakes.html", false);
			xhr.send(null);
			self.postMessage(xhr.responseText);
		} catch (e) {
			self.postMessage("Can't find file for inclusion");
		}
	}
};