// Globals
const LOG = true;
const INTERVAL = 1; // Seconds

// Imports
const notify = require('node-notifier');
const mysql = require('mysql');
const auth = require('./mysqlAuth.js');

// Logging
const log = LOG ? console.log : () => {};

// Variables
var words = {}; // { 'concept': 'meaning' }
var keys;

// Get words from database
const conn = mysql.createConnection({
  host: auth.host,
  user: auth.user,
  password: auth.password,
  database: auth.database
});

conn.connect(err => {
  if(err) {
    throw err;
    notify.notify("Error connecting to database. Aborting");
    process.exit();
  }
  log('Connected to database');
  let sql = "SELECT * FROM vocab";
  conn.query(sql, (err, result) => {
    if (err) throw err;
    result.forEach(e => {
      words[e.concept] = e.meaning;
    });
    log("Got words");
    keys = Object.keys(words);
    setInterval(sendWord, INTERVAL * 1000);
  });
});

function sendWord() {
  const randomWord = keys[Math.floor(Math.random() * keys.length)];
  notify.notify(randomWord + ": " + words[randomWord]);
}
