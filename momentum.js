var boundary; 
var canvas; 
var nodes = []; 
var threshold; 
var numNodes = 100; 
var speed = 1;

class Vector
{
    constructor(x, y)
    {
        this.x = x; 
        this.y = y; 
    }
}

class Line
{
    constructor(x1, y1, x2, y2)
    {
        this.x1 = x1; 
        this.y1 = y1; 
        this.x2 = x2; 
        this.y2 = y2;
    }
}

class Node
{
    constructor(x, y, radius, target)
    {
        this.radius = radius;
        this.x = x; 
        this.y = y;
        this.location = new Vector(this.x, this.y);
        this.target = target;
        this.direction = normalize(new Vector(target.x - this.x, target.y - this.y));
    }

    move()
    {
        this.x += this.direction.x * speed; 
        this.y += this.direction.y * speed;
    }

    show(context, alpha)
    {
        context.fillStyle = "rgba(0,250,0," + alpha + ")";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();   
        // for debugging - draw trajectory line 
        //drawLine(context, this.location, this.target);
    }
}
















function getDistance(v1, v2)
{
return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
}


function getRandomPoint(line)
{
    u = Math.random();
    x = ((1 - u) * line.x1 + u * line.x2);
    y = ((1 - u) * line.y1 + u * line.y2);
    return new Vector(x, y);
}

function normalize(vector)
{
    magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    return new Vector(vector.x / magnitude, vector.y / magnitude);
}

function drawLine(context, v1, v2, alpha)
{    
    context.strokeStyle = "rgba(0,250,0," + alpha + ")";
    context.beginPath();
    context.moveTo(v1.x, v1.y);
    context.lineTo(v2.x, v2.y);
    context.stroke();
}

function createNode()
{
      // Get a random line to spawn a new Node
      index = Math.floor(Math.random() * 4);
      randLine = boundary[index];
      startingPoint = new Vector(Math.random() * canvas.width, Math.random() * canvas.height );
      // Choose a line that is not the origin line to choose a target point
      randLine2 = randLine;
      while (randLine2 == randLine)
      {
          index = Math.floor(Math.random() * 4);
          randLine2 = boundary[index];
      }
      // Set a target point for the node
      targetPoint = getRandomPoint(randLine2);
      return  new Node(startingPoint.x, startingPoint.y, 2, targetPoint);  
}



function nearFieldNodes(canvas)
{
    context = context = canvas.getContext("2d");
    // Destroy nodes that exit the boundaries by seperating them from the nodes in bounds
    var nodesInBounds = []
    for(let i = 0; i < nodes.length; i++)
    {
        if (nodes[i].x < 0 || nodes[i].x > canvas.width || nodes[i].y < 0 || nodes[i].y > canvas.height)
        {
            continue;         
        }
        else
        {
            nodesInBounds.push(nodes[i]);
        }
    }
    // Draw lines to connect nodes based on distance between nodes
    let alpha = 1;
    for(let i = 0; i < nodes.length; i++)
    {
        for(let j = 0; j < nodes.length; j++)
        {
            if(j == i)
            {
                continue;
            }
            else
            {
                let distance = getDistance(nodes[i], nodes[j]);
                // use a mapping function to convert the distance between nodes to a value between 1 and zero
                // new_value = (old_value - old_bottom) / (old_top - old_bottom) * (new_top - new_bottom) + new_bottom;
                if (distance < threshold)
                {   
                    // Map alpha 
                    alpha = (distance) / (threshold) * 1
                    alpha = 1 - alpha; // Flip the alpha
                    alpha = alpha.toFixed(1).toString();
                    nodes[i].show(context, alpha);
                    drawLine(context, nodes[i], nodes[j], alpha);
                }
            }
        }
    }
    // move Nodes
    for(let i = 0; i < nodes.length; i++)
    {
        //nodes[i].show(context, 1);  
        nodes[i].move();        
        
    }
    // Repopulate the nodes array
    nodes = nodesInBounds
    if (nodes.length < numNodes)
    {
        let difference = numNodes - nodes.length;
        
        for(let i = 0; i < difference; i++)
        {
            nodes.push(createNode());
        }
    }
}






function init()
{
    window.requestAnimationFrame(draw);
    // Create boundry shape
    canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete
    boundary = [
        new Line(0, 0, canvas.width, 0),
        new Line(canvas.width, 0, canvas.width, canvas.height),
        new Line(canvas.width, canvas.height, 0, canvas.height),
        new Line(0, canvas.height, 0, 0), 
    ];
    // set threshold for lines
    threshold = 100;
    // Create a new node
    for(let i = 0; i < numNodes; i++)
    {
        nodes.push(createNode());
    }
}



function draw()
{
    canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
    
    context.globalCompositeOperation = 'destination-over';
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    nearFieldNodes(canvas);

    
    window.requestAnimationFrame(draw);
}

init();