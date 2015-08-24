var dude = document.getElementById('jumper'),
    stage = document.getElementById('stage'),
    spikeyTop = document.getElementById('spikey-top'),
    spikeyBottom = document.getElementById('spikey-bottom'),
    stageHeight=stage.clientHeight,
    stageWidth=stage.clientWidth,
    px = (stageWidth / 2) - 84,
    py = stageHeight - 50,
    vy = 0.0,
    gravity = 0.5,
    canJump = true,
    keyTimer = null,
    collided = false,
    collidedBubble = null,
    scale = 0.5,
    bubbles = [],
    backgroundBubbles = [],
    j = 0;

//Create the first bubble
bubbles.push(new Bubble(j, 100, 100, 'collidable', px - 15, py - 75));
collidedBubble = bubbles[0];
collided = true;

//Set the jumper
dude.style.cssText = 'left:' + px + 'px;top:' + py + 'px;';

//Release a bubble once a second
setInterval(function () {
    bubbles.push(new Bubble(j, 100, 100, 'collidable'));

    //Release only 15 non-collidable bubbles
    if (backgroundBubbles.length < 15) {
        backgroundBubbles.push(new Bubble('', 30, 30, ''));
    }
    j++;
}, 1000);

//Add top spikey
var spikeyLeft = -18;

for (var i = 0; i < 60; i++) {
    var spikey = document.createElement('div');

    spikey.className = 'spikey';
    spikey.style.left = spikeyLeft + 'px';
    spikeyLeft += 45;

    document.getElementById('spikey-top').appendChild(spikey);
}

//Add bottom spikey
spikeyLeft = -18;

for (var i = 0; i < 40; i++) {
    var spikey = document.createElement('div');

    spikey.className = 'spikey bottom';
    spikey.style.left = spikeyLeft + 'px';
    spikeyLeft += 45;

    document.getElementById('spikey-bottom').appendChild(spikey);
}


/**
 * jump
 * Sets the y velocity if their is a jump state
 * @returns 
 */
function jump() {
    if (canJump) {
        vy = -16.0;
        canJump = false;
        removeBubble();
    }
}

/**
 * checkCollison
 * Checks for intersect collisions with collidable bubbles
 * @returns 
 */
function checkCollison() {
    //Check for bubble collision
    if (!collided) {
        for (var i in bubbles) {
            var bubble = bubbles[i].bubble;
            if (hasCollided(dude, bubble)) {
                collided = true;
                canJump = true;
                document.getElementById(bubble.id).className='bubble inner animate';
                collidedBubble = bubbles[i];
                return;
            }
        }
        
        if(py == stageHeight - 75){
            //Jumper has crashed on spikey
        }        
    }
}
/**
 * removeBubbles
 * removes collidable bubbles and resets non-collidable bubbles
 * @returns 
 */
function removeBubbles() {
    var i = bubbles.length;
    while (i--) {
        //Pop bubble if it his top spikies
        if (bubbles[i].y < 30) {
            stage.removeChild(document.getElementById(bubbles[i].id));
            bubbles.splice(i, 1);
            
        }
    }

    var k = backgroundBubbles.length;
    while (k--) {
        if (backgroundBubbles[k].y < -backgroundBubbles[k].h - 50) {
            backgroundBubbles[k].y = Math.round(Math.random() * stageHeight / 2) + (stageHeight);
            backgroundBubbles[k].x = Math.round(Math.random() * stageWidth);
        }
    }
}

/**
 * moveBubbles
 * Moves collidable and non-collidable bubble posiitons
 * @returns 
 */
function moveBubbles() {
    var i = bubbles.length;
    while (i--) {
        bubbles[i].y -= bubbles[i].s;
        bubbles[i].bubble.style.left = bubbles[i].x + 'px';
        bubbles[i].bubble.style.top = bubbles[i].y + 'px';
    }

    var k = backgroundBubbles.length;
    while (k--) {
        backgroundBubbles[k].y -= backgroundBubbles[k].s;
        backgroundBubbles[k].bubble.style.left = backgroundBubbles[k].x + 'px';
        backgroundBubbles[k].bubble.style.top = backgroundBubbles[k].y + 'px';
    }
}

