const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Director = require('./models/director');
const e = require('express');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded( { extended: false }));

// mongoose.connect(
//   "mongodb+srv://alex_db_user:2K1cvEoa0BelyCOA@directors.ii3vlqd.mongodb.net/?retryWrites=true&w=majority&appName=Directors")
//   .then(() => console.log('Connected to database'))
//   .catch((err) => {
//     console.log(err);
// });

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, resp) => {
  const director = req.body.director;
  const results = [];
  const query = req.body.director.split(" ").join("%20")
  const url = `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
    }
  };
  fetch(url, options)
    .then(res => res.json())
    .then(res => {
      res.results.forEach((e, i) => {
        if (e.name === director && e.known_for_department === 'Directing'){
          results.push(e);
        }
      });
      const mapped = results.map((e) => {
        const knownFor = e.known_for.map(film => {
          return {
            title: film.title,
            releaseDate: film.release_date
          }
        });
        return { name: e.name, knownFor: knownFor };
      });
      resp.render('confirmDirector', {
        results: mapped,
      });
    })
    .catch(err => console.error(err));

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