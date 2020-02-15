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

import { Component } from '@angular/core';
import { EventService } from './services/event.service';
import { IoService } from './services/io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'SelfServiceDesk';
  private lang = 'en-US';
  public isInActive: boolean;

  constructor(public eventService: EventService, public ioService: IoService) {
    this.isInActive = true;
    this.browserCheck();
  }

  onReset() {
    this.eventService.resetInterface.emit();
    this.languageSwitch('en-US', null);
  }

  languageSwitch(lang: string, e: Event) {
    let flags = document.getElementsByClassName('flag');
    for (let i = 0; i < flags.length; i++) {
      flags[i].className = 'flag inactive';
    }
    if(e === null) {
      flags[0].className = 'flag active';
    } else {
      let element = e.target as HTMLElement;
      element.className = 'flag active';
    }
    this.ioService.setDefaultLanguage(lang);
  }

  /**
   * Chrome on iOS (iPhone & iPad) can't make use of WebRTC & getUserMedia()
   * https://support.google.com/chrome/forum/AAAAP1KN0B0NrNQ8brcVvM/?hl=nl
   */
  browserCheck() {
    let nav = window.navigator;
    let ua = nav.userAgent;
    // iPhone or iPad is in the UA string (could be Opera)
    // There's Mac in the UA string (not Opera)
    // and it's not Safari (because on Safari it works fine)
    if ((ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1)
    && ua.indexOf('Mac OS') !== -1
    && ua.indexOf('Safari') !== 1) {
      alert('Unfortunately, this application won\'t work in Chrome for iOS. Please open mobile Safari.');
    }
  }
}
