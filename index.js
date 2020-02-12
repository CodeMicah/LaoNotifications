// Globals
const LOG = true;
const INTERVAL = 5; // Seconds
const SOUND = '/usr/share/sounds/gnome/default/alerts/bark.ogg';
// Imports
const notify = require('node-notifier');
const mysql = require('mysql');
const auth = require('./mysqlAuth.js');
const soundplay = require('play-sound')(opts = {});

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
    notify.notify("Error connecting to database. Aborting");
    throw err;
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
  soundplay.play(SOUND, { timeout: 300 }, function(err) {
    if(err) throw err;
  });
  notify.notify({
    'title': randomWord,
    'message': words[randomWord]//,
    //'sound': '/usr/share/sounds/gnome/default/alerts/bark.ogg'
  });
}
