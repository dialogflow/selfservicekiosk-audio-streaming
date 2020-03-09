/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
