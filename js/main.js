// запуск видео с gpu
(function () {
	const slides = [
		'#web-audio-api-modules-filter-live'
	];

	slides.forEach(slide => {
		const $slide = $(slide);
		const $video = $slide.find('video')[0];

		$slide.attrchange({
			trackValues: true,
			callback: function (event) {
				if (event.attributeName !== 'class')
					return;

				if (!/active/.test(event.newValue)) {
					$video.pause();
					$video.currentTime = 0;

					return;
				}

				// запускаем видео
				$video.play();
			}
		});
	});
}());
