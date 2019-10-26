export class Vector {
  constructor(public x: number, public y: number, public z: number) {
  }

  addX(x: number): void {
    this.x += x;
  }

  addY(y: number): void {
    this.y += y;
  }

  addZ(z: number): void {
    this.z += z;
  }

  setValue(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
