[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Google Cloud / Dialogflow - Self Service Kiosk Demo

**By Lee Boonstra, Developer Advocate @ Google Cloud.**

[![Open in Cloud Shell](http://gstatic.com/cloudssh/images/open-btn.svg)](https://console.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https%3A%2F%2Fgithub.com%2Fdialogflow%2Fselfservicekiosk-audio-streaming&cloudshell_tutorial=TUTORIAL.md)

Airport SelfServiceDesk demo, to demonstrate how microphone streaming to GCP works, from a web application.

In this demo, you can start recording your voice, it will display answers on a screen.

![alt text](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/docs/architecture2.png "Architecture")

![alt text](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/docs/screen.png "Screenshot")

# Get a Node.js environment

1. `apt-get install nodejs -y`

1. `apt-get npm`

# Get an Angular environment

1. `sudo npm install -g @angular/cli`

# Clone Repo

1. `git clone https://github.com/dialogflow/selfservicekiosk-audio-streaming.git selfservicekiosk`

# Setup Local Environment

These steps will deploy a Node JS application with a Angular client, to a cluster with **Cloud Run for Anthos**.
It will also deploy a Dialogflow Agent, for intent matching.

1. Set the PROJECT_ID variable: export PROJECT_ID=[gcp-project-id]

1. Set the project: `gcloud config set project $PROJECT_ID`

1. Download the service account key.

1. Assign the key to environment var: **GOOGLE_APPLICATION_CREDENTIALS**

 LINUX/MAC
 `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account.json`
 WIN
 `set GOOGLE_APPLICATION_CREDENTIALS=c:\keys\key-ssd.json`

1. Login: `gcloud auth login`

1. Open **env.txt**, change the environment variables and rename the file to **.env**

1. Enable APIs:

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
  texttospeech.googleapis.com \
  translate.googleapis.com
```

1. Build the client-side Angular app:
    
    ```
    cd client && sudo npm install
    npm run-script build
    ```

2. Start the server Typescript app, which is exposed on port 8080:

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

## Deploy with App Engine Flex

This demo makes heavy use of websockets and
the microphone `getUserMedia()` HTML5 API requires
to run over HTTPS. Therefore, I deploy this demo
with a custom runtime, so I can include my own **Dockerfile**.

1. Edit the **app.yaml** to tweak the environment variables.
Set the correct Project ID.

1. Deploy with: `gcloud app deploy`

1. Browse: `gcloud app browse`

 