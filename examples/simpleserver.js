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

// ------------- SETTINGS
const projectId = process.env.npm_config_PROJECT_ID;
const example = process.env.npm_config_EXAMPLE;
const port = ( process.env.npm_config_PORT || 3000 );

const languageCode = 'en-US';
let encoding = 'AUDIO_ENCODING_LINEAR_16';
if(example > 3){
  // NOTE: ENCODING NAMING FOR SPEECH API IS DIFFERENT
  encoding = 'LINEAR16';
}

console.log(example);
if(example == 7){
  // NOTE: ENCODING NAMING FOR SPEECH API IS DIFFERENT
  encoding = 'linear16';
}

const singleUtterance = true;
const interimResults = false;
const sampleRateHertz = 16000;
const speechContexts = [
  {
    phrases: [
      'mail',
      'email'
    ],
    boost: 20.0
  }
]

console.log(example);
console.log(projectId);

// ----------------------


// load all the libraries for the server
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const http = require('http');
const cors = require('cors');
const express = require('express');
const ss = require('socket.io-stream');
// load all the libraries for the Dialogflow part
const uuid = require('uuid');
const util = require('util');
const { Transform, pipeline } = require('stream');
const pump = util.promisify(pipeline);
const df = require('dialogflow').v2beta1;

// set some server variables
const app = express();
var server;
var sessionId, sessionClient, sessionPath, request;
var speechClient, requestSTT, ttsClient, requestTTS, mediaTranslationClient, requestMedia;

// STT demo
const speech = require('@google-cloud/speech');

// TTS demo
const textToSpeech = require('@google-cloud/text-to-speech');

// Media Translation Demo
const mediatranslation = require('@google-cloud/media-translation');

/**
 * Setup Express Server with CORS and SocketIO
 */
function setupServer() {
    // setup Express
    app.use(cors());
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/example'+ example + '.html'));
    });
    server = http.createServer(app);
    io = socketIo(server);
    server.listen(port, () => {
        console.log('Running server on port %s', port);
    });

    // Listener, once the client connect to the server socket
    io.on('connect', (client) => {
        console.log(`Client connected [id=${client.id}]`);
        client.emit('server_setup', `Server connected [id=${client.id}]`);

        // when the client sends 'message' events
        // when using simple audio input
        client.on('message', async function(data) {
            // we get the dataURL which was sent from the client
            const dataURL = data.audio.dataURL.split(',').pop();
            // we will convert it to a Buffer
            let fileBuffer = Buffer.from(dataURL, 'base64');
            // run the simple detectIntent() function
            const results = await detectIntent(fileBuffer);
            client.emit('results', results);
        });

        // when the client sends 'message' events
        // when using simple audio input
          client.on('message-transcribe', async function(data) {
            // we get the dataURL which was sent from the client
            const dataURL = data.audio.dataURL.split(',').pop();
            // we will convert it to a Buffer
            let fileBuffer = Buffer.from(dataURL, 'base64');
            // run the simple transcribeAudio() function
            const results = await transcribeAudio(fileBuffer);
            client.emit('results', results);
        });

        // when the client sends 'stream' events
        // when using audio streaming
        ss(client).on('stream', function(stream, data) {
          // get the name of the stream
          const filename = path.basename(data.name);
          // pipe the filename to the stream
          stream.pipe(fs.createWriteStream(filename));
          // make a detectIntStream call
          detectIntentStream(stream, function(results){
              console.log(results);
              client.emit('results', results);
          });
        });

        // when the client sends 'stream-transcribe' events
        // when using audio streaming
        ss(client).on('stream-transcribe', function(stream, data) {
            // get the name of the stream
            const filename = path.basename(data.name);
            // pipe the filename to the stream
            stream.pipe(fs.createWriteStream(filename));
            // make a detectIntStream call
            transcribeAudioStream(stream, function(results){
                console.log(results);
                client.emit('results', results);
            });
        });

        // when the client sends 'tts' events
        ss(client).on('tts', function(text) {
          textToAudioBuffer(text).then(function(results){
            console.log(results);
            client.emit('results', results);
          }).catch(function(e){
            console.log(e);
          });
        });

        // when the client sends 'stream-media' events
        // when using audio streaming
        ss(client).on('stream-media', function(stream, data) {
          // get the name of the stream
          const filename = path.basename(data.name);
          // pipe the filename to the stream
          stream.pipe(fs.createWriteStream(filename));
          // make a detectIntStream call
          transcribeAudioMediaStream(stream, function(results){
              console.log(results);
              client.emit('results', results);
          });
        });
    });
}

