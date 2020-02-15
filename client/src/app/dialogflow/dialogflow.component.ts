/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import { Component, AfterViewInit } from '@angular/core';
import { FulfillmentService } from '../services/fulfillment.service';
import { IoService } from '../services/io.service';
import { Fulfillment } from '../models/fulfillment.model';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-dialogflow',
  templateUrl: './dialogflow.component.html',
  styleUrls: ['./dialogflow.component.scss']
})

export class DialogflowComponent implements AfterViewInit {
  public fulfillment: Fulfillment;
  public audioContext: AudioContext;
  public outputSource: AudioBufferSourceNode;

  constructor(public fulfillmentService: FulfillmentService, public ioService: IoService, public eventService: EventService) {
    this.fulfillment = this.fulfillmentService.getFulfillment();
  }

  ngAfterViewInit() {
    let me = this;
    me.audioContext = new AudioContext();
    me.ioService.receiveStream('results', function(data) {
      me.eventService.setIsPlaying(false);
      me.fulfillmentService.setFulfillments(data);
    });

    me.ioService.receiveStream('audio', function(audio) {
      if (audio) {
        me.playOutput(audio);
      }
    });
    me.ioService.receiveStream('transcript', function(transcript) {
      me.fulfillmentService.setFulfillments({
        UTTERANCE: transcript
      });
    });
    me.eventService.audioStopping.subscribe(() => {
      me.stopOutput();
    });
  }

  /**
   * Text to Speech event, when clicked on a Dialogflow results card
   * @param event event
   */
  textToSpeech(event) {
    let me = this;
    let answerNode = event.target.parentNode.querySelector('.answer');
    let text = answerNode.innerHTML;

    // iOS Audio hack. - this can only be triggered from a user interaction
    // create empty buffer to warm up
    let b = me.audioContext.createBuffer(1, 1, 22050);
    let tempSource = me.audioContext.createBufferSource();
    tempSource.buffer = b;
    // connect to output (your speakers)
    tempSource.connect(me.audioContext.destination);
    // play the temp file
    tempSource.start(0);
    // now play the returned tts
    me.eventService.audioPlaying.emit();
    me.ioService.sendMessage('tts', { text });
  }

  /**
   * When Dialogflow matched an intent,
   * return an audio buffer to play this sound output.
   */
  playOutput(arrayBuffer: ArrayBuffer) {
    let me = this;
    me.eventService.setIsPlaying(true);
    try {
      if (arrayBuffer.byteLength > 0) {
          me.audioContext.decodeAudioData(arrayBuffer,
          function(buffer) {
              me.audioContext.resume();
              me.outputSource = me.audioContext.createBufferSource();
              me.outputSource.buffer = buffer;
              me.outputSource.connect(me.audioContext.destination);
              me.outputSource.start(0);
              me.outputSource.onended = function() {
                // we need the timeout, because of the timeslice in mic.
                setTimeout(function(){ 
                  me.eventService.setIsPlaying(false);
                }, 5000);
              }
          },
          function() {
              console.log(arguments);
          });
      }
    } catch (e) {
        console.log(e);
    }
  }

  /**
   * Stop audio
   */
  stopOutput() {
    this.outputSource.stop();
  }

}