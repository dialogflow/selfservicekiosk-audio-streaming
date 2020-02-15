import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IoService } from './services/io.service';
import { FulfillmentService} from './services/fulfillment.service';
import { EventService} from './services/event.service';


import { MicrophoneComponent } from './microphone/microphone.component';
import { DialogflowComponent } from './dialogflow/dialogflow.component';
import { WaveformComponent } from './waveform/waveform.component';

@NgModule({
  declarations: [
    AppComponent,
    MicrophoneComponent,
    DialogflowComponent,
    WaveformComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    IoService,
    FulfillmentService,
    EventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
