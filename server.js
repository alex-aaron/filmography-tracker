const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Director = require('./models/director');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded( { extended: false }));

app.get('/', (req, res) => {
  res.render('index');
})

app.listen(port, () => {
  console.log('Connection successful');
})

// const url = 'https://api.themoviedb.org/3/search/person?query=David%20Lynch&include_adult=false&language=en-US&page=1';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => console.error(err));