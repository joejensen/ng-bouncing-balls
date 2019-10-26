import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgBouncingBallsModule} from '../../../ng-bouncing-balls/src/lib/ng-bouncing-balls.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgBouncingBallsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
