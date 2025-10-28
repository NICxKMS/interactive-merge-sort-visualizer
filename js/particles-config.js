var particles = [];
var cellSize = 50;

function addParticle(p){
  particles.push(p);
}

function buildGrid(){
  var grid = {};
  for(var i=0;i<particles.length;i++){
    var p = particles[i];
    var cx = Math.floor(p.x / cellSize);
    var cy = Math.floor(p.y / cellSize);
    var key = cx + ':' + cy;
    if(!grid[key]) grid[key] = [];
    grid[key].push(p);
  }
  return grid;
}

function getNeighbors(p, grid){
  var cx = Math.floor(p.x / cellSize);
  var cy = Math.floor(p.y / cellSize);
  var neighbors = [];
  for(var dx=-1;dx<=1;dx++){
    for(var dy=-1;dy<=1;dy++){
      var key = (cx+dx) + ':' + (cy+dy);
      if(grid[key]){
        neighbors = neighbors.concat(grid[key]);
      }
    }
  }
  return neighbors;
}

function updateParticles(){
  var grid = buildGrid();
  for(var i=0;i<particles.length;i++){
    var p = particles[i];
    var neigh = getNeighbors(p, grid);
    for(var j=0;j<neigh.length;j++){
      var other = neigh[j];
      if(other !== p){
        var dx = other.x - p.x;
        var dy = other.y - p.y;
        var distSq = dx*dx + dy*dy;
        if(distSq < 10000){
          // apply force
          p.vx += dx * 0.001;
          p.vy += dy * 0.001;
        }
      }
    }
    p.x += p.vx;
    p.y += p.vy;
  }
}
