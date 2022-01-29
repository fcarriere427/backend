function test() {
  var prom = new Promise((resolve,reject) => {
    console.log("createur de la promise");
    resolve("retour créateur");
  });

  prom.then((value) => {
    console.log("retour du createur = " + value);
  });
}

test()
