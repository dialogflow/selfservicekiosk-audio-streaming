/// <reference types="node" />
export declare class Speech {
    private languageCode;
    private encoding;
    private sampleRateHertz;
    private ssmlGender;
    private tts;
    private stt;
    private ttsRequest;
    private sttRequest;
    constructor();
    setupSpeech(): void;
    speechToText(audio: Buffer): Promise<{
        'transcript': any;
        'detectLang': string;
    }>;
    textToSpeech(text: string): Promise<any>;
}
export declare let speech: Speech;
