function clamp(value, min, max) {
  let temp = value + max - Math.abs(value - max);
  if(min === 0) return (temp + Math.abs(temp)) * 0.25;
  else return (temp + (2.0 * min) + Math.abs(temp - (2.0 * min))) * 0.25;
}

function getStyle(element, property, asInt = true) {
  if(asInt) return parseInt(getComputedStyle(element).getPropertyValue(property));
  else return parseFloat(getComputedStyle(element).getPropertyValue(property));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function delay(timeInMilliseconds) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => { resolve(true); }, timeInMilliseconds);
  });
}

function isPair(value) { return (value & 1) === 0; }

function removeAllChildNodes(parent) {
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function listeners() {
  document.addEventListener('keydown', function(e) {
    keyboard[e.code] = true;
    keyboard.key = e.code;
    if(e.code === 'Space') pause = !pause;
  });

  document.addEventListener('keyup', function(e) {
    keyboard[e.code] = false;
    keyboard.key = null;
  });
}