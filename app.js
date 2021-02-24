import express from 'express';
import line from '@line/bot-sdk';
import cron from 'node-cron';
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from '@azure/storage-blob';

let levelCondition = ['EASY', 'MEDIUM', 'HARD'];
let leetcodeArray = [];
let binarySearchArray = [];
let backtrackingArray = [];
let BFSArray = [];
let DPArray = [];
let slidingWindowArray = [];
let twoPointsArray = [];
let greedyArray = [];
let topologicalSortArray = [];
let treeArray = [];
let divideAndConquerArray = [];
let groupIdMap = new Map();

function getRandom(x) {
    return Math.floor(Math.random() * x);
};

cron.schedule('0 9 * * *', () => {
    // console.log('running a task every minute');
    sendScheduledQuestion();
}, { timezone: "Asia/Taipei" });

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

function loadGoogleSheet(spreadsheetId){
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        console.log('Success loading secert file');
        authorize(JSON.parse(content), (auth)=>listMajors(auth, spreadsheetId));
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    console.log(client_id, client_secret, redirect_uris);
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
* @param {getEventsCallback} callback The callback for the authorized client.
*/
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see 
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth, spreadsheetId) {
    const sheets = google.sheets({ version: 'v4', auth });
    getAllQuestions(sheets, spreadsheetId);
    getBinarySearchQuestions(sheets, spreadsheetId);
    getBacktrackingQuestions(sheets, spreadsheetId);
    getBFSQuestions(sheets, spreadsheetId);
    getDPQuestions(sheets, spreadsheetId);
    getSlidingWindowQuestions(sheets, spreadsheetId);
    getTwoPointsQuestions(sheets, spreadsheetId);
    getGreedyQuestions(sheets, spreadsheetId);
    getTopologicalSortQuestions(sheets, spreadsheetId);
    getTreeQuestions(sheets, spreadsheetId);
    getDivideAndConquerQuestions(sheets, spreadsheetId);
}

function getAllQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Top Interview Questions by LC!A2:H',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[7]}`);
                leetcodeArray.push({ id: row[0], title: row[1], diff: row[2], freq: row[3], tag: row[4], link: row[7] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getBinarySearchQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Binary Search!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                binarySearchArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getBacktrackingQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Backtracking!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                backtrackingArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getBFSQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'BFS!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                BFSArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getDPQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'DP!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                DPArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getSlidingWindowQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Sliding Window!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                slidingWindowArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getTwoPointsQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Two Points!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                twoPointsArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getGreedyQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Greedy!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                greedyArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getTopologicalSortQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Topological Sort!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                topologicalSortArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getTreeQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Tree!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                treeArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}

function getDivideAndConquerQuestions(sheets, spreadsheetId) {
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Divide And Conquer!A2:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        // console.log(res.data);
        if (rows.length) {
            // console.log('Name, Title, Link');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
                divideAndConquerArray.push({ id: row[0], title: row[1], diff: row[2] });
            });
        } else {
            console.log('No data found.');
        }
    });
}



// function randomQuestion() {
//     console.log('without diff');
//     var randomId = getRandom(leetcodeArray.length);
//     var question = leetcodeArray[randomId];
//     console.log(question);
//     var returnText = 'Id : ' + question.id + "(" + question.diff + ")\n Title : " + question.title + "\n Link : " + question.link;
//     return returnText;
// }

function getContainsElements(array) {
    return leetcodeArray.filter(item => array.filter(item2 => item.id === item2.id));
}

function questionFilter(tag = '', diff = '') {
    var questionArray = [];
    switch (tag.toUpperCase()) {
        case 'BS':
            questionArray = binarySearchArray;
            break;
        case 'DFS':
            questionArray = backtrackingArray;
            break;
        case 'BFS':
            questionArray = BFSArray;
            break;
        case 'DP':
            questionArray = DPArray;
            break;
        case 'SW':
            questionArray = slidingWindowArray;
            break;
        case 'TP':
            questionArray = twoPointsArray;
            break;
        case 'GREEDY':
            questionArray = greedyArray;
            break;
        case 'TS':
            questionArray = topologicalSortArray;
            break;
        case 'TREE':
            questionArray = treeArray;
            break;
        case 'DAC':
            questionArray = divideAndConquerArray;
            break;
        default:
            if (levelCondition.includes(tag.toUpperCase()))
                diff = tag;
            questionArray = leetcodeArray;
            break;
    }
    switch (diff.toUpperCase()) {
        case 'EASY':
            questionArray = questionArray.filter(item => item.diff === 'Easy');
            break;
        case 'MEDIUM':
            questionArray = questionArray.filter(item => item.diff === 'Medium');
            break;
        case 'HARD':
            questionArray = questionArray.filter(item => item.diff === 'Hard');
            // console.log(questionArray);
            break;
        default:
            break;
    }
    if(tag.toUpperCase() === 'FREQ')
        questionArray = questionArray.filter(item=>item.freq >= diff);
    var randomId = getRandom(questionArray.length);
    var question = questionArray[randomId];
    // console.log(randomId);
    // console.log(question);
    return question;
}

