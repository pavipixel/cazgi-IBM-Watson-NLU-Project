const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = new express();
app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {

  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;
  
  const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
  const { IamAuthenticator } = require('ibm-watson/auth');

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });

  return naturalLanguageUnderstanding;
}


app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    let urlToAnalyse = req.query.url;

    let natural = getNLUInstance();

    const analyzeParams = {
        'url': urlToAnalyse,
        'features': {
            'emotion': {
                'document': true
            }
        }
    };

    natural.analyze(analyzeParams).then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error:', err);
        res.send(err.toString());
    });

});

app.get("/url/sentiment", (req,res) => {
    
    let urlToAnalyse = req.query.url;

    let natural = getNLUInstance();

    const analyzeParams = {
        'url': urlToAnalyse,
        'features': {
            'sentiment': {        
                'document': true
            }
        }
    };

    natural.analyze(analyzeParams).then(analysisResults => {
        res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error:', err);
        res.send(err.toString());
    });

    
});

app.get("/text/emotion", (req,res) => {

    let textToAnalyse = req.query.text;

    let natural = getNLUInstance();

    const analyzeParams = {
        'text': textToAnalyse,
        'features': {
            'emotion': {        
                'targets': [
                    'happy',
                    'fun',
                    'joy',
                    'relieved',
                    'enthusiasm',
                    'naughty',
                    'troubled',
                    'cruel',
                    'normal',
                    'mischievous'
                ]
            }
        }
    };

    natural.analyze(analyzeParams).then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error:', err);
        res.send(err.toString());
    });

});

app.get("/text/sentiment", (req,res) => {

    let textToAnalyse = req.query.text;

    let natural = getNLUInstance();

    const analyzeParams = {
        'text': textToAnalyse,
        'features': {
            'sentiment': {        
                'targets': [
                    'happy',
                    'fun',
                    'joy',
                    'relieved',
                    'enthusiasm',
                    'naughty',
                    'troubled',
                    'cruel',
                    'normal',
                    'mischievous'
                ]
            }
        }
    };

    natural.analyze(analyzeParams).then(analysisResults => {
        res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error:', err);
        res.send(err.toString());
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

