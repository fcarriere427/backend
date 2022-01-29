////////////////
// Serveur : gère les requêtes du front
////////////////

const fs = require('fs').promises;

const express = require('express')
const app = express()

const port = 3000

app.get('/activities', (req, res) => {
  try{
    res.json("réponse du serveur !");
  } catch (err) {
    res.status(500);
    res.json({
      error: true,
      errorMsg: err,
    })
  }
}

app.get('/autre', async (req, res) => {
  try{
    // When an Error is thrown in the try block the rest
    // of the block is not executed, execution continues
    // in the catch bloclk
  	const fileContent = await fs.readFile('helloworld.txt','utf8');
  	res.json({
      fileContent,
      error: false
    });
  } catch (err) {
    // In the catch block we receive the error as an argument
    // set response status to 500, to denote a internal error
    res.status(500);
    res.json({
      fileContent: null,
      error: true,
      errorMsg: err,
    })
  }
});

app.listen(
  port,
  () => console.log(`app listening at http://localhost:${port}`)
);
