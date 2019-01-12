const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://liquipedia.net/rainbowsix/Brasileir%C3%A3o/2019/Regular_Season'; //! Separar ano

const pathToNames = '.grouptableslot > .team-template-team-standard > .team-template-text > a';
const pathToDates = 'table > tbody > tr > td > center> span.datetime';

const getTeams = async (url, path) => {
  try {
    const html = await rp(url);
    const teams = [];
    const aux = ($(path, html).length);
    for (let i = 0; i < aux; i++) {
      teams.push($(path, html)[i].children[0].data)
    }
    return teams;
  }
  catch (error) {
    return Promise.reject(error);
  }
}

//! Fazer dicionário no formato: Round:Date
const getMatchDates = async (url, path) => {
  try {
    const html = await rp(url);
    const dates = [];
    const aux = ($(path, html).length);
    for (let i = 0; i < aux; i++) {
      dates.push($(path, html)[i].children[0].data)
    }
    return dates;
  }
  catch (error) {
    return Promise.reject(error);
  }
}

const main = async () => {
  let teams = await getTeams(url, pathToNames);
  let dates = await getMatchDates(url, pathToDates);

}

main();