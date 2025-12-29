



# Carousal 
-----------
Understanding how a carousel works is a rite of passage for every frontend developer. While there are many libraries (like Swiper or Slick).


building one from scratch helps you master DOM manipulation, CSS transforms, and state management.


At its core, a carousel is just a long "train" of images hidden behind a "window."


# 1. The Physical Concept
Imagine a long strip of film. You have a small rectangular viewer (the viewport). To see the next frame, you don't move the viewer; you slide the entire film strip to the left.



# The HTML Structure
To make this work in code, you usually need three layers:

The Window (Viewport): A container with overflow: hidden and a fixed width.

The Track (Slider): A long div that holds all the items side-by-side. This is what we move.

The Slides: The individual content pieces.


# 2. The Logic: Moving the Track

The "magic" happens by changing the position of the Track relative to the Window. In modern development, we use the CSS transform property because it’s hardware-accelerated and smoother than changing left or margin.The FormulaTo show a specific slide (let's call its index i), you move the track to the left by the width of one slide multiplied by that index.$$TranslationValue = -(CurrentIndex \times SlideWidth)$$If your slides are $100\%$ of the viewport width:Slide 0: translateX(0%)Slide 1: translateX(-100%)Slide 2: translateX(-200%)