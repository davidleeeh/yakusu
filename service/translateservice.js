const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = process.env.GOOGLE_TRANSLATE_PROJECT_ID;

// Instantiates a client
const translator = new Translate({
    projectId: projectId,
  });

function _translateTo(text, targetLocale) {
    return translator
        .translate(text, targetLocale)
        .then(results => {
            let translation = results[0];
            return translation;
        });
}

function translate(text) {
    return translator
        .detect(text)
        .then(results => {
            let detections = results[0];
            
            // For simplicity, just use the first detected language
            detections = Array.isArray(detections) ? detections[0] : detections;

            let targetLanguage;

            if (detections.language === 'en') {
                targetLanguage = 'ja';
            } else if(detections.language === 'ja') {
                targetLanguage = 'en';
            }

            return targetLanguage;
        })
        .then(function(targetLanguage) {
            if (targetLanguage) {
                return _translateTo(text, targetLanguage);
            } else {
                return Promise.resolve(text);
            }
        });
}

module.exports = {
    translate
};

