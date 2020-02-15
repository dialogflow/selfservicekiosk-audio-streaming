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
