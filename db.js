const mysql = require('mysql');

const keys = require('./keys/db.json');
var user = keys.user;
var password = keys.password;

const con = mysql.createConnection({
  host: "localhost",
  user: user,
  password: password,
  database : "strava"
});

con.connect(function(err) {
   if (err) throw err;
   console.log("Connecté à la base de données MySQL!");
   con.query("SELECT eleves.id as 'eleve_id', eleves.nom as 'eleve_nom', eleves.cours_id, cours.nom as 'cours_nom', cours.date as 'cours_date' FROM eleves JOIN cours on eleves.cours_id = cours.id", function (err, result) {
       if (err) throw err;
       console.log(result);
     });
 });
