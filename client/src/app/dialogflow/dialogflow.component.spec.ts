import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogflowComponent } from './dialogflow.component';

describe('DialogflowComponent', () => {
  let component: DialogflowComponent;
  let fixture: ComponentFixture<DialogflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
