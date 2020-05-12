var canvas;
var ctx;
var windowLoaded = false;
var earsImage;
var bodyImage;
var outlineImage;

window.onload = async function() {
  canvas = document.getElementById("render");
  ctx = canvas.getContext("2d");

  earsImage = await loadImage('./ears.png')
  bodyImage = await loadImage('./body.png')
  outlineImage = await loadImage('./outline.png')
  windowLoaded = true;
  console.log("Window finished loading")
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}


async function draw() {
	if (!windowLoaded) {
		window.requestAnimationFrame(draw)
		return;
	}
	let eyesType = parseInt(document.getElementById('eyesType').value);
	let mouthType = parseInt(document.getElementById('mouthType').value);
	
	let eyesImage = await loadImage(`./eyes/eyes.${eyesType.toString().padStart(3, '0')}.png`);
	let mouthImage = await loadImage(`./mouths/mouths.${mouthType.toString().padStart(3, '0')}.png`);

	let earsColor = document.getElementById('earsColor').value;
	let bodyColor = document.getElementById('bodyColor').value;

	ctx.drawImage(earsImage, 0, 0);
	ctx.globalAlpha = 1.0;
  ctx.drawImage(tintImage(earsImage, earsColor), 0, 0);

	ctx.drawImage(bodyImage, 0, 0);
	ctx.globalAlpha = 1.0;
  ctx.drawImage(tintImage(bodyImage, bodyColor), 0, 0);
	
	ctx.drawImage(outlineImage, 0, 0);

	let eyesXLocation = parseInt(document.getElementById('eyesXLocation').value);
	let eyesYLocation = parseInt(document.getElementById('eyesYLocation').value)+25;
	ctx.drawImage(eyesImage, 150+eyesXLocation, 150+eyesYLocation);

	let mouthXLocation = parseInt(document.getElementById('mouthXLocation').value);
	let mouthYLocation = parseInt(document.getElementById('mouthYLocation').value)+25;
	ctx.drawImage(mouthImage, 150+mouthXLocation, 250+mouthYLocation);

	window.requestAnimationFrame(draw)
};

function tintImage(img, color) {
	// create offscreen buffer, 
  buffer = document.createElement('canvas');
  buffer.width = img.width;
  buffer.height = img.height;
  bx = buffer.getContext('2d');

	// fill offscreen buffer with the tint color
  bx.fillStyle = color;
  bx.fillRect(0,0,buffer.width,buffer.height);

  // destination atop makes a result with an alpha channel identical to fg, but with all pixels retaining their original color *as far as I can tell*
  bx.globalCompositeOperation = "destination-atop";
  bx.drawImage(img,0,0);

  return buffer;
}

document.getElementById('downloadButton').onclick = function(button) {
	var image = canvas.toDataURL("image/png");
  button.href = image;
};

window.requestAnimationFrame(draw)