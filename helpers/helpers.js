const { create } = require("../models/director");

const createFilmsArray = (req) => {
  const entries = Object.entries(req.body);

  const object = entries.reduce((acc, current) => {
    const title = current[0].split("-")[0];
    const field = current[0].split("-")[1];
    const value = current[1];
    if (!acc[title]){
      acc[title] = {};
      acc[title][field] = value;
    } else {
      acc[title][field] = value;
    }
    return acc;
  }, {});

  const array = Object.keys(object)
    .reduce((acc, key) => {
        acc.push(object[key]);
        return acc;
      }, [])
    .sort((a, b) => {
      return Number(a.releaseDate) - Number(b.releaseDate);
    });
  return array;
};

const createStreamingArray = (res) => {
  const services = ['Tubi TV', 'Pluto TV', 'Max', 'Mubi', 'Criterion Channel', 'Netflix', 'Paramount Plus', 'Kanopy', 'MUBI', 'Amazon Prime Video'];
  const streaming = [];
  if (res.results.US){
    if (res.results.US.ads){
      res.results.US.ads.forEach(item => services.includes(item.provider_name) ? streaming.push(item.provider_name) : streaming);
    }
    if (res.results.US.flatrate){
      res.results.US.flatrate.forEach(item => services.includes(item.provider_name) ? streaming.push(item.provider_name) : streaming);
    }
    if (res.results.US.free){
      res.results.US.free.forEach(item => services.includes(item.provider_name) ? streaming.push(item.provider_name) : streaming);
    }
  }
  return streaming;
}

module.exports = {
  createFilmsArray: createFilmsArray,
  createStreamingArray: createStreamingArray,
};