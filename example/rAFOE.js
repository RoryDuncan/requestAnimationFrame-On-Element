/**
  * requestAnimationFrame On Element
  * -
  *       by RORY DUNCAN
  *  https://github.com/RoryDuncan/requestAnimationFrame-On-Element
  *       ( Fork freely )
  * -
  *  [public global function] window.requestAnimationFrameOnElement()
  *  [private global object] window._requestAnimationFrameElement
  * -
  * Example Usage:
  * window.requestAnimationFrameOnElement( loopingFn, elementId );
  *
  * @parameter loopingFn - a 'stepping' function (see line 172 for example)
  * @parameter elementId - a string of the id of an element in the DOM.
  *  If not elementId left undefined, passed null, or not found in DOM will fall
  *  back to the first <canvas> element found in the DOM
  * -
  * -
  * PolyFill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  * src: https://gist.github.com/paulirish/1579671
 **/
(function () {
  /*jslint browser:true */
  var window = this;
  var lastTime = 0,
    vendors = ['ms', 'moz', 'webkit', 'o'],
    x;

  for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }


  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

  // end polyfill
  var requestAnimationFrameOnElement;

  window._requestAnimationFrameElement = {

    "id": null,
    "callback": null,
    "el": null,
    set: function (el) {

      this.el = el;
      var element = document.getElementById("screen");
      var parent = element.parentNode;
      this._parent = parent;
      this._parent.addEventListener("mousemove", window._requestAnimationFrameElement.bang);
    },
    unset: function () {

      this._parent.removeEventListener("mousemove", window._requestAnimationFrameElement.bang);
    },
    cancel: function () {

      if (this.id === null) {
        return;
      }
      window.cancelAnimationFrame(this.id);
    },
    animate: function () {

      this.cancel();
      var req = window.requestAnimationFrame(this.callback);
      this.id = req;
    },
    "isFlagged": false,
    // use bangs to count events to save processing time
    "checkEvery_Bangs": 10,
    "bangs": 0,
    bang: function (e) {

      window._requestAnimationFrameElement.bangs++;
      var rAFE = window._requestAnimationFrameElement;

      if (rAFE.bangs === rAFE.checkEvery_Bangs) {
        window._requestAnimationFrameElement.bangs = 0;
        rAFE.flag(e);
      }
    },
    flag: function (evnt) {
      var mouse = {
        x: 0,
        y: 0
      };

      // get the mouse's x & y positions
      var e = evnt || window.event;

      if (e.pageX || e.pageY) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
      } else if (e.clientX || e.clientY) {
        mouse.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mouse.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      // then see if it is within the rectangle of the element.
      var element = document.getElementById(window._requestAnimationFrameElement.el);
      var elRect = element.getBoundingClientRect();
      // if it is, flag as true, if not, flag as false
      if (mouse.x >= elRect.left &&
          mouse.x <= elRect.right &&
          mouse.y >= elRect.top &&
          mouse.y <= elRect.bottom) {

        // if it is just now being flagged as true
        // begin the animation 

        if (this.isFlagged === false) {
          this.isFlagged = true;
          this.animate();
        } else {
          this.isFlagged = true;
          // 'else' just continue flagging as true to prevent hiccups
        }
      } else {
        this.isFlagged = false;
      }
    }

  }; //end of requestAnimationFrameElement Object

  requestAnimationFrameOnElement = function (fn, element) {

    // Element specifying
    if (window._requestAnimationFrameElement.el === null ||
        window._requestAnimationFrameElement.el === undefined) {

      if (element !== undefined) {
        window._requestAnimationFrameElement.set(element);
      } else {
        var canvases = document.querySelectorAll("canvas");
        if (canvases.length === 0) {
          throw "No element supplied, No canvas to fall back upon.";
        }
        if (canvases[0].id.length === 0) {
          canvases[0].id = "animated-element";
          window._requestAnimationFrameElement.set(canvases[0].id);
        } else {
          window._requestAnimationFrameElement.set(canvases[0].id);
        }
      }
    }
    // Set the callback in case not able to rAF immediately
    // when the mouse enters the specified element,
    //animation will begin using the most recent callback.
    window._requestAnimationFrameElement.callback = fn;

    if (window._requestAnimationFrameElement.isFlagged === true) {
      var rAF = window.requestAnimationFrame(fn);
      window._requestAnimationFrameElement.id = rAF;
    }
  };

  window.requestAnimationFrameOnElement = requestAnimationFrameOnElement;

}());

var canvas = document.getElementById('screen'),
  ctx = canvas.getContext('2d'),
  start = null,
  x = 0;

var canvasAnimation = function () {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  x += 30;
  var color = "#acf";
  var size = canvas.height;
  ctx.fillStyle = color;
  ctx.fillRect(x, (canvas.height - size) / 2, size, size);
  if ((x + size) >= canvas.width + size) {
    x = size * (-1);
  }

};

function step(timestamp) {
  console.log("%chttps://github.com/RoryDuncan/requestAnimationFrame-On-Element", "color:#acf");
  var progress;
  if (start === null) {
    start = timestamp;
  }
  progress = timestamp - start;
  canvasAnimation();
  window.requestAnimationFrameOnElement(step);
}


window.requestAnimationFrameOnElement(step, "screen");
