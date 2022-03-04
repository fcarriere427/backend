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

// TO DO
async function readRec(id) {
  console.log('dans readRec, id = ' + id);
  await stravaDb.get(dbID, function(err,body) {
    if (!err) {
      return(body.rows);
    } else {
      console.log('error = ' + err);
    }
  });
}

function readDB() {
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'activities_by_date',{include_docs: true, descending: true}, function(err,body) {
      if (!err) {
        resolve(body.rows);
      } else {
        console.log('error = ' + err);
      }
    });
  })
}

function updateDB(data, page) {
  existingID = [];
  return new Promise((resolve, reject) => {
    console.log('   ... mise à jour de la DB avec la page ' + page + '...');
    readID(stravaDb)
    .then(() => insertNew(data,stravaDb))
    .then((data) => resolve(data))
  })
}

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

async function insertNew(data, stravaDb){
  // Création d'un enregistrement pour chaque activité
  console.log('   ... mise à jour de la DB avec '+ data.length + ' éléments...');
  var count = 0;
  var count_insert = 0;
  for (let i = 0; i < data.length; i++) {
    if(!existingID.includes(data[i].id)) {
      stravaDb.insert(data[i], function(){
        count = count + 1;
        count_insert = count_insert + 1;
        if(count==data.length){
          console.log('   ... OK, DB mise à jour avec ' + count_insert + ' élements (sur les ' + data.length + ' initiaux)');
          return(count_insert);
        }
      })
    } else {
      // sinon, si l'ID existait déjà, on ne fait rien...
      count = count + 1;
      // .sauf si  on est au dernier enregistrement...
      if(count==data.length){
        //...  où on crée l'index sur l'id Strava
        const stravaIDIndexDef = {
          index: { fields: ['id'] },
          name: 'stravaIdIndex'
        };
        const response = await stravaDb.createIndex(stravaIDIndexDef);
        console.log('      ... index sur ID Strava créé');
        //... et où on renvoie le nb d'enregistrements créés
        console.log('      ... OK, DB mise à jour avec ' + count_insert + ' élements (sur les ' + data.length + ' initiaux)');
        return(count_insert);
      };
    }
  }
}

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

function createViewDB() {
  stravaDb.insert(
  {"views":
    { "activities_by_date":
      {"map": function (doc) { emit (doc.start_date, doc); } },
      "activities_by_distance":
      {"map": function (doc) { emit (doc.distance, doc); } }
    }
  },
  '_design/strava',
  function (error, response) {
    if (!error){
      console.log('OK, design created!');
    } else {
      console.log('ERROR, design not created! Error = ' + error);
    }
  })
}

module.exports = {
   updateDB,
   renewDB,
   readDB,
   readRec
 }