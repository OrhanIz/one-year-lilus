var btn = document.getElementById("heartTxt");
btn.style.opacity = 0;
var btnVal = 0;

var showTimeout;
var previewInterval;
var imgInterval;
var buttonInterval;

function renderMedia(src) {
	if (src.endsWith(".mp4")) {
		mediaBox.innerHTML = `
			<video id="img" autoplay muted playsinline>
				<source src="${src}" type="video/mp4">
				Your browser does not support the video tag.
			</video>
		`;
	} else {
		mediaBox.innerHTML = `<img id="img" src="${src}" alt="memory">`;
	}
}

function scheduleNext(delay) {
	clearTimeout(showTimeout);
	showTimeout = setTimeout(showImage, delay);
}

function showImage() {
	let current = imageArray[imageIndex];

	renderMedia(current);
	myTxt.innerHTML = txtArray[imageIndex];

	imageIndex++;
	if (imageIndex >= len) {
		imageIndex = 0;
	}

	if (!current.endsWith(".mp4")) {
		scheduleNext(3000);
		return;
	}

	let video = document.querySelector("#mediaBox video");

	if (video) {
		let fallbackUsed = false;

		const fallback = setTimeout(function () {
			fallbackUsed = true;
			scheduleNext(7000);
		}, 1200);

		video.onloadedmetadata = function () {
			if (fallbackUsed) return;
			clearTimeout(fallback);

			let durationMs = Math.floor(video.duration * 1000);

			if (!durationMs || isNaN(durationMs)) {
				durationMs = 7000;
			}

			durationMs = Math.max(5000, Math.min(durationMs, 12000));
			scheduleNext(durationMs);
		};

		video.onerror = function () {
			clearTimeout(fallback);
			scheduleNext(7000);
		};
	} else {
		scheduleNext(7000);
	}
}

function play() {
	let audio = document.getElementById("bgMusic");
	if (audio && audio.paused) {
		audio.play().catch(function(err) {
			console.log("Audio play blocked:", err);
		});
	}

	if (t == 0) {
		mediaBox.innerHTML = "";
		myTxt.innerHTML = "";
		imageIndex = 0;

		clearInterval(previewInterval);
		clearTimeout(showTimeout);
	}

	flag = 1 - flag;
	document.getElementById("typeDiv").style.opacity = flag;
	document.getElementById("imgTxt").style.opacity = 1 - flag;

	if (t == 0) {
		showImage();
	}
	t++;
}

function preshowImage() {
	document.getElementById("imgTxt").style.opacity = 0;
	renderMedia(imageArray[imageIndex]);
	myTxt.innerHTML = txtArray[imageIndex];

	imageIndex++;
	if (imageIndex >= len) {
		imageIndex = 0;
	}
}

function buttonFadeIn() {
	if (btnVal < 1) {
		btnVal += 0.025;
		btn.style.opacity = btnVal;
	} else {
		clearInterval(buttonInterval);
		if (ok == 3) {
			ok += 1;
		}
	}
}

function event() {
	previewInterval = setInterval(preshowImage, 100);

	imgInterval = setInterval(function () {
		if (ok == 3) {
			setTimeout(function () {
				buttonInterval = setInterval(buttonFadeIn, 50);
			}, 1500);
			clearInterval(imgInterval);
		}
	}, 50);
}

event();
