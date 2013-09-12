requestAnimationFrame On Element
================================
### About
__requestAnimationFrameOnElement()__
Allows a specific element to only update via requestAnimationFrame when the mouse is hovered over the specified element,
similar to a pointerlock effect. PolyFill by Erik Möller and fixes from Paul Irish and Tino Zijdel.[source]( https://gist.github.com/paulirish/1579671)
It doesn't override window.requestAnimationFrame().

### Globals

    window.requestAnimationFrameOnElement()
    
The function called when starting a rAF

    window._requestAnimationFrameElement


The underlying object that deals with the intricasies of **window.requestAnimationFrameOnElement()**.

###Usage:

    window.requestAnimationFrameOnElement(loopingFn, elementId);
##### Parameters

    @parameter loopingFn

a function that is expected to loop. [see here](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)

    @parameter elementId

a string of the id of an element in the DOM. _If elementId is left undefined, passed null, or not found in DOM, it will fall back to the first canvas element found in the DOM_


