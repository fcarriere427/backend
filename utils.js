function httpsRequest(params, postData) {
    //console.log("Requête http... avec : " + params);
    return new Promise(function(resolve, reject) {
      var req = https.request(params, function(res) {
          // cumulate data
          var body = [];
          res.on('data', function(chunk) {
              body.push(chunk);
          });
          // resolve on end
          res.on('end', function() {
              try {
                body = JSON.parse(Buffer.concat(body).toString()); // --> renvoie un tableau
              }
              catch(e) {
                reject(e);
              }
              resolve(body);
          });
      });
      if (postData) {
          req.write(postData);
      }
      req.on('error', error => {
        console.log("Erreur httpsRequest");
        console.error(error);
      })
      // IMPORTANT
      req.end();
  });
}

function saveData(data, filename) {
  console.log("Sauvegarde des nouveaux tokens...");
  return new Promise(function(resolve, reject) {
    fs.writeFile(filename, data, 'utf-8', (err) => {
        if (err) reject(err);
        else {
          console.log("... OK, tokens sauvegardés !");
          resolve(data);
        }
    });
  });
}


module.exports = {
   httpsRequest,
   saveData
 }
