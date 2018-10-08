function BufferLoader(context, urlList, callback) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = [];
	this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	var loader = this;

	request.onload = function () {
		loader.context.decodeAudioData(
			request.response,
			function (buffer) {
				if (!buffer) {
					alert('error decoding file data: ' + url);
					return;
				}
				loader.bufferList[index] = buffer;
				if (++loader.loadCount == loader.urlList.length)
					loader.onload(loader.bufferList);
			}
		);
	};

	request.onerror = function () {
		alert('BufferLoader: XHR error');
	};

	request.send();
};

BufferLoader.prototype.load = function () {
	for (var i = 0; i < this.urlList.length; ++i)
		this.loadBuffer(this.urlList[i], i);
};

$(function () {
	var buffers, source, destination;
	var ctx = new AudioContext();
	var loader = new BufferLoader(ctx, [
		'examples/voice.mp3'
	], onLoadEnd);

	loader.load();

	function onLoadEnd(data) {
		buffers = data;
		destination = ctx.destination;

		$('body').addClass('ready');
	}

	function simple() {
		source = ctx.createBufferSource();
		source.buffer = buffers[0];

		source.connect(destination);
		source.start(0);
	}

	function echo() {
		source = ctx.createBufferSource();
		source.buffer = buffers[0];

		var gainNode = ctx.createGain();
		var delayNode = ctx.createDelay();

		gainNode.gain.value = Number($('.echo .gain-value').val());
		delayNode.delayTime.value = Number($('.echo .delay-value').val());

		source.connect(gainNode);
		gainNode.connect(delayNode);
		delayNode.connect(gainNode);
		gainNode.connect(destination);

		source.start(0);
	}

	function stop() {
		source.stop(0);
	}

	$('.simple .start').click(simple);
	$('.echo .start').click(echo);
	$('.stop').click(stop);
});
