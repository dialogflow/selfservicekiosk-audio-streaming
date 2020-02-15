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
       languageCode: languageCode
     },
     singleUtterance: singleUtterance
   }
 }