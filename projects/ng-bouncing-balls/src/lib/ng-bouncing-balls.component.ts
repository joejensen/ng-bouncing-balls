import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {PointCollection} from './pointcollection';
import {Point} from './point';

@Component({
  selector: 'lib-ng-bouncing-balls',
  template: `<canvas #canvas class="ng-bouncing-balls-canvas"></canvas>`,
  styles: ['']
})
export class NgBouncingBallsComponent implements AfterViewInit {
  // a reference to the canvas element from our template
  @ViewChild('canvas', {static: false}) canvas: ElementRef;

  // A url to an image to render as bouncing balls
  @Input() public src;

  // setting a width and height for the canvas
  @Input() public width = 512;
  @Input() public height = 512;

  // Size of the cells the image should be subdivided into
  @Input() public cellSize = 20;

  private cx: CanvasRenderingContext2D;

  private pointCollection: PointCollection = new PointCollection();

  private static toColor( r: number, g: number, b: number, a: number): string {
    return 'rgba(' + [r, g, b, a].join(',') + ')';
  }

  private static scalePoint( p: Point, canvasWidth: number, canvasHeight: number, imageWidth: number, imageHeight: number): void {
    p.curPos.x = ((canvasWidth - imageWidth) / 2) + p.curPos.x;
    p.curPos.y = ((canvasHeight - imageHeight) / 2) + p.curPos.y;
    p.originalPos.x = ((canvasWidth - imageWidth) / 2) + p.originalPos.x;
    p.originalPos.y = ((canvasHeight - imageHeight) / 2) + p.originalPos.y;
  }

  constructor() {
  }

  ngAfterViewInit(): void {

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    canvasEl.ontouchstart = e => {
      e.preventDefault();
    };

    canvasEl.ontouchmove = e => {
      e.preventDefault();

      let mPosx = 0;
      let mPosy = 0;
      let ePosx = 0;
      let ePosy = 0;

      if (e.targetTouches[0].pageX || e.targetTouches[0].pageY) {
        mPosx = e.targetTouches[0].pageX;
        mPosy = e.targetTouches[0].pageY;
      } else if (e.targetTouches[0].clientX || e.targetTouches[0].clientY) {
        mPosx = e.targetTouches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mPosy = e.targetTouches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      let currentObject: any = canvasEl;
      if ( currentObject.offsetParent) {
        do {
          ePosx += currentObject.offsetLeft;
          ePosy += currentObject.offsetTop;
          currentObject = currentObject.offsetParent;
        } while ( currentObject.offsetParent);
      }
      this.pointCollection.mousePos.setValue(mPosx - ePosx, mPosy - ePosy, 0);
    };

    canvasEl.ontouchend = e => {
      e.preventDefault();
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    canvasEl.ontouchcancel = e => {
      e.preventDefault();
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    canvasEl.onmousemove = e => {
      let mPosx = 0;
      let mPosy = 0;
      let ePosx = 0;
      let ePosy = 0;

      if (e.pageX || e.pageY) {
        mPosx = e.pageX;
        mPosy = e.pageY;
      } else if (e.clientX || e.clientY) {
        mPosx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mPosy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      let currentObject: any = canvasEl;
      if ( currentObject.offsetParent) {
        do {
          ePosx += currentObject.offsetLeft;
          ePosy += currentObject.offsetTop;
          currentObject = currentObject.offsetParent;
        } while ( currentObject.offsetParent);
      }
      this.pointCollection.mousePos.setValue(mPosx - ePosx, mPosy - ePosy, 0);
    };

    canvasEl.onmouseleave = e => {
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    this.cx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.loadFromSource();
    this.timeout();
  }

  private timeout(): void {

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    this.pointCollection.draw(this.cx);
    this.pointCollection.update();
    setTimeout(() => this.timeout(), 30);
  }

  private loadFromSource(): void {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.className = 'ng-bouncing-balls-bg-canvas';
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const context = tempCanvas.getContext('2d');
      context.drawImage(img, 0, 0, img.width, img.height);
      const pixels = context.getImageData(0, 0, img.width, img.height);
      this.pointsFromImage(pixels);
    };

    img.onerror = (err) => {
      console.log(err);
    };
    img.src = this.src;
  }

  private pointsFromImage( img: ImageData): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const canvasWidth = canvasEl.width;
    const canvasHeight = canvasEl.height;
    const realCellSize = Math.max( 1, this.cellSize);
    const cellRadius = Math.floor(realCellSize / 2);
    const cols = Math.ceil(img.width / realCellSize);
    const rows = Math.ceil(img.height / realCellSize);

    for ( let y = 0; y < rows; y++) {
      for ( let x = 0; x < cols; x++) {
        const cellX = x * realCellSize;
        const cellY = y * realCellSize;
        const color = this.dominantColor(cellX, cellY, img.width, realCellSize, img.data);
        if ( color) {
          const p = new Point(cellX + cellRadius, cellY + cellRadius, 0, cellRadius, color);
          NgBouncingBallsComponent.scalePoint(p, canvasWidth, canvasHeight, img.width, img.height);
          this.pointCollection.points.push(p);
        }
      }
    }
  }

  /**
   * Determines the average color within the cell so we know the color of the ball, summing the squares gives a better looking color
   */
  private dominantColor( x: number, y: number, w: number, cellSize: number, data: Uint8ClampedArray): string {
    // Average the colors in the area
    let pixels = 0;
    let rSummed = 0;
    let gSummed = 0;
    let bSummed = 0;
    let aSummed = 0;
    for ( let localX = x; localX < x + cellSize; localX++) {
      for ( let localY = y; localY < y + cellSize; localY++) {
        const i = ((y * w) + x) * 4;
        if ( i < data.byteLength) {
          const r = data[i];
          rSummed += r * r;
          const g = data[i + 1];
          gSummed += g * g;
          const b = data[i + 2];
          bSummed += b * b;
          const a = data[i + 3];
          aSummed += a * a;
          pixels++;
        }
      }
    }

    const rFinal = Math.sqrt(rSummed / pixels);
    const gFinal = Math.sqrt(gSummed / pixels);
    const bFinal = Math.sqrt(bSummed / pixels);
    const aFinal = Math.sqrt(aSummed / pixels);

    if ( aFinal < 10 || (rFinal > 230 && gFinal > 230 && bFinal > 230)) {
      return null;
    }

    return NgBouncingBallsComponent.toColor(rFinal, gFinal, bFinal, aFinal);
  }
}
