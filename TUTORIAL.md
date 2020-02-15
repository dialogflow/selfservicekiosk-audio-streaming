# Google Cloud / Dialogflow - Self Service Desk Demo

Airport SelfServiceDesk demo, to demonstrate how microphone streaming to GCP works, from a web application.

In this demo, you can start recording your voice, it will display answers on a screen.

**By Lee Boonstra, Developer Advocate @ Google Cloud.**

## Setup Steps

These steps will deploy a Node JS application with a Angular client, to a cluster with **Cloud Run for Anthos**.
It will also deploy a Dialogflow Agent, for intent matching.

### Run Setup Script

1. Create the following project, and assign billing accounts to it:

  - selfservicedesk

1. Set the PROJECT_ID variable: export PROJECT_ID=[gcp-project-id]
   
1. Make sure `$PROJECT_ID` is set: `gcloud config set project $PROJECT_ID`

1. (Optional) Fix the environment variables. First `nano env.txt` then `mv env.txt .env`

1. To start installation: `. setup.sh`



