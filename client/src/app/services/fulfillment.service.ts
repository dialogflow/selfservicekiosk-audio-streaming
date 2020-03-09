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

import { Fulfillment } from '../models/fulfillment.model';

export class FulfillmentService {
    public fulfillment: Fulfillment;
    public matches: any;
    private defaultMessage: string;

    constructor() {
        this.defaultMessage = 'Press \'ask a question\' button';
        this.matches = [];
        this.fulfillment = {
            UTTERANCE: this.defaultMessage,
            FULFILLMENTS: []
        };
    }
    getFulfillment() {
        return this.fulfillment;
    }
    setFulfillments(data) {
        //console.log(data);
        if (data == null) {
            return;
        }
        if (data.UTTERANCE) {
            this.fulfillment.UTTERANCE = data.UTTERANCE;
        } else {
            if (data.PAYLOAD) {
                let payload = JSON.parse(data.PAYLOAD);
                this.matches.push({
                    QUESTION: payload.QUESTION,
                    ANSWER: data.TRANSLATED_FULFILLMENT
                    // ANSWER: payload.ANSWER
                });
            } else {
                this.matches.push({
                    QUESTION: data.INTENT_NAME,
                    ANSWER: data.TRANSLATED_FULFILLMENT,
                    AUDIO: data.AUDIO
                });
            }
            this.fulfillment.FULFILLMENTS = this.matches;
        }
    }
    clearAll() {
        this.matches = [];
        this.fulfillment.UTTERANCE = this.defaultMessage;
        return this.fulfillment.FULFILLMENTS = [];
    }
}
