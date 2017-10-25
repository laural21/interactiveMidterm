// Variables for the sound visualizer
var allShapes = [];
var happySong;
var chillSong;
var energeticSong;

// Computer voice that prompts the user to choose a mood
var voice;

// Question
var question = "What is your mood?";

// Speech input
var userInput;

// Mood (selected verbally)
var mood;
var change = []; // Waveform mapped to a change in the sizes of the shapes

function preload(){
	myFont = loadFont("Fonts/TitilliumWeb-ExtraLight.ttf");
	happySong = loadSound("Music/happy.mp3");
	chillSong = loadSound("Music/chill.mp3");
	energeticSong = loadSound("Music/energetic.mp3");
}

function setup(){
	// Create new Fast Fourier Transform object
	fft = new p5.FFT();

	// CRAIG: This will make your canvas responsive to the screen being resized
	var theCanvas = createCanvas(800, 600);
	theCanvas.style('width', '100%');
	theCanvas.style('height', '100%');

	 textFont(myFont);

	// Create speech to text object
    userInput = new p5.SpeechRec();

  	// Create voice object
  	voice = new p5.Speech();

  	// Continuously detect input, change even in the middle of the song
  	userInput.continuous = true;

  	// Define a choose mood function
	userInput.onResult = chooseMood;

  	userInput.start();
}

function draw(){

	fill(0);
	rect(0,0,800,600);

	fill(255, 255, 255);
	textSize(50);
	text(question, width/2-250, 50);

	var r, g, b;
	// Hues of pink and purple
	if (mood == "happy"){
		r = random(200, 255);
		g = random(200, 255);
		b = random(200, 255);

	// Hues of dark blue
	} else if (mood == "chill"){
		r = 0;
		g = random(50, 100);
		b = random(100, 255);

	// Hues of yellow, green
	} else if (mood == "energetic"){
		r = random(50, 150);
		g = 255;
		b = random(0, 100);
	}

	for(var j = 0; j < 5; j++){
		allShapes.push(new Shape(r, g, b));
	}

	for(var i = 0; i < allShapes.length; i++){
		if(allShapes[i].displayAndMove()){
			allShapes.splice(i, 1);
			i -= 1;
		}
		allShapes[i].pulsate(change);
	}
}

function chooseMood(){
	// Recognize if the user selected a mood
	var userWords = userInput.resultString.split(' ');
	var mostRecentWord = userWords[ userWords.length-1 ];
	
	// Select mood here; soundVisualizer plays music and does the visuals
	if(mostRecentWord == "happy"){
		// Simulate clicking of the "happy" button
		mood = "happy";
		happySong.play();

	} else if (mostRecentWord == "chill"){
		mood = "chill";
		chillSong.play();
	} else if (mostRecentWord == "energetic"){
		mood = "energetic";
		energeticSong.play();
	} else {
		return;
	}
	getWaveform();
}

function getWaveform(){
	var waveform = fft.waveform();
	for (var i = 0; i< waveform.length; i++){
    	change += map(waveform[i], -1, 1, -8, 8);
    }  
}

function Shape(r, g, b){
	// Color (color scheme based on mood)
	this.r = r;
	this.g = g;
	this.b = b;

	// Create random quadrangle at a random spot on the screen
	// First vertex at random, keep other verteces close to it
	this.vertexOneX = random(10, width-10);
	this.vertexOneY = random(10, width-10);
	this.vertexTwoX = this.vertexOneX + (random(-15, 15));
	this.vertexTwoY = this.vertexOneY + (random(-15, 15));
	this.vertexThreeX = this.vertexTwoX + (random(-15, 15));
	this.vertexThreeY = this.vertexTwoY + (random(-15, 15));
	this.vertexFourX = this.vertexThreeX + (random(-15, 15));
	this.vertexFourY = this.vertexThreeY + (random(-15, 15));

	// Create different noise offsets for the x and y coordinates of the verteces
	this.xNoiseOffset = random(0,1000);
  	this.yNoiseOffset = random(1000,2000);


	this.displayAndMove = function(){
		noStroke();
		fill(this.r, this.g, this.b);

		// Calculate movement
		var xMovement = map(noise(this.xNoiseOffset), 0, 1, -1, 1 );
    	var yMovement = map(noise(this.yNoiseOffset), 0, 1, -1, 1 );

		beginShape();
		vertex(this.vertexOneX + this.xNoiseOffset, this.vertexOneY + this.yNoiseOffset);
		vertex(this.vertexTwoX + this.xNoiseOffset, this.vertexTwoY + this.yNoiseOffset);
		vertex(this.vertexThreeX + this.xNoiseOffset, this.vertexThreeY + this.yNoiseOffset);
		vertex(this.vertexFourX + this.xNoiseOffset, this.vertexFourY + this.yNoiseOffset);
		endShape(CLOSE);
		
		this.xNoiseOffset += 0.01;
    	this.yNoiseOffset += 0.01;
		// Expire particles if they have moved off the screen
		// It's enough to check if one of the verteces is off the screen
	 	if((this.vertexOneX < 0) || (this.vertexOneY < 0) || (this.vertexOneX > width) || 
	 		(this.vertexOneX > height)) {
		return true;
		}
	}

	// Change size (pulsate) based on the waveform
	this.pulsate = function(){
		// Verteces move towards or away from the center of the shape based on the waveform
		for(var i = 0; i < change.length; i++){
			this.vertexOneX += change[i];
	  		this.vertexOneY += change[i];
	  		this.vertexTwoX += change[i];
	  		this.vertexTwoY += change[i];
	  		this.vertexThreeX += change[i];
	  		this.vertexThreeY += change[i];
	  		this.vertexFourX += change[i];
	  		this.vertexFourY += change[i];
		}
  		
  	}

	// Move around the screen with Perlin noise
}

function keyPressed(){
	voice.speak(question);
}
