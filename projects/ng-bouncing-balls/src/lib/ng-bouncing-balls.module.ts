import { NgModule } from '@angular/core';
import { NgBouncingBallsComponent } from './ng-bouncing-balls.component';
import {NgBouncingBallsDivComponent} from './ng-bouncing-balls-div.component';

@NgModule({
  declarations: [NgBouncingBallsComponent, NgBouncingBallsDivComponent],
  imports: [],
  exports: [NgBouncingBallsComponent, NgBouncingBallsDivComponent]
})
export class NgBouncingBallsModule { }