/**
 * hasCollided
 * Checks for collision intersection
 * @param {element} el1 - jumper
 * @param {element} el2 = bubble
 * @returns 
 */
function hasCollided(el1, el2) {
    var r1 = el1.getBoundingClientRect(),
        r2 = el2.getBoundingClientRect();

    return !(
        r1.top > r2.bottom ||
        r1.right < r2.left + 25 ||
        r1.bottom < r2.top ||
        r1.left > r2.right - 25)
}


/**
 * checkRemoveBubble
 * Checks to see if jumper has grown to scale, then sets bubble outside of view for cleanup
 * @returns 
 */
function checkRemoveBubble() {
    if (scale > 0.75 || collidedBubble.y<30) {
        removeBubble();
    }
}

function removeBubble() {
    collided = false;
    scale = 0.5;
    dude.style.transform = 'scale(' + scale + ')';
    collidedBubble.y = -collidedBubble.h - 50;
}

/**
 * draw
 * Draw actions
 * @returns 
 */
function draw() {
    removeBubbles();
    moveBubbles();

    if (!collided) {
        jumping();
        checkCollison();
    }

    render();
    checkRemoveBubble();

    requestAnimationFrame(draw);
}


/**
 * move
 * Move the dude every 0.0033 seconds; if the dude is already moving return
 * @param {number} dir - 0=left, 1=right
 * @returns 
 */

function move(dir) {
    if (keyTimer !== null) {
        return;
    }

    keyTimer = setInterval(function () {
        if (dir === 0) {
            px -= 5;
        } else {
            px += 5;
        }
    }, 33);
}

/**
 * jumping
 * The dude is jumping, increase/decrease the y point. If the dude is near the bottom, reset velocity, canJump, and collided state
 * @returns 
 */

function jumping() {
    vy += gravity;
    py += vy;


    if (py > stageHeight - 75) {
        py = stageHeight - 75;
        vy = 0.0;
        canJump = true;
        collided = false;
    }

}

/**
 * keyDown
 * Key down listener for arrow keys. Move or jump accordingly
 * @returns 
 */

function keyDown(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    switch (key) {
    case 38:
        //up
        jump();
        break;
    case 40:
        //down
        break;
    case 37:
        //left
        move(0);
        break;
    case 39:
        //right
        move(1);
        break;

    }

}

/**
 * keyUp
 * Key up listener for arrow keys. Listening for move only since jump is handled by jumping()
 * @returns 
 */

function keyUp(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    //left or right
    if (key === 37 || key === 39) {

        clearInterval(keyTimer);
        keyTimer = null;
    }
}

/**
 * render
 * Render all screen assets; move dude and collidable bubles
 * @returns 
 */
 function render() {
     for (var i in bubbles) {
         bubbles[i].bubble.style.top = bubbles[i].y + 'px'
     }
     if (collided) {
         px = collidedBubble.x + 10;
         py = collidedBubble.y + 5;
         scale += 0.001;
         dude.style.transform = 'scale(' + scale + ')';
     }
 
     dude.style.left = px + 'px';
     dude.style.top = py + 'px';
 }

//Events
window.onkeydown = keyDown;
window.onkeyup = keyUp;

/**
 * Bubble
 * Bubble class for creation
 * @returns 
 */
function Bubble(id, w, h, collidable, x, y) {
    var bubble = document.createElement('div'),
        id = 'bubble_' + id,
        s = Math.round(Math.random() * 1) + 2,
        x = x || Math.round(Math.random() * stageWidth) - w / 2,
        y = y || Math.round(Math.random() * 100) + (stageHeight);

    bubble.setAttribute('id', id);
    bubble.className = 'bubble inner ' + collidable;
    bubble.style.cssText = 'left: ' + x + 'px; top: ' + y + 'px; width:' + w + 'px; height:' + h + 'px;';
    stage.appendChild(bubble);

    return {
        bubble: bubble,
        id: id,
        s: s,
        x: x,
        y: y,
        w: w,
        h: h
    }
}
draw();