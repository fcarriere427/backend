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
  })
}

function main() {
  const promise = newProm();
  promise.then((value) => console.log("retour de la promesse = " + value));
  promise.then((value) => console.log("2ème then = " + value));
}

main()
