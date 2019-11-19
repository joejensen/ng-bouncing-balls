import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <div class="outer-frame">
          <div class="frame">
              <div class="label">Image</div>
              <div class="inner-frame">
                <img src="assets/rainbowrose.jpg" alt="Rainbow Rose">
              </div>
          </div>
          <div class="frame">
              <div class="label">Canvas</div>
              <div class="inner-frame">
                <lib-ng-bouncing-balls [src]="'assets/rainbowrose.jpg'" [cellSize]="10"></lib-ng-bouncing-balls>
              </div>
          </div>
          <div class="frame">
              <div class="label">Divs</div>
              <div class="inner-frame">
                <lib-ng-bouncing-balls-div [src]="'assets/rainbowrose.jpg'" [cellSize]="10"></lib-ng-bouncing-balls-div>
              </div>
          </div>
      </div>
  `,
  styles: [`
  .outer-frame {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .inner-frame {
      position: relative;
      border: black 1px solid;
      height: 512px;
      width: 512px;
  }
  .inner-frame>img {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
  }
  .frame>.label {
      text-align: center;
      vertical-align: top;
  }
  `]
})
export class AppComponent {
  title = 'ng-bouncing-balls-showcase';
}
