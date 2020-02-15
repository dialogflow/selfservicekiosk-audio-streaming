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
import { dialogflow } from './dialogflow';
import { speech } from './speech';
import { translate } from './translate';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as sourceMapSupport from 'source-map-support';
import * as fs from 'fs';

const ss = require('socket.io-stream');

dotenv.config();
sourceMapSupport.install();

export class App {
    public static readonly PORT:number = parseInt(process.env.PORT) || 8080;
    private app: express.Application;
    private server: http.Server;
    private io: SocketIO.Server;
    public socketClient: SocketIO.Server;
    public baseLang: string;
    
    constructor() {
        this.createApp();
        this.createServer();
        this.sockets();
        this.listen();

        this.baseLang = process.env.LANGUAGE_CODE;
    }

    private createApp(): void {
        this.app = express();
        this.app.use(cors());
        this.app.set('trust proxy', true);
  
        this.app.use(function(req: any, res: any, next: any) {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

            if (req.secure) {
                // request was via https, so do no special handling
                next();
            } else {
                if(req.headers.host != 'localhost:' + App.PORT && req.headers.host != process.env.EXTERNAL_IP){
                    // request was via http, so redirect to https
                    res.redirect('https://' + req.headers.host + req.url)
                } else {
                    next();
                }
            }

console.log()
        });
        this.app.use('/', express.static(path.join(__dirname, '../dist/public')));
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        let me = this;
        this.server.listen(App.PORT, () => {
            console.log('Running server on port: %s', App.PORT);
        });

        this.io.on('connect', (client: any) => {
            var me = this;
            me.socketClient = client;
            console.log(`Client connected [id=${client.id}]`);
            client.emit('server_setup', `Server connected [id=${client.id}]`);

            // simple DF detectIntent call
            ss(client).on('stream-speech', async function (stream: any, data: any) {
                // get the file name
                const filename = path.basename(data.name);
                // get the target language
                const targetLang = data.language;

                stream.pipe(fs.createWriteStream(filename));
                speech.speechStreamToText(stream, targetLang, async function(transcribeObj: any){
         
                    // console.log(transcribeObj.words[0].speakerTag);
                    // don't want to transcribe the tts output
                    // if(transcribeObj.words[0].speakerTag > 1) return;

                    me.socketClient.emit('transcript', transcribeObj.transcript);
                
                    // translate the transcript if the target language is not the same 
                    // as the Dialogflow base base language.
                    let response = transcribeObj.transcript;
                    if (targetLang != me.baseLang){
                        response = await translate.translate(transcribeObj.transcript, me.baseLang);
                        response = response.translatedText;
                    }

                    // Match the intent
                    const intentMatch = await dialogflow.detectIntent(response);
                        
                    // translate the fulfillment text if the target language is not the same
                    // as the Dialogflow base language.
                    let intentResponse = intentMatch.FULFILLMENT_TEXT;
                    if (targetLang != me.baseLang){
                        intentResponse = await translate.translate(intentMatch.FULFILLMENT_TEXT, targetLang);
                        intentResponse = intentResponse.translatedText;
                        intentMatch.TRANSLATED_FULFILLMENT = intentResponse;
                        //console.log(intentMatch);
                        me.socketClient.emit('results', intentMatch);
                    } else {
                        intentMatch.TRANSLATED_FULFILLMENT = intentMatch.FULFILLMENT_TEXT;
                        me.socketClient.emit('results', intentMatch);
                    }

                    // TTS the answer
                    speech.textToSpeech(intentResponse, targetLang).then(function(audio: AudioBuffer){
                        me.socketClient.emit('audio', audio);
                    }).catch(function(e: any) { console.log(e); })
                
                });
            
            });
        });
    }
}

export let app = new App();
