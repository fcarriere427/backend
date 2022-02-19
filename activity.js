// // REQUETE POUR RECUPERER LES ACTIVITES
// function getActivity(id) {
//   console.log("Récupération de l'activité " + id);
//   return new Promise(function(resolve, reject) {
//     console.log('URL d\'appel : ' + `https://www.strava.com/api/v3/activities/` + id + `?access_token=${access_token}`)
//     var options = `https://www.strava.com/api/v3/activities/` + id + `?access_token=${access_token}`;
//     // Lance la requête de récupération de l'activité
//     httpsRequest(options)
//     .then((data) => {
//       storeData(data);
//       resolve(data);
//     })
//     .catch((err) => console.log(err))
//     //.then ((data) => resolve(data));
//   });
// }
