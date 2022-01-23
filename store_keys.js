var fs = require('fs');

var myOptions = {
  id: '60862',
  secret: '2de20b9281f033da472a94eb775743eaa95bd49d',
  token: '1fa2b3a8d0efb1df86c7f4ed1d67fc03e89ea3ac'
};

var data = JSON.stringify(myOptions);

fs.writeFile('./strava_keys.json', data, function (err) {
  if (err) {
    console.log('There has been an error saving your configuration data.');
    console.log(err.message);
    return;
  }
  console.log('Configuration saved successfully.')
});
