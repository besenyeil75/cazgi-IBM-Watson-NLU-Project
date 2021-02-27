const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstace(){

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

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    
let     naturalLanguageUnderstanding = getNLUInstace();
const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': {
            
            }
        }
        };

        naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults.result.emotion.document.emotion);
        })
        .catch(err => {
            console.log('error:', err);
        });

});

app.get("/url/sentiment", (req,res) => {

let     naturalLanguageUnderstanding = getNLUInstace();
const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': {
            
            }
        }
        };

        naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //console.log(analysisResults.result.sentiment.document);
            let temp = '';
            for (const [key, value] of Object.entries(analysisResults.result.sentiment.document)) {
                    temp += `${key}: ${value}  `  ;
                    }

            return res.send(temp);
        })
        .catch(err => {
            console.log('error:', err);
        });

    
});

app.get("/text/emotion", (req,res) => {
    let     naturalLanguageUnderstanding = getNLUInstace();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': {            
            }
        }
        };

        naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
                        return res.send(JSON.stringify(analysisResults.result.emotion.document.emotion , null, 2));
        })
        .catch(err => {
            console.log('error:', err);
        });

    
});

app.get("/text/sentiment", (req,res) => {
    
     let     naturalLanguageUnderstanding = getNLUInstace();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': {            
            }
        }
        };

        naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
                        
             let temp = '';
            for (const [key, value] of Object.entries(analysisResults.result.sentiment.document)) {
                    temp += `${key}: ${value}  `  ;
                    }

                        return res.send(temp);
                        
        })
        .catch(err => {
            console.log('error:', err);
        });

});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

