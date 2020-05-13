[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Google Cloud / Dialogflow - Self Service Kiosk Demo

[![Open in Cloud Shell](http://gstatic.com/cloudssh/images/open-btn.svg)](https://console.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https%3A%2F%2Fgithub.com%2Fdialogflow%2Fselfservicekiosk-audio-streaming&cloudshell_tutorial=TUTORIAL.md)

A best practice for streaming audio from a browser microphone to Dialogflow or Google Cloud STT by using websockets.

Airport SelfService Kiosk demo, to demonstrate how microphone streaming to GCP works, from a web application.

It makes use of the following GCP resources:

* Dialogflow & Knowledge Bases
* Speech to Text
* Text to Speech
* Translate API
* (optionally) App Engine Flex

In this demo, you can start recording your voice, it will display answers on a screen and synthesize the speech.

![alt text](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/docs/architecture.png "Architecture")

![alt text](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/docs/screen.png "Screenshot")


# Live demo

A working demo can be found here: [http://selfservicedesk.appspot.com/](http://selfservicedesk.appspot.com/)


# Blog posts

I wrote very extensive blog articles on how to setup your streaming project. Want to exactly learn how this code works? Have a start here:

Blog 1: [Introduction to the GCP conversational AI components, and integrating your own voice AI in a web app.](https://medium.com/@ladysign/building-your-own-conversational-voice-ai-with-dialogflow-speech-to-text-in-web-apps-part-i-b92770bd8b47)  
Blog 2: [Building a client-side web application which streams audio from a browser microphone to a server.](https://medium.com/@ladysign/building-a-client-side-web-app-which-streams-audio-from-a-browser-microphone-to-a-server-part-ii-df20ddb47d4e)  
Blog 3: [Building a web server which receives a browser microphone stream and uses Dialogflow or the Speech to Text API for retrieving text results.](https://medium.com/google-cloud/building-a-web-server-which-receives-a-browser-microphone-stream-and-uses-dialogflow-or-the-speech-62b47499fc71)  
Blog 4: [Getting Audio Data from Text (Text to Speech) and play it in your browser.](https://medium.com/@ladysign/getting-audio-data-from-text-text-to-speech-and-play-it-in-your-browser-part-iv-cd2d6ea71c6a)

# Slides & Video

There's a [presentation](https://speakerdeck.com/savelee/implementing-a-custom-ai-voice-assistant-by-streaming-webrtc-to-dialogflow-and-cloud-speech) and a [video](https://youtu.be/6JD8WC1LV7g) that accompanies the tutorial.

[![Slidedeck AudioStreaming](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/docs/slidedeck.png)](https://speakerdeck.com/savelee/implementing-a-custom-ai-voice-assistant-by-streaming-webrtc-to-dialogflow-and-cloud-speech)

# Setup Local Environment

## Get a Node.js environment

1. `apt-get install nodejs -y`

1. `apt-get npm`

## Get an Angular environment

1. `sudo npm install -g @angular/cli`

## Clone Repo

1. `git clone https://github.com/dialogflow/selfservicekiosk-audio-streaming.git selfservicekiosk`

2. Set the PROJECT_ID variable: export PROJECT_ID=[gcp-project-id]

3. Set the project: `gcloud config set project $PROJECT_ID`

4. Download the service account key.

5. Assign the key to environment var: **GOOGLE_APPLICATION_CREDENTIALS**

 LINUX/MAC
 `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account.json`
 WIN
 `set GOOGLE_APPLICATION_CREDENTIALS=c:\path\to\service_account.json`

6. Login: `gcloud auth login`

7. Open **server/env.txt**, change the environment variables and rename the file to **server/.env**

8. Enable APIs:

 ```
  gcloud services enable \
  appengineflex.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  cloudtrace.googleapis.com \
  dialogflow.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com \
  sourcerepo.googleapis.com \
  speech.googleapis.com \
  mediatranslation.googleapis.com \
  texttospeech.googleapis.com \
  translate.googleapis.com
```

9. Build the client-side Angular app:
    
    ```
    cd client && sudo npm install
    npm run-script build
    ```

10. Start the server Typescript app, which is exposed on port 8080:

    ```
    cd ../server && sudo npm install
    npm run-script watch
    ```

3. Browse to http://localhost:8080

## Setup Dialogflow

1. Create a Dialogflow agent at: http://console.dialogflow.com

1. Zip the contents of the *dialogflow* folder, from this repo.

1. Click **settings** > **Import**, and upload the Dialogflow agent zip, you just created.

1. *Caution: Knowledge connector settings are not currently included when exporting, importing, or restoring agents.*

    Make sure you have enabled *Beta* features in settings.

    1. Select *Knowledge* from the left menu.
    1. Create a Knowledge Base: **Airports**
    1. Add the following Knowledge Base **FAQs**, as **text/html** documents:

    * https://www.panynj.gov/port-authority/en/help-center/faq/airports-faq-help-center.html
    * https://www.schiphol.nl/en/before-you-take-off/
    * https://www.flysfo.com/faqs

    1. As a response it requires the following custom payload:

    ```
    {
    "knowledgebase": true,
    "QUESTION": "$Knowledge.Question[1]",
    "ANSWER": "$Knowledge.Answer[1]"
    }
    ```

    1. And to make the Text to Speech version of the answer working add the following Text SSML response:

    ```
    $Knowledge.Answer[1]
    ```

# Deploy with App Engine Flex

This demo makes heavy use of websockets and
the microphone `getUserMedia()` HTML5 API requires
to run over HTTPS. Therefore, I deploy this demo
with a custom runtime, so I can include my own **Dockerfile**.

1. Edit the **app.yaml** to tweak the environment variables.
Set the correct Project ID.

1. Deploy with: `gcloud app deploy`

1. Browse: `gcloud app browse`


# Examples

The selfservice kiosk is a full end to end application.
To showcase smaller examples, I've created 6 small demos. Here's how you can get these running:

1. Install the required libraries, run the following command from the *examples* folder:

    `npm install`

2. Start the simpleserver node app:

   `npm --EXAMPLE=1 --PORT=8080 --PROJECT_ID=[your-gcp-project-id] run start`

To switch to the various examples, edit the EXAMPLE variable to one of these:

* Example **1**: Dialogflow Speech Intent Detection
* Example **2**: Dialogflow Speech Detection through streaming
* Example **3**: Dialogflow Speech Intent Detection with Text to Speech output
* Example **4**: Speech to Text Transcribe Recognize Call
* Example **5**: Speech to Text Transcribe Streaming Recognize
* Example **6**: Text to Speech in a browser

3. Browse to http://localhost:8080. Open the inspector, to preview the
Dialogflow results object.

The code required for these examples can be found in **simpleserver.js** for the different Dialogflow & STT calls. - **example1.html** - **example5.html** will show the client-side implementations.

# License

Apache 2.0

This is not an official Google product.