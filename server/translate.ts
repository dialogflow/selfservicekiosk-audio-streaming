import * as dotenv from 'dotenv';

const { TranslationServiceClient } = require("@google-cloud/translate");

interface LooseObject {
    [key: string]: any
}

dotenv.config();

export class Translate {
    request: LooseObject;
    translationClient: any;
    projectId: string;

    constructor() {
        this.projectId = process.env.PROJECT_ID;
        this.setupTranslate();
    }

    setupTranslate(){
        // Instantiates a client
        this.translationClient = new TranslationServiceClient();

        this.request = {
            parent: `projects/${this.projectId}/locations/us-central1`,
            mimeType: 'text/plain' // mime types: text/plain, text/html
        };
    }

    async translate(text: string, targetLang: string) {
        // Set the text for translation in request
        this.request.contents = [text];
        this.request.targetLanguageCode = targetLang;
        // Run request
        const [response] = await this.translationClient.translateText(this.request);
        const translation = response.translations[0];
        return {
            'languageCode' : translation.detectedLanguageCode,
            'translatedText' : translation.translatedText
        };
    }
}

export let translate = new Translate();