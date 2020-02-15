import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrophoneComponent } from './microphone.component';

describe('MicrophoneComponent', () => {
  let component: MicrophoneComponent;
  let fixture: ComponentFixture<MicrophoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrophoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrophoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
