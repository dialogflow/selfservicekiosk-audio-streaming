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
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import * as pb from 'pb-util';

const df = require('dialogflow').v2beta1;

dotenv.config();

export class Dialogflow {
  private projectId: string;
  private languageCode: string;
  private request: any;
  private sessionClient: any;
  private sessionPath: any;
  private sessionId: string;
    
  constructor() {
      this.languageCode = process.env.LANGUAGE_CODE;
      this.projectId = process.env.PROJECT_ID;
      this.setupDialogflow();
  }

 /*
  * Setup the Dialogflow Agent
  */
  public setupDialogflow() {
      this.sessionId = uuid.v4();
      this.sessionClient = new df.SessionsClient();
      this.sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);
      
      this.request = {
        session: this.sessionPath,
        queryInput: {
          text: {
            languageCode: this.languageCode
          }
        }
      }
  }

 /*
  * Detect Intent based on Text String
  * @param audio file buffer
  * @param cb Callback function to execute with results
  */
  public async detectIntent(text: string){
    this.request.queryInput.text.text = text;
    const responses = await this.sessionClient.detectIntent(this.request);
    return this.getHandleResponses(responses);
  }

  /*
  * Handle Dialogflow response objects
  * @param responses protobuf
  * @param cb Callback function to send results
  */
  public getHandleResponses(responses: any): any {
    var json:DF_RESULT = {};
    var result = responses[0].queryResult;

    if (result && result.intent) {
      const INTENT_NAME = result.intent.displayName;
      const PARAMETERS = JSON.stringify(pb.struct.decode(result.parameters));
      const FULFILLMENT_TEXT = result.fulfillmentText;
      var PAYLOAD = "";
      if(result.fulfillmentMessages[0] && result.fulfillmentMessages[0].payload){
        PAYLOAD = JSON.stringify(pb.struct.decode(result.fulfillmentMessages[0].payload));
      }
      json = {
        INTENT_NAME,
        FULFILLMENT_TEXT,
        PARAMETERS,
        PAYLOAD
      }
      //console.log(json);
      return json;
    }
  }
}

declare interface DF_RESULT {
  INTENT_NAME?: string,
  FULFILLMENT_TEXT?: string,
  TRANSLATED_FULFILLMENT?: string,
  PARAMETERS?: any,
  PAYLOAD?: any
}

export let dialogflow = new Dialogflow();
