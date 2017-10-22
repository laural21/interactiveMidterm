var allShapes = [];
var happySong;
var chillSong;
var energeticSong;

function preload(){
	happySong = loadSound("Music/happy.mp3");
	chillSong = loadSound("Music/chill.mp3");
	energeticSong = loadSound("Music/energetic.mp3");
}


function setup(){
	// Create new Fast Fourier Transform object
	fft = new p5.FFT();
	createCanvas(windowWidth, windowHeight);
	background(0);
}

function Shape(r, g, b){
	// Position, size, color scheme (colors based on mood)
	this.x = width/2;
	this.y = height-10;

	this.r = r;
	this.g = g;
	this.b = b;

	// Original size
	this.size = 20;

  	var spectrum = fft.analyze();
	  noStroke();
	  fill(0,255,0); // spectrum is green
	  for (var i = 0; i< spectrum.length; i++){
	    var x = map(i, 0, spectrum.length, 0, width);
	    var h = -height + map(spectrum[i], 0, 255, height, 0);
	    rect(x, height, width / spectrum.length, h )
	  }

  	var waveform = fft.waveform();
  	noFill();
  	beginShape();
  	stroke(255,0,0); // waveform is red
  	strokeWeight(1);
  	for (var i = 0; i< waveform.length; i++){
    	var x = map(i, 0, waveform.length, 0, width);
    	var y = map( waveform[i], -1, 1, 0, height);
    	vertex(x,y);
  	}
  	endShape();

	this.moveAndDisplay = function(){
		// Move with Perlin noise
		// Change size based on waveform
		// Add waveform's number to
	}
}

function draw(){
	if (mood == "happy"){
		r = random(200, 255);
		g = random(0, 10);
		b = random(100, 170);
		happySong.play();
	} else if (mood == "chill"){
		r = random(200, 255);
		g = random(0, 10);
		b = random(100, 170);
		chillSong.play();
	} else if (mood == "energetic"){
		r = random(200, 255);
		g = random(0, 10);
		b = random(100, 170);
		energeticSong.play();
	}


	for (int j = 0; j < 5000; j++){
		allShapes.push(new Shape(r, g, b));
	}

	for(var i = 0; i < fire.length; i++){
		allShapes[i].moveAndDisplay();
	}

	// Remove "expired" particles from the array
	allShapes.splice(i, 1);
	i -= 1;
}
