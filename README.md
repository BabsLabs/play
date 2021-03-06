# Play

## Description

Play is an API that allows a user to query the MusixMatch API and then store results in a database.

![Play API Screenshot](https://user-images.githubusercontent.com/38663414/77660774-a8129880-6f71-11ea-982d-46fa350c3544.png)

## Initial Setup

- Clone down repo using `git clone git@github.com:johnktravers/play.git`
- Change into project directory
- Run `npm install`
- Create development database
```
psql
CREATE DATABASE PUT_DATABASE_NAME_HERE_dev
\q
```
- Create test database
```
psql
CREATE DATABASE PUT_DATABASE_NAME_HERE_test
\q
```
- Run migrations for development database using `knex migrate:latest`
- Run migrations for test database using `knex migrate:latest --env test`

### Environment Variables

The following environment variables are required.
- **DATABASE_URL** set to the location of your production database
- **MUSIXMATCH_API_KEY** set to your registered MusixMatch Developer API Key

## Testing

### Running Tests

#### Run all tests

One you have run a `npm install` you can run all test using the `npm test` command.

#### Run individual tests

Individual tests can be run using the `jest -t '<describeString> <itString>` command formula.

## How to Use / Endpoints

### Favorites Endpoint

#### 1) Getting a list of all favorite tracks

When a user sends a `GET` request to `/api/v1/favorites` it returns all favorited songs currently in the database.

Response body will look like:
```
[
  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  },
  {
    "id": 2,
    "title": "Careless Whisper",
    "artistName": "George Michael"
    "genre": "Pop",
    "rating": 93
  },
]
```

#### 2) Getting a favorite track by id

A user can send a `GET` request to `/api/v1/favorites/:id` and is returned the information for a single favorite.

The response body will look like:
```
  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  }
```

#### 3) Adding a favorite track

A user can send a `POST` request to `/api/v1/favorites` that allows them to add a favorite song to the database.

The user request payload will be:
```
{ title: "We Will Rock You", artistName: "Queen" }
```

The response body will be:
```
{
  "id": 1,
  "title": "We Will Rock You",
  "artistName": "Queen"
  "genre": "Rock",
  "rating": 88
}
```

#### 4) Deleting a favorite track

A user can send a `DELETE` request to `/api/v1/favorites/:id` which deletes that favorite song from the database.

The response will be a status `204` with no response body.

### Playlists Endpoint

#### 1) Getting a list of all playlists

When a user sends a `GET` request to `/api/v1/playlists` it returns all playlists currently in the database. It also returns each playlist's song count, average song rating, and a list of favorite tracks that the playlist contains.

The response body will look like:
```
[
  {
    "id": 1,
    "title": "Cleaning House",
    "songCount": 2,
    "songAvgRating": 27.5,
    "favorites": [
                    {
                      "id": 1,
                      "title": "We Will Rock You",
                      "artistName": "Queen"
                      "genre": "Rock",
                      "rating": 25
                    },
                    {
                      "id": 4,
                      "title": "Back In Black",
                      "artistName": "AC/DC"
                      "genre": "Rock",
                      "rating": 30
                    }
                  ],
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
  },
  {
    "id": 2,
    "title": "Running Mix",
    "songCount": 0,
    "songAvgRating": 0,
    "favorites": []
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
  }
]
```

#### 2) Updating a playlist by ID

A user can send a `PUT` request to `/api/v1/playlists/:id` to update the title of a playlist in the database by the playlist ID.

The user's request body will contain the new title in the following format:
```
{ title: "Cheesy 80s Love Songs" }
```

The response body will be of the following format (displaying the updated title):
```
{
  "id": 1,
  "title": "Cheesy 80s Love Songs",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00,
}
```

#### 3) Adding a playlist

A user can send a `POST` request to `/api/v1/playlists` that allows them to add a playlist to the database.

The user request payload will be:
```
{ title: "Blue-cheese-moon of Kentucky and Other Songs About Cheese" }
```

The response body will be:
```
{
  "id": 1,
  "title": "Blue-cheese-moon of Kentucky and Other Songs About Cheese",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00,
}
```

#### 4) Deleting a playlist

A user can send a `DELETE` request to `/api/v1/playlists/:id` which deletes that playlist from the database.

The response will be a status `204` with no response body.

### Playlist Favorites Endpoint

#### 1) Adding a favorite to a playlist

A user can send a `POST` request to `/api/v1/playlists/:playlistID/favorites/:favoriteID` which adds the given favorite to the given playlist.

The response body will be:

```
{
  "Success": "{Song Title} has been added to {Playlist Title}!"
}
```

#### 2) Getting a playlists favorites

When a user sends a `GET` request to `/api/v1/playlists/:playlistID/favorites` it returns the playlist with that :id. It also returns the playlist's song count, average song rating, and a list of favorite tracks that the playlist contains.

The response body will look like:
```
{
  "id": 1,
  "title": "Cleaning House",
  "songCount": 2,
  "songAvgRating": 27.5,
  "favorites": [
                  {
                    "id": 1,
                    "title": "We Will Rock You",
                    "artistName": "Queen"
                    "genre": "Rock",
                    "rating": 25
                  },
                  {
                    "id": 4,
                    "title": "Back In Black",
                    "artistName": "AC/DC"
                    "genre": "Rock",
                    "rating": 30
                  }
                ],
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00
}
```

#### 3) Deleting a favorite from a playlist

A user can send a `DELETE` request to `/api/v1/playlists/:playlistID/favorites/:favoriteID` which deletes that favorite song from the playlist (and the joins table of the database).

The response will be a status `204` with no response body.

## Focus Areas

- Creating an API
- Consuming an API

## Technologies and Frameworks Used
- JavaScript
- Express
- Knex
- Jest
- node-fetch
- dotenv
- pg

## APIs Used
- MusixMatch API

## Database

![schema diagram](https://user-images.githubusercontent.com/38663414/74381281-0b41d480-4de3-11ea-80fd-711ae471cf83.png)

## Core Contributors
- Brian Bower
- John Travers