/**
 * Setup Dialogflow Integration
 */
function setupDialogflow(){
    // Dialogflow will need a session Id
    sessionId = uuid.v4();
    // Dialogflow will need a DF Session Client
    // So each DF session is unique
    sessionClient = new df.SessionsClient();
    // Create a session path from the Session client, 
    // which is a combination of the projectId and sessionId.
    sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // Create the initial request object
    // When streaming, this is the first call you will
    // make, a request without the audio stream
    // which prepares Dialogflow in receiving audio
    // with a certain sampleRateHerz, encoding and languageCode
    // this needs to be in line with the audio settings
    // that are set in the client
    request = {
      session: sessionPath,
      queryInput: {
        audioConfig: {
          sampleRateHertz: sampleRateHertz,
          encoding: encoding,
          languageCode: languageCode,
          speechContexts: speechContexts
        },
        singleUtterance: singleUtterance
      }
    }
}

/**
 * Setup Cloud STT Integration
 */
function setupSTT(){
   // Creates a client
   speechClient = new speech.SpeechClient();

    // Create the initial request object
    // When streaming, this is the first call you will
    // make, a request without the audio stream
    // which prepares Dialogflow in receiving audio
    // with a certain sampleRateHerz, encoding and languageCode
    // this needs to be in line with the audio settings
    // that are set in the client
    requestSTT = {
      config: {
        sampleRateHertz: sampleRateHertz,
        encoding: encoding,
        languageCode: languageCode
      },
      interimResults: interimResults,
      //enableSpeakerDiarization: true,
      //diarizationSpeakerCount: 2,
      //model: `phone_call`
    }

}

/*
 * Setup Media Translation
 */
function mediaTranslation(){
  mediaTranslationClient = new mediatranslation.SpeechTranslationServiceClient();

  // Create the initial request object
  console.log(encoding);
  requestMedia = {
    audioEncoding: encoding,
    sourceLanguageCode: 'en-US',
    targetLanguageCode: 'de-DE'
  }
}

/**
 * Setup Cloud STT Integration
 */
