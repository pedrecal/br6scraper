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
      teams.push($(path, html)[i].children[0].data.trim());
    }
    return teams;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getMatchDates = async (url, path) => {
  try {
    const html = await rp(url);
    const dates = [];
    const aux = ($(path, html).length);
    for (let i = 0; i < aux; i++) {
      dates.push(moment($(path, html)[i].children[0].data.trim(), 'MMMM DD, YYYY').format('DD-MM-YYYY'));
    }
    return dates;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getMatches = async (url, path) => {
  try {
    const html = await rp(url);
    const matches = [];
    const aux = ($(path, html).length);
    for (let i = 0; i < aux; i++) {
      matches.push($(path, html)[i].children[0].data.trim());
    }
    return matches;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getScores = async (url, path1, path2) => {
  try {
    const html = await rp(url);
    const scores = [];
    const aux = ($(path1, html).length);
    for (let i = 0; i < aux; i++) {
      scores.push(parseInt($(path1, html)[i].children[0].data.trim(), 10));
      scores.push(parseInt($(path2, html)[i].children[0].data.trim(), 10));
    }
    return scores;
  } catch (error) {
    return Promise.reject(error);
  }
};

//! Don't look at this, its a monstrosity
const getRounds = async () => {
  const dates = await getMatchDates(url, pathToDates);
  const matches = await getMatches(url, pathToMatches);
  const scores = await getScores(url, pathToScores1, pathToScores2);

  const rounds = [];

  let i = 0;
  let j = 0;
  for (; j < matches.length; j++) {
    if (j !== 0) {
      (j % 4 ? i : i += 1);
    }

    const round = {
      match: {
        date: dates[i],
        team: matches[j],
        score: scores[j],
        team_adversary: matches[j += 1],
        score_adversary: scores[j],
      },
    };
    rounds.push(round);
  }
  return rounds;
};

export default { getRounds };
