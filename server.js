const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Director = require('./models/director');
const e = require('express');
const { getDirector, getFilms } = require('./requestHandlers/handlers');
const { createFilmsArray, createStreamingArray, createStreamingObject } = require('./helpers/helpers');


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded( { extended: false }));

let final = [];
let filmsWithRuntimes = [];

const getFilmsWithRuntimes = async (ele, index, array, resp, director) => {
  const results = [];
  try {
    const url = `https://api.themoviedb.org/3/movie/${ele.id}?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
      }
    };

    await fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (index !== array.length - 1){
          filmsWithRuntimes.push({
            id: ele.id,
            title: ele.title,
            releaseDate: Number(ele.releaseDate),
            runtime: res.runtime,
          })
        } else {
          filmsWithRuntimes.push({
            id: ele.id,
            title: ele.title,
            releaseDate: Number(ele.releaseDate),
            runtime: res.runtime,
          });

          console.log(filmsWithRuntimes);

          filmsWithRuntimes.forEach(e => {
            const copy = { ...e, };
            results.push(copy);
          });

          results.sort((a, b) => {
            return a.releaseDate - b.releaseDate
          })

          console.log(results);

          filmsWithRuntimes = [];
          resp.render('confirmFilmsWithRuntimes', {
            director: director,
            films: results
          });
        }
      })
  } catch(error){
      console.log(error);
  }
}

const getStreaming = async (ele, index, array, director) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/${ele.id}/watch/providers`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
      }
    };

    await fetch(url, options)
      .then(res => res.json())
      .then(res => {
        const streaming = createStreamingObject(res);
        if (index !== array.length - 1){
          final.push({
            title: ele.title,
            runtime: ele.runtime,
            releaseDate: ele.releaseDate,
            streaming: streaming,
            status: 'Not Watched'
          })
        } else {
          final.push({
            title: ele.title,
            runtime: ele.runtime,
            releaseDate: ele.releaseDate,
            streaming: streaming,
            status: 'Not Watched'
          });
      
          const directorToAdd = new Director({
            name: director,
            films: final,
          });

          
          final = [];
        }
      });
    } catch (error) {
        console.log(error)
    }
  
}

// mongoose.connect(
//   "mongodb+srv://alex_db_user:2K1cvEoa0BelyCOA@directors.ii3vlqd.mongodb.net/?retryWrites=true&w=majority&appName=Directors")
//   .then(() => console.log('Connected to database'))
//   .catch((err) => {
//     console.log(err);
// });

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/director', (req, resp) => {
  getDirector(req.body.director, resp);
});


app.post("/films", (req, resp) => {
  getFilms(req, resp);
});

app.post('/films-with-runtimes', (req, resp) => {
  const director = req.body.director;
  delete req.body.director;

  const array = createFilmsArray(req);
  
  array.forEach((e, i, a) => {
    getFilmsWithRuntimes(e, i, a, resp, director);
  });

});

app.post("/", (req, resp) => {
  const director = req.body.director;
  delete req.body.director;
  const array = createFilmsArray(req);
  console.log(array);

  
});


app.listen(port, () => {
  console.log('Connection successful');
});

// make an api call for each film to get its streaming providers


/*
app.post('/')

const director = req.body.director;
  delete req.body.director;
  
  const array = createFilmsArray(req);
  console.log(array);

  array.forEach((e, i) => {
    const url = `https://api.themoviedb.org/3/movie/${e.id}/watch/providers`;
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
        const streaming = createStreamingObject(res);
        e.streaming = streaming;
        if (i === array.length - 1){
          const final = array.map((e) => {
            return {
              title: e.title,
              releaseDate: e.releaseDate,
              status: 'Not Watched',
              streaming: e.streaming
            }
          });

          const directorToAdd = new Director({
            name: director,
            films: final,
          });

          
        }
      })
      .catch(err => console.error(err));
    })


*/