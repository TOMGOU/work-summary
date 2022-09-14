// es5
function Rectangle(height, width) {
  this.name = 'Rectangle';
  this.height = height;
  this.width = width;

  this.getName = function() {
    console.log('name:', this.name);
  }

  this.getArea = function() {
    console.log('area:', this.width * this.height);
  }
}

function FilledRectangle(height, width, color){
  Rectangle.call(this, height, width,);

  this.color = color;
  this.name = 'Filled rectangle';

  this.getColor = function() {
    console.log('color:', this.color);
  }
}

function Fn(){};
Fn.prototype = Rectangle.prototype;
FilledRectangle.prototype = new Fn();

// es6
// class Rectangle {
//   constructor(height, width) {
//     this.name = 'Rectangle';
//     this.height = height;
//     this.width = width;
//   }

//   getName() {
//     console.log('name:', this.name);
//   }

//   getArea() {
//     console.log('area:', this.width * this.height);
//   }
// }

// class FilledRectangle extends Rectangle {
//   constructor(height, width, color) {
//     super(height, width);
//     this.name = 'Filled rectangle';
//     this.color = color;
//   }

//   getColor() {
//     console.log('color:', this.color);
//   }
// }

const rect = new Rectangle(10, 20)
const FR = new FilledRectangle(10, 20, 'red')

rect.getName()
rect.getArea()

FR.getName()
FR.getArea()
FR.getColor()

// Define
// Measure
// Analyze
// Improve
// Control
