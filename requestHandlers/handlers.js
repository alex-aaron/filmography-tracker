const getDirector = (director, resp) => {
  const query = director.split(" ").join("%20");
  const results = [];

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
        return { name: e.name, id: e.id, knownFor: knownFor };
      });
      resp.render('confirmDirector', {
        results: mapped,
      });
    })
    .catch(err => console.error(err));
};

const getFilms = async (req, resp) => {
  const { director, id } = req.body;
  const initialTitles = [];
  const initialResults = [];
  const finalResults = [];

  const url = `https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
    }
  };

  await fetch(url, options)
    .then(res => res.json())
    .then(result => {
      result.crew.forEach((e) => {
        if (e.job === 'Director' && !initialTitles.includes(e.title)){
          initialTitles.push(e.title);
          initialResults.push({
            title: e.title,
            id: e.id,
            releaseDate: e.release_date,
          })
        }
      })
      
      initialResults.forEach((credit, index) => {
        const url = `https://api.themoviedb.org/3/movie/${credit.id}?language=en-US`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
          }
        };

        fetch(url, options)
          .then(res => res.json())
          .then(result => {
            if (result.runtime >= 70){
              finalResults.push({
                id: result.id,
                title: result.title,
                releaseDate: Number(result.release_date.split("-")[0]),
                runtime: result.runtime,
              })
            }
            if (index === initialResults.length - 1){
              finalResults.sort((a, b) => {
                return a.releaseDate - b.releaseDate;
              })
              console.log(finalResults);
              resp.render('confirmFilms', {
                director: director,
                films: finalResults
              });
            }
          })
          .catch(err => console.error(err));
        });
    })
    .catch(err => console.error(err));
};




module.exports = {
  getDirector: getDirector,
  getFilms: getFilms
}

/**
 // initialResults.forEach((e) => {
      //   const url = `https://api.themoviedb.org/3/movie/${e.id}?language=en-US`;
      //   const options = {
      //     method: 'GET',
      //     headers: {
      //       accept: 'application/json',
      //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
      //     }
      //   };

      //   fetch(url, options)
      //     .then(res => res.json())
      //     .then(result => {
      //       if (result.runtime >= 78){
      //         features.push({
      //           id: e.id,
      //           title: e.title,
      //           releaseDate: e.releaseDate
      //         });
      //       }
      //     })

      //     .catch(err => console.error(err));
      //   });
 */