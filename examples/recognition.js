const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = 'ru-RU';
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const slide = document.querySelector('#speech-recognition-api-demo-1');

slide.addEventListener('click', function() {
	recognition.start();
});

recognition.onresult = function(event) {
	const result = document.querySelector('#speech-recognition-api-demo-1 .result');

	const last = event.results.length - 1;
	const speech = event.results[last][0].transcript || '';
	console.log(speech.toLowerCase());

	switch(speech.toLowerCase()) {
		case 'кто не оптимизирует логотипы':
			result.classList.remove('result_yandex', 'result_chuck');
			result.classList.add('result_google');
			result.innerHTML = '';
			break;
		case 'кто оптимизирует':
			result.classList.remove('result_google', 'result_chuck');
			result.classList.add('result_yandex');
			result.innerHTML = '';
			break;
		case 'кто умеет считать до бесконечности':
			result.classList.remove('result_google', 'result_yandex');
			result.classList.add('result_chuck');
			result.innerHTML = '';
			break;
		default:
			result.classList.remove('result_yandex', 'result_google', 'result_chuck');
			result.innerHTML = 'Что, что, простите?';
	}
};

recognition.onspeechend = function() {
	recognition.stop();
};
