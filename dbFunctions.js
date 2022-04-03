//*** Intégration des données dans la BDD

// Récupération des clés pour se connecter à couchDB
const couchKeys = require('./keys/couchDB.json');
var user = couchKeys.user;
var pwd = couchKeys.password;
var host = couchKeys.host;
var port = couchKeys.port;
var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
// Ouverture de la BDD
const nano = require ('nano')(url);
const DBNAME = 'strava'
var stravaDb = nano.db.use(DBNAME);

// tableau pour la liste des ID existants // global car appelé dans les 2 fonctions
var existingID = [];

// ???  Description
function readMonthTotal() {
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'group_by_month', {reduce: true, group_level: 2}, function(err,body) {
      if (!err) {
        resolve(body);
      } else {
        console.log('error readMonthTotal = ' + JSON.stringify(err));
      }
    });
  })
}

// ???  Description
function readRec(id) {
  return new Promise((resolve, reject) => {
    const idNum = parseInt(id); /// des heures pour trouver ça... :-(
    stravaDb.view('strava', 'activities_by_id', {key: idNum, include_docs: true}, function(err,body) {
      if (!err) {
        // for each... mais il n'y a qu'une ligne normalement !
        body.rows.forEach(doc => { resolve(doc.doc) })
      } else {
        console.log('error readRec = ' + JSON.stringify(err));
      }
    });
  })
}

// ???  Description
function readDB(year) {
  let s_key = year + "-12-31T23:59:59Z"; // attention, on est en ordre descendant !
  let e_key = year + "-01-01T00:00:00Z";
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'activities_by_date',{startkey: s_key, endkey: e_key, include_docs: true, descending: true}, function(err,body) {
      if (!err) {
        resolve(body.rows);
      } else {
        console.log('error readDB = ' + err);
      }
    });
  })
}

// ???  Description
function updateDB(data, page) {
  existingID = [];
  return new Promise((resolve, reject) => {
    console.log('   ... mise à jour de la DB avec la page ' + page + '...');
    readID(stravaDb)
    .then(() => insertNew(data,stravaDb))
    .then(data => resolve(data))
  })
}

// ???  Description
function readID(stravaDb) {
  return new Promise((resolve, reject) => {
    //console.log("      ... mise à jour du tableau des ID Strava, à partir de la BDD existante...");
    var count = 0;
    // pour chaque ligne de la BDD, on va écrire un élément dans le tableau existingID
    stravaDb.list()
    .then((body) => {
      if (body.rows.length == 0){
        // si la BDD est vide, on ne fait rien
        //console.log("      ... pas d\'ID existant, la BDD est vide !");
        resolve();
      }
      else {
        // sinon on remplit le tableau existingID
        body.rows.forEach((item, i) => {
          stravaDb.get(body.rows[i].id)
          .then((doc) => {
            existingID[i] = doc["id"];
            count = count + 1;
            // console.log('   ... count = ' + count);
            if(count==body.rows.length){
              //console.log('      ... tableau des ID Strava mis à jour !');
              resolve();
            }
          })
        })
      }
    })
  })
}

// ???  Description
function insertNew(data, stravaDb){
  // Création d'un enregistrement pour chaque activité
  console.log('   ... mise à jour de la DB avec '+ data.length + ' éléments...');
  return new Promise((resolve, reject) => {
    // count = longueur du tableau = tous les enregistrements qu'on a va essayer d'insérer
    // count_insert = nb d'enregistrements qu'on aura vraimenté insérés ici
    var count = 0;
    var count_insert = 0;
    for (let i = 0; i < data.length; i++) {
      // si l'ID n'existe pas déjà, on ajoute l'enregistrement
      if(!existingID.includes(data[i].id)) {
        stravaDb.insert(data[i], function(){
          count = count + 1;
          count_insert = count_insert + 1;
          if(count==data.length){
            console.log('   ... OK, DB mise à jour avec ' + count_insert + ' élements (sur les ' + data.length + ' initiaux)');
            resolve(count_insert);
          }
        })
      } else {
        // sinon, si l'ID existait déjà, on ne fait rien...
        count = count + 1;
        // .sauf si  on est au dernier enregistrement...
        if(count==data.length){
          //... et où on renvoie le nb d'enregistrements créés
          console.log('      ... OK, DB mise à jour avec ' + count_insert + ' élements (sur les ' + data.length + ' initiaux)');
          resolve(count_insert);
        };
      }
    }
  })
}

