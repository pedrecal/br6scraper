const rp = require('request-promise');
const $ = require('cheerio');
const moment = require('moment');
const url = 'https://liquipedia.net/rainbowsix/Brasileir%C3%A3o/2019/Regular_Season'; //! Separar ano

const pathToNames = '.grouptableslot > .team-template-team-standard > .team-template-text > a';
const pathToDates = 'table > tbody > tr > td > center> span.datetime';
const pathToMatches = 'tr.match-row > td.matchlistslot > span > .team-template-text > a';
const pathToScores1 = '.match-row > td:nth-child(2)';
const pathToScores2 = '.match-row > td:nth-child(3)';

const getTeams = async (url, path) => {
  try {
    const html = await rp(url);
    const teams = [];
    const aux = ($(path, html).not('.bracket-popup').length);
    for (let i = 0; i < aux; i++) {
      teams.push($(path, html)[i].children[0].data.trim())
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
      dates.push(moment($(path, html)[i].children[0].data.trim(), 'MMMM DD, YYYY').format('DD-MM-YYYY'));
    }
    return dates;
  }
  catch (error) {
    return Promise.reject(error);
  }
}

const getMatches = async (url, path) => {
  try {
    const html = await rp(url);
    const matches = [];
    const aux = ($(path, html).length);
    for (let i = 0; i < aux; i++) {
      matches.push($(path, html)[i].children[0].data.trim())
    }
    return matches;
  }
  catch (error) {
    return Promise.reject(error);
  }
}

const getScores = async (url, path1, path2) => {
  try {
    const html = await rp(url);
    const scores = [];
    const aux = ($(path1, html).length);
    for (let i = 0; i < aux; i++) {
      scores.push(parseInt($(path1, html)[i].children[0].data.trim()));
      scores.push(parseInt($(path2, html)[i].children[0].data.trim()));
    }
    return scores;
  }
  catch (error) {
    return Promise.reject(error);
  }
}

const getRounds = async () => {
  let dates = await getMatchDates(url, pathToDates);
  let matches = await getMatches(url, pathToMatches);
  let scores = await getScores(url, pathToScores1, pathToScores2);

  // for (let i = 0; i < 1/*(dates.length / 2)*/; i++) {
    var myJSON = {
      "match": {
        "date": dates[0],
        "team": matches[0],
        "score": scores[0],
        "team1": matches[1],
        "score1": scores[1],
      }
    }
  // }
  console.log(myJSON);
  // var myString = JSON.stringify(myJSON);
  // console.log(myString);

}

const main = async () => {
  // let teams = await getTeams(url, pathToNames);
  // let dates = await getMatchDates(url, pathToDates);
  // console.log(dates);
  // let matches = await getMatches(url, pathToMatches);
  // console.log(matches);
  // let scores = await getScores(url, pathToScores1, pathToScores2);
  getRounds();
  // parseDate();
}

main();