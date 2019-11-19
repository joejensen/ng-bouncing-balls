import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {PointCollection} from './pointcollection';

/**
 * Angular component which renders a bouncing balls image using absolutely positioned divs to render each ball.
 * <br/>
 * Although using divs isn't really HTML5, it has a huge advantage in that it's more widely compatible and
 * it's balls can easily overlap other components on the page.
 */
@Component({
  selector: 'lib-ng-bouncing-balls-div',
  template: `<div #container class="ng-bouncing-balls-container"></div>`,
  styles: [`
    .ng-bouncing-balls-container {
        position: relative;
      }

    ::ng-deep .ng-bouncing-balls-container>.point {
        position: absolute;
        border-radius: 50%;
    }
  `]
})
export class NgBouncingBallsDivComponent implements AfterViewInit {
  // a reference to the canvas element from our template
  @ViewChild('container', {static: false}) containerRef: ElementRef;

  // A url to an image to render as bouncing balls
  @Input() public src;

  // setting a width and height for the canvas
  @Input() public width = 512;
  @Input() public height = 512;

  // Size of the cells the image should be subdivided into
  @Input() public cellSize = 20;

  private pointCollection: PointCollection = new PointCollection();

  constructor() {
  }

  ngAfterViewInit(): void {
    const containerrEl: HTMLDivElement = this.containerRef.nativeElement;

    containerrEl.ontouchstart = e => {
      e.preventDefault();
    };

    containerrEl.ontouchmove = e => {
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

      let currentObject: any = containerrEl;
      if ( currentObject.offsetParent) {
        do {
          ePosx += currentObject.offsetLeft;
          ePosy += currentObject.offsetTop;
          currentObject = currentObject.offsetParent;
        } while ( currentObject.offsetParent);
      }
      this.pointCollection.mousePos.setValue(mPosx - ePosx, mPosy - ePosy, 0);
    };

    containerrEl.ontouchend = e => {
      e.preventDefault();
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    containerrEl.ontouchcancel = e => {
      e.preventDefault();
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    containerrEl.onmousemove = e => {
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

      let currentObject: any = containerrEl;
      if ( currentObject.offsetParent) {
        do {
          ePosx += currentObject.offsetLeft;
          ePosy += currentObject.offsetTop;
          currentObject = currentObject.offsetParent;
        } while ( currentObject.offsetParent);
      }
      this.pointCollection.mousePos.setValue(mPosx - ePosx, mPosy - ePosy, 0);
    };

    containerrEl.onmouseleave = e => {
      this.pointCollection.mousePos.setValue(-999, -999, -999);
    };

    containerrEl.setAttribute('style', `width:${this.width}px; height:${this.height}px`);
    this.pointCollection.loadFromSource( this.src, this.width, this.height, this.cellSize);
    this.timeout();
  }

  private timeout(): void {
    const container: HTMLDivElement = this.containerRef.nativeElement;
    this.pointCollection.drawDiv(container);
    this.pointCollection.update();
    setTimeout(() => this.timeout(), 30);
  }
}
