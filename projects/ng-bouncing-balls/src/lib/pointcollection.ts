import {Vector} from './vector';
import {Point} from './point';

export class PointCollection {
  public mousePos: Vector = new Vector(0, 0, 0);
  public points: Point[] = [];

  update(): void {
    for (const point of this.points) {
      const dx = this.mousePos.x - point.curPos.x;
      const dy = this.mousePos.y - point.curPos.y;
      const dd = (dx * dx) + (dy * dy);
      const d = Math.sqrt(dd);
      if (d < 150) {
        point.targetPos.x = (this.mousePos.x < point.curPos.x) ? point.curPos.x - dx : point.curPos.x - dx;
        point.targetPos.y = (this.mousePos.y < point.curPos.y) ? point.curPos.y - dy : point.curPos.y - dy;
      } else {
        point.targetPos.x = point.originalPos.x;
        point.targetPos.y = point.originalPos.y;
      }
      point.update();
    }
  }

  draw(cx: CanvasRenderingContext2D): void {
    for (const point of this.points) {
      point.draw(cx);
    }
  }
}
