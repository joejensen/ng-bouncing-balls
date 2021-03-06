import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {PointCollection} from './pointcollection';

/**
 * Angular component which renders bouncing balls using a canvas to draw all the balls.
 * <br/>
 * The major downside of a canvas is that it can't render outside of the canvas itself.
 */
@Component({
  selector: 'lib-ng-bouncing-balls',
  template: `<canvas #canvas class="ng-bouncing-balls-canvas"></canvas>`,
  styles: [`
    .ng-bouncing-balls-canvas {
        padding: 0;
    }
  `]
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
    this.pointCollection.loadFromSource( this.src, this.width, this.height, this.cellSize);
    this.timeout();
  }

  private timeout(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    this.pointCollection.drawCanvas(this.cx);
    this.pointCollection.update();
    setTimeout(() => this.timeout(), 30);
  }
}
