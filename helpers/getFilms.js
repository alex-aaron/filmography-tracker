const getFilms = (obj) => {
  const [ crew ] = obj.crew;
  const titles = [];
  const output = [];

  crew.forEach((e) => {
    if (e.job === 'Director' && !titles.includes(e.title)){
      titles.push(e.title);
      output.push(e)
    }
  })
}