function getQuestionMessage(question) {

    // var randomId = getRandom(leetcodeArray.length);
    // console.log(randomId);
    //console.log(leetcodeArray[randomId]);
    var question = leetcodeArray.find(item => item.id === question.id);
    var returnText = 'Id : ' + question.id + '(' + question.diff + ')\n' +
        'Title : ' + question.title + '\n' +
        'Freq:' + question.freq + '\n' +
        'Tag: ' + question.tag + '\n' +
        'Link : ' + question.link;
    return returnText;
}

function getHelpMessage() {
    var returnText = 
        '* Type "draw help" for help information \n' +
        '* Type "draw" for picking up a random question \n' +
        '* Type "draw freq [number] for picking up a random question more than or equal to given number \n' +
        '* Type "draw [category]" for picking up a random question by category \n' +
        '* Type "draw [level]" for picking up a random question by level \n' +
        '* Type "draw [category] [level]" for picking up a random question by category and level \n' +
        '* All parameters are case insensitive (ignore case) \n' +
        '* Example : \n' +
        'draw BS Hard \n' +
        'draw TS \n' +
        'draw hard \n' +
        'draw freq 3 \n\n' +
        '* Category : \n' +
        '[BS] Binary Search \n' +
        '[DS] Backtracking \n' +
        '[BFS] BFS \n' +
        '[DP] DP \n' +
        '[SW] Sliding Window \n' +
        '[TP] Two points \n' +
        '[Greedy] Greedy \n' +
        '[TS] Topological sort \n' +
        '[Tree] Tree \n' +
        '[DAC] Divide and Conquer \n' +
        '* Level : \n' +
        '[Easy,Medium,Hard] \n'+
        '* Freq : \n' +
        '[0,1,2,3,4,5] \n'

    return returnText;
}

function sendScheduledQuestion() {
    var question = questionFilter();
    var questionString = getQuestionMessage(question);
    client.broadcast({
        type: 'text',
        text: 'Daily Challenge \n'+ questionString,
    });
    groupIdMap.forEach(function(value, key) {
        client.pushMessage(key, {
            type: 'text',
            text: 'Daily Challenge \n'+ questionString,
        })
    });
}


async function loadingKeyVault() {
    const keyVaultName = process.env["KEY_VAULT_NAME"];
    const KVUri = "https://" + keyVaultName + ".vault.azure.net";
    console.log("Loading Keyvault");
    console.log(KVUri);
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(KVUri, credential);
    
    return {
        channelAccessToken: await client.getSecret("channelAccessToken"),
        channelSecret: await client.getSecret("channelSecret"),
        storageConnectionString : await client.getSecret("leetcodebeiStorageConnectionString"),
        spreadsheetId: await client.getSecret("spreadsheetId")
    }
}

async function loadingStorageAccount(storageConnectionString){
    console.log("Loading google sheet credential & token");
    const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);
    const containerClient = blobServiceClient.getContainerClient("googlesheet");
    const credentialBlob = containerClient.getBlockBlobClient("credentials.json");
    const tokenBlob = containerClient.getBlockBlobClient("token.json");
    const credentialBlobResponse = await credentialBlob.download(0);
    const tokenBlobResponse = await tokenBlob.download(0);
    const credentialString  = await streamToString(credentialBlobResponse.readableStreamBody);
    const tokenString  = await streamToString(tokenBlobResponse.readableStreamBody);
    fs.writeFile("credentials.json", credentialString, (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', "credentials.json");
    });
    fs.writeFile("token.json", tokenString, (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', "token.json");
    });
}

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }


const app = express();
const keyVaultConfig = await loadingKeyVault();
await loadingStorageAccount(keyVaultConfig.storageConnectionString.value);
// loadingKeyVault().then((keyVaultConfig) => {
console.log('Done');
// console.log(channelSecret);
// console.log(channelAccessToken);
var config = {
    channelAccessToken: keyVaultConfig.channelAccessToken.value,
    channelSecret: keyVaultConfig.channelSecret.value
};
loadGoogleSheet(keyVaultConfig.spreadsheetId.value);
const client  = new line.Client(config);
app.get('/getquestion', function (req, res) {
    var diff = req.query.diff;
    var tag = req.query.tag;
    var question = questionFilter(tag, diff);
    res.send(getQuestionMessage(question));
});

app.post('/webhook',line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});
app.listen(3000, function(){
    console.log("listening port 3000");
});
// }).catch((ex) => console.log(ex.message));

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    if (event.source.groupId !== undefined) {
        if (!groupIdMap.has(event.source.groupId))
            groupIdMap.set(event.source.groupId, "");
    }
    var commandArray = event.message.text.split(" ");
    if (commandArray[0].toUpperCase() === 'DRAW') {

        if (commandArray[1] !== undefined && commandArray[1].toUpperCase() === 'HELP') {
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: getHelpMessage()
            });
        }
        var question = questionFilter(commandArray[1], commandArray[2]);
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: getQuestionMessage(question)
        });
    }
}