function setupTTS(){
  // Creates a client
  ttsClient = new textToSpeech.TextToSpeechClient();

  // Construct the request
  requestTTS = {
    // Select the language and SSML Voice Gender (optional)
    voice: {
      languageCode: 'en-US', //https://www.rfc-editor.org/rfc/bcp/bcp47.txt
      ssmlGender: 'NEUTRAL'  //  'MALE|FEMALE|NEUTRAL'
    },
    // Select the type of audio encoding
    audioConfig: {
      audioEncoding: encoding, //'LINEAR16|MP3|AUDIO_ENCODING_UNSPECIFIED/OGG_OPUS'
    }
  };
}

 /*
  * Dialogflow Detect Intent based on Audio
  * @param audio file buffer
  * @param cb Callback function to execute with results
  */
 async function detectIntent(audio){
    request.inputAudio = audio;
    console.log(request);
    const responses = await sessionClient.detectIntent(request);
    return responses;
 }

 /*
  * Dialogflow Detect Intent based on Audio Stream
  * @param audio stream
  * @param cb Callback function to execute with results
  */
  async function detectIntentStream(audio, cb) { 
    // execute the Dialogflow Call: streamingDetectIntent()
    const stream = sessionClient.streamingDetectIntent()
      .on('data', function(data){
        // when data comes in
        // log the intermediate transcripts
        if (data.recognitionResult) {
          console.log(
            `Intermediate transcript:
            ${data.recognitionResult.transcript}`
          );
        } else {
            // log the detected intent
            console.log(`Detected intent:`);
            cb(data);
        }
      })
      .on('error', (e) => {
        console.log(e);
      })
      .on('end', () => {
        console.log('on end');
      });

    // Write request objects.
    // Thee first message must contain StreamingDetectIntentRequest.session, 
    // [StreamingDetectIntentRequest.query_input] plus optionally 
    // [StreamingDetectIntentRequest.query_params]. If the client wants 
    // to receive an audio response, it should also contain 
    // StreamingDetectIntentRequest.output_audio_config. 
    // The message must not contain StreamingDetectIntentRequest.input_audio.
    stream.write(request);
    // pump is a small node module that pipes streams together and 
    // destroys all of them if one of them closes.
    await pump(
      audio,
      // Format the audio stream into the request format.
      new Transform({
        objectMode: true,
        transform: (obj, _, next) => {
          next(null, { inputAudio: obj, outputAudioConfig: {
            audioEncoding: `OUTPUT_AUDIO_ENCODING_LINEAR_16`
          } });
        }
      }),
      stream
    );
  };

 /*
  * STT - Transcribe Speech
  * @param audio file buffer
  */
 async function transcribeAudio(audio){
  requestSTT.audio = {
    content: audio
  };
  console.log(requestSTT);
  const responses = await speechClient.recognize(requestSTT);
  return responses;
}


/*
  * Media Translation Stream
  * @param audio stream
  * @param cb Callback function to execute with results
  */
 async function transcribeAudioMediaStream(audio, cb) { 
  var isFirst = true;
  
  const initialRequest = {
    streamingConfig: {
      audioConfig: requestMedia,
      audioContent: null
    }
  }
  
  audio.on('data', chunk => {
    if (isFirst) {
      console.log('one time');
      stream.write(initialRequest);
      isFirst = false;
      console.log(initialRequest);
    }
    console.log('other times');
    const request = {
      streamingConfig: {
        audioConfig: requestMedia
      },
      audioContent: chunk.toString('base64')
    };
    console.log(request);
    //console.log(request);
    stream.write(request);
  });

  const stream = mediaTranslationClient.streamingTranslateSpeech()
  .on('data', function(response){
    console.log('results');
    console.log(response);
    // when data comes in
    // log the intermediate transcripts
    const {result} = response;
    if (result.textTranslationResult.isFinal) {
      console.log(
        `\nFinal translation: ${result.textTranslationResult.translation}`
      );
      console.log(`Final recognition result: ${result.recognitionResult}`);
      cb(result);
    } else {
      /*console.log(
        `\nPartial translation: ${result.textTranslationResult.translation}`
      );
      console.log(
        `Partial recognition result: ${result.recognitionResult}`
      );*/
    }
  })
  .on('error', (e) => {
    //console.log(e);
  })
  .on('end', () => {
    console.log('on end');
  });

};

 /*
  * STT - Transcribe Speech on Audio Stream
  * @param audio stream
  * @param cb Callback function to execute with results
  */
 async function transcribeAudioStream(audio, cb) { 
  const recognizeStream = speechClient.streamingRecognize(requestSTT)
  .on('data', function(data){
    console.log(data);
    cb(data);
  })
  .on('error', (e) => {
    console.log(e);
  })
  .on('end', () => {
    console.log('on end');
  });

  audio.pipe(recognizeStream);
  audio.on('end', function() {
      //fileWriter.end();
  });
};

 /*
  * TTS text to an audio buffer
  * @param text - string written text
  */
async function textToAudioBuffer(text) {
  console.log(text);
  requestTTS.input = { text: text }; // text or SSML
  // Performs the Text-to-Speech request
  const response = await ttsClient.synthesizeSpeech(requestTTS);
  return response[0].audioContent;
}

setupDialogflow();
setupSTT();
setupTTS();
mediaTranslation();
setupServer();