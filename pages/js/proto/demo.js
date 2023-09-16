class Rectangle {
  constructor(height, width) {
    this.name = 'Rectangle';
    this.height = height;
    this.width = width;
  }

  getName() {
    console.log('name:', this.name);
  }

  getArea() {
    console.log('area:', this.width * this.height);
  }
}

const rect = new Rectangle(10, 20)