// ???  Description
async function renewDB() {
  try {
    await nano.db.destroy(DBNAME);
    console.log('DB détruite...');
  } catch (e) {
    console.log('DB does not exist!');
  }
  await nano.db.create(DBNAME);
  console.log('... DB recréee, OK !');
  console.log('Création de vue...');
  await createViewDB();
  console.log('... vue créee, OK !');
}

// ???  Description
function createViewDB() {
  stravaDb.insert({
    "views":{
      "activities_by_date": {
        "map": function (doc) { if(doc.type == 'Run') emit(doc.start_date, doc.distance) }
      },
      "activities_by_distance": {
        "map": function (doc) { if(doc.type == 'Run') emit (doc.distance, null); }
      },
      "activities_by_id": {
        "map": function (doc) { if(doc.type == 'Run') emit (doc.id, null); }
      },
      "group_by_month": {
        "map": function (doc) {
          if(doc.type == 'Run') {
            const [date, time] = doc.start_date.split("T");
            const [year, month, day] = date.split("-");
            emit([year, month, day], doc.distance);
          }
        },
        "reduce":"_sum"
      }
    }
  },
  '_design/strava',
  function (error, response) {
    if (!error){
      console.log('OK, design created!');
    } else {
      console.log('Error, design not created! Error = ' + error);
    }
  })
}

// Renvoie la date de la dernière activité, au  format "2022-04-02T07:43:20Z" (UTC)
function readLastActivityDate() {
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'activities_by_date',{limit: 1, include_docs: true, descending: true}, function(err,body) {
      if (!err) {
          // for each... mais il n'y a qu'une ligne normalement !
          body.rows.forEach(doc => { resolve(doc.doc.start_date) })
      } else {
          console.log('error readLastActivityDate = ' + JSON.stringify(err));
      }
    });
  })
}

// Renvoie le nb de km de l'année passée en paramètre
function readYearDistance(year) {
  let year_distance = [];
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'group_by_month', {reduce: true, group_level: 1}, function(err,body) {
      if (!err) {
        body.rows.forEach(doc => {
          year_distance[doc.key] = doc.value;
        });
        let distance = year_distance[year]; // en mètres
        distance = Math.round(distance/1000*10)/10;; // div par 1000 pour passer en km, puis arrondi au dixième
        resolve(distance);
      } else {
        console.log('error readYearDistance = ' + JSON.stringify(err));
      }
    });
  })
}

// Renvoie un json avec les distances (km) pour toutes les années
function readAllYearDistance() {
  let year_distance = [];
  console.log("INIT // year_distance.length = " + year_distance.length);
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'group_by_month', {reduce: true, group_level: 1}, function(err,body) {
      if (!err) {
        body.rows.forEach(doc => {
          let year = doc.key.toString();
          let distance = Math.round(doc.value/1000*10)/10;
          year_distance[`${year}`] = `${distance}`;
        });
        let response = JSON.stringify(Object.assign({}, year_distance));
        resolve(response);
        // resolve(body);
      } else {
        console.log('error readAllYearDistance = ' + JSON.stringify(err));
      }
    });
  })
}

module.exports = {
   updateDB,
   renewDB,
   readDB,
   readRec,
   readMonthTotal,
   readLastActivityDate,
   readYearDistance,
   readAllYearDistance
 }
