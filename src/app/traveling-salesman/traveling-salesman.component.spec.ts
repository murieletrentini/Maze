import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TravelingSalesmanComponent} from './traveling-salesman.component';

describe('TravelingSalesmanComponent', () => {
  let component: TravelingSalesmanComponent;
  let fixture: ComponentFixture<TravelingSalesmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelingSalesmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelingSalesmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
