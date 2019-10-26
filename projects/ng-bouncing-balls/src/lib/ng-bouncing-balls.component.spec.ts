import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBouncingBallsComponent } from './ng-bouncing-balls.component';

describe('NgBouncingBallsComponent', () => {
  let component: NgBouncingBallsComponent;
  let fixture: ComponentFixture<NgBouncingBallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgBouncingBallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBouncingBallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
