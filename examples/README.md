# Speech to Text / Text to Speech examples

**by: Lee Boonstra, Developer Advocate Conversational AI, Google Cloud**

How would you implement Dialogflow Speech or Cloud Speech to Text,
when the audio doesn't come from an audio file, but from an actual
microphone, running in a webapp? Although the Google Cloud API calls
are straightforeward, it might be difficult to figure out the full
realworld implementation, where you will have to deal with the browser microphone streaming the audio data to a back-end.
These demo's will show you how to do so.

Here are the steps, to run these examples locally:

1. Get this repo running locally:
   
   Follow the steps from https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/README.md. You can skip the Deploy with AppEngine steps.

   These steps will: setup a Google Cloud Project, enable Google Cloud APIs, setup a service account and setup a Dialogflow Agent.

2. Install the required libraries, run the following command in this *examples* folder:

    `npm install`

3. Start the simpleserver node app:

   `npm --EXAMPLE=1 --PORT=8080 --PROJECT_ID=[your-gcp-project-id] run start`

To switch to the various examples, edit the EXAMPLE variable to one of these:

* Example **1**: Dialogflow Speech Intent Detection
* Example **2**: Dialogflow Speech Detection through streaming
* Example **3**: Dialogflow Speech Intent Detection with Text to Speech output
* Example **4**: Speech to Text Transcribe Recognize Call
* Example **5**: Speech to Text Transcribe Streaming Recognize
* Example **6**: Text to Speech in a browser
* Example **7**: Media Translation Speech Streaming

1. Browse to http://localhost:8080. Open the inspector, to preview the
Dialogflow results object.

The code required for these examples can be found in **simpleserver.js** for the different Dialogflow & STT calls. - example1.html - example5.html will show the client-side implementation.
