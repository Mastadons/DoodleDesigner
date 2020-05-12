const imageHeader = 'https://raw.githubusercontent.com/Mastadons/DoodleDesigner/master/'

var canvas;
var context;
var windowLoaded = false;
var earsImage;
var bodyImage;
var outlineImage;

window.onload = async function() {
	randomizeColor()
	randomizeFace()
	
  canvas = document.getElementById("render");
  context = canvas.getContext("2d");

  earsImage = await loadImage('ears.png')
  bodyImage = await loadImage('body.png')
  outlineImage = await loadImage('outline.png')
  windowLoaded = true;

  console.log("Window finished loading")
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.crossOrigin = '*'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = imageHeader + src
  })
}


async function draw() {
	if (!windowLoaded) {
		window.requestAnimationFrame(draw)
		return;
	}

	let eyesType = parseInt(document.getElementById('eyesType').value);
	let mouthType = parseInt(document.getElementById('mouthType').value);
	
	let eyesImage = await loadImage(`eyes/eyes.${eyesType.toString().padStart(3, '0')}.png`);
	let mouthImage = await loadImage(`mouths/mouths.${mouthType.toString().padStart(3, '0')}.png`);

	let earsColor = document.getElementById('earsColor').value;
	let bodyColor = document.getElementById('bodyColor').value;

	context.drawImage(earsImage, 0, 0);
	context.globalAlpha = 1.0;
  context.drawImage(tintImage(earsImage, earsColor), 0, 0);

	context.drawImage(bodyImage, 0, 0);
	context.globalAlpha = 1.0;
  context.drawImage(tintImage(bodyImage, bodyColor), 0, 0);
	
	let eyesXLocation = 300+parseInt(document.getElementById('eyesXLocation').value);
	let eyesYLocation = 275+parseInt(document.getElementById('eyesYLocation').value)+25;
	var eyesRotation = parseInt(document.getElementById('eyesRotation').value);

	if (eyesType == 3 && eyesRotation > -155 && eyesRotation < -45) { 
		if (eyesRotation < -100) { eyesRotation = -155; 
		} else { eyesRotation = -45; }
	}
	if (eyesType == 3 && eyesRotation < 155 && eyesRotation > 45) { 
		if (eyesRotation > 100) { eyesRotation = 155; 
		} else { eyesRotation = 45; }
	}

	eyesRotation = degreesToRadians(eyesRotation);
	context.translate(eyesXLocation, eyesYLocation);
	context.rotate(eyesRotation);
	context.drawImage(eyesImage, -eyesImage.width/2, -eyesImage.height/2, eyesImage.width, eyesImage.height);
	context.rotate(-eyesRotation);
	context.translate(-eyesXLocation, -eyesYLocation);

	let mouthXLocation = 300+parseInt(document.getElementById('mouthXLocation').value);
	let mouthYLocation = 375+parseInt(document.getElementById('mouthYLocation').value);
	var mouthRotation = parseInt(document.getElementById('mouthRotation').value);
	mouthRotation = degreesToRadians(mouthRotation);
	context.translate(mouthXLocation, mouthYLocation);
	context.rotate(mouthRotation);
	context.drawImage(mouthImage, -mouthImage.width/2, -mouthImage.height/2, mouthImage.width, mouthImage.height);
	context.rotate(-mouthRotation);
	context.translate(-mouthXLocation, -mouthYLocation);
  
	context.drawImage(outlineImage, 0, 0);

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

function degreesToRadians(degrees) {
  return degrees * (Math.PI/180.0);
}

function randomColor() {
	return "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
}

function randomizeColor() {
	document.getElementById('earsColor').value = randomColor();
	document.getElementById('bodyColor').value = randomColor();
}

function randomizeFace() {
	document.getElementById('eyesType').value = Math.floor(Math.random() * 16) + 1;
  document.getElementById('mouthType').value = Math.floor(Math.random() * 16) + 1;
}

document.getElementById('downloadButton').onclick = function(button) {
	var link = document.createElement('a');
  link.download = 'designed-doodle.png';
  link.href = canvas.toDataURL('image/png')
  link.click();
};

document.getElementById('randomizeColor').onclick = randomizeColor
document.getElementById('randomizeFace').onclick = randomizeFace

window.requestAnimationFrame(draw)