# Conway's Game of Life

[Play with it live on the web here](http://www.hamon.io/conway.js/index.html)

## Tech Inventory

- Vanilla javascript OOP
- HTML5 Canvas for drawing
- HTML5 Web Workers for heavy lifting on calculations
- jQuery for form interactions

## Description

Conway's Game of Life holds a special place in my heart. The first non-trivial program I ever wrote was a simple version of the game implemented in Python, and when I decided to learn JavaScript I began by coding up Life. Life makes a great code kata because it is relatively quick and easy to get a basic version going, but it also leaves a lot of room for experimentation and improvement.

I've now done this several times in JavaScript, each time learning something new. My first implementation was to learn basic JavaScript syntax and the HTML5 Canvas API, but the code was pretty terrible by my current standards. A second implementation went after the low-hanging fruit by improving the seperation of concerns between view rendering and game calculations.

My third JavaScript implementation was to learn more about event-driven programming with Backbone.js. In the Backbone version, each cell was represented as a Backbone model listening for changes in all its neighbors. Each div element in the page was bound to a Backbone view that was listening for changes in a cell model. The Backbone view automatically changed the div's CSS styling when the underlying data model fired a change event.

Though by no means "fast" compared to other implementations (see the memoized [HashLife](http://en.wikipedia.org/wiki/Hashlife) algorithm to have your mind blown), my latest rendition of the game adds several improvements. Most important of these is my use of the HTML5 Web Workers API to offload heavy calculations to another thread. This allows the UI thread responsible for rendering everything the user sees in the active tab to continue unimpeded while the Life code runs the simluation in the background thread.

Now that the UI thread is not saturated by Life's iterative calculations, I have added a simple web form to allow users to adjust the game's parameters. When users interact with the form, a jQuery click handler sends a message to the background process to adjust the game's state.

I have also improved the algorithmic efficiency in the latest version. Instead of visiting every cell during every iteration, I now keep track of a "change list". Since the only thing that can change a cell's status is a change in its number of immediate living neighbors, I only need to check the cells that have changed and or whose neighbors have changed. This is a huge savings in computational expense after the first few chaotic iterations.

![Screenshot of Conway's Game of Life in javascript and HTML5 canvas](conway-screenshot.png)
