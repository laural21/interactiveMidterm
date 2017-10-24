// our NoiseWalker class
function NoiseWalker(x, y) {
  // store our position
  this.x = x;
  this.y = y;
  
  // create a "noise offset" to keep track of our position in Perlin Noise space
  this.xNoiseOffset = random(0,1000);
  this.yNoiseOffset = random(1000,2000);
  
  // display mechanics
  this.display = function() {
    ellipse(this.x, this.y, 25, 25);
  }
  
  // movement mechanics
  this.move = function() {
    // compute how much we should move
    var xMovement = map( noise(this.xNoiseOffset), 0, 1, -1, 1 );
    var yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1 );
    
    // update our position
    this.x += xMovement;
    this.y += yMovement;
    
    // update our noise offset values
    this.xNoiseOffset += 0.01;
    this.yNoiseOffset += 0.01;
  }
}