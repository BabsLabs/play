const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();

const Track = require('../../../pojos/track');
const musixmatchService = require('../../../services/musixmatch-service');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

router.post('/', async (request, response) => {
  let trackTitle = request.body.title;
  let artistName = request.body.artistName;

  if (trackTitle && artistName) {

    try {
      let trackData = await musixmatchService.getTrackData(trackTitle, artistName, response);
      let track = new Track(trackData);
      await alreadyFavorite(track, response);
      await addFavoriteToDB(track, response);
    } catch(error) {
      console.log(error);
      response.status(200).json({error: 'There was an error.'});
    }

  } else if (request.body.title && !request.body.artistName) {
    response.status(400).json({error: 'Bad Request! Did you send an artist name?'});
  } else if (!request.body.title && request.body.artistName) {
    response.status(400).json({error: 'Bad Request! Did you send a song title?'});
  } else {
    response.status(400).json({error: 'Bad Request! Did you send an artist name and song title?'});
  }

});

router.get('/', async (request, response) => {
  database('favorites')
      .then((favorites) => {
        if (favorites.length) {
          response.status(200).json(favorites);
        } else {
          response.status(200).json({ message: 'No favorites found!' });
        }
      }).catch(error => response.status(404).json({error: "There was an error!"}));
});


function alreadyFavorite(track, response) {
  return database('favorites')
    .where({title: track.title, artistName: track.artistName})
    .then(result => {
      if (result.length) {
        response.status(409).json({error: 'That track has already been added to your favorites!'})
      }
    })
};

function addFavoriteToDB(track, response) {
  return database('favorites')
    .insert(
      {
        title: track.title,
        artistName: track.artistName,
        genre: track.genre,
        rating: track.rating
      }, ['id', 'title', 'artistName', 'genre', 'rating']
    )
    .then(track => response.status(201).json(track[0]));
};

module.exports = router;
