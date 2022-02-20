function insertDoc(data){
  // Création d'un enregistrement pour chaque activité
  console.log('Mise à jour de la BDD avec '+ data.length + ' éléments...');
  return new Promise(function(resolve, reject) {
    for (var i = 0; i < data.length; i++) {
      // ICI : mettre un test : si l'enregistrement existe déjà, on ne l'insert pas !
      // ?1 : comment
      console.log('on va insérer une donnée...')
      stravaDb.insert(data[i])
      .then(data => {
        console.log('... ok pour la ligne n°' + i + ' = '+ data);
        if(i==data.length){
          console.log('Dernier enregistrement --> on resolve');
          resolve();
        }
      })
      .catch(err => console.log(err))
    }
    console.log('... OK, BDD mise à jour !');
  })
}
