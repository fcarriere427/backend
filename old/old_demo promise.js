const reAuthorize = require('./reAuthorize');

// function test() {
//   var prom = new Promise((resolve,reject) => {
//     console.log("createur de la promise");
//     resolve("retour créateur");
//   });
//
//   prom.then((value) => {
//     console.log("retour du createur = " + value);
//   });
// }

function newProm() {
  return new Promise((successCB, failCB) => {
      // ici lancer la requête asynchrone
      reAuthorize();
      successCB("OK !");
  }).then(function() {
    console.log("then de la promesse")
  })
}

function main() {
  const promise = newProm();
  promise.then((value) => console.log("retour de la promesse = " + value));
}

main()
