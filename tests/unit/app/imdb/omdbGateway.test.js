import axios from 'axios';

import TestCase from '../../../testHelper';
import IMDB_FILM_RESPONSE from '../../data/imdbFilmResponse';
import IMDB_TV_SERIE_RESPONSE from '../../data/imdbTVSerieResponse';
import IMDB_TV_SEASON_RESPONSE from '../../data/imdbTVSeasonResponse';
import IMDB_TV_EPISODE_RESPONSE from '../../data/imdbTVEpisodeResponse';

import OMDBGateway from '../../../../app/imdb/gateways/omdb/omdbGateway';
import { IMDBError } from '../../../../app/imdb/errors';
import {
  OMDBFilmResult,
  OMDBTVEpisodeResult,
  OMDBTVSeasonResult,
  OMDBTVSerieResult
} from '../../../../app/imdb/gateways/omdb/result';

class OMDBGatewayTest extends TestCase {
  setUp() {
    super.setUp();

    this.gateway = new OMDBGateway();
  }
}

export class FetchFilmByIdTest extends OMDBGatewayTest {
  async testRequestFilmByIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves(IMDB_FILM_RESPONSE);

    const result = await this.gateway.fetchFilmById('tt0111161');
    const { data } = IMDB_FILM_RESPONSE;

    this.assertThat(result).isInstanceOf(OMDBFilmResult);
    this.assertThat(result.isRequestSuccesful()).isTrue();
    this.assertThat(result._isCollection()).isFalse();
    this.assertThat(result.title).isEqual(data.Title);
    this.assertThat(result.year).isEqual(data.Year);
    this.assertThat(result.rated).isEqual(data.Rated);
    this.assertThat(result.released).isEqual(data.Released);
    this.assertThat(result.runtime).isEqual(data.Runtime);
    this.assertThat(result.genre).isEqual(data.Genre.split(','));
    this.assertThat(result.director).isEqual(data.Director);
    this.assertThat(result.writers).isEqual(['Stephen King', 'Frank Darabont']);
    this.assertThat(result.actors).isEqual(
      ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']
    );
    this.assertThat(result.plot).isEqual(data.Plot);
    this.assertThat(result.language).isEqual(data.Language);
    this.assertThat(result.country).isEqual(data.Country);
    this.assertThat(result.awards).isEqual(data.Awards);
    this.assertThat(result.poster).isEqual(data.Poster);
    this.assertThat(result.ratings[0].source).isEqual(data.Ratings[0].Source);
    this.assertThat(result.ratings[0].value).isEqual(data.Ratings[0].Value);
    this.assertThat(result.ratings[1].source).isEqual(data.Ratings[1].Source);
    this.assertThat(result.ratings[1].value).isEqual(data.Ratings[1].Value);
    this.assertThat(result.ratings[2].source).isEqual(data.Ratings[2].Source);
    this.assertThat(result.ratings[2].value).isEqual(data.Ratings[2].Value);
    this.assertThat(result.imdbId).isEqual(data.imdbID);
    this.assertThat(result.type).isEqual('film');
    this.assertThat(result.production).isEqual(data.Production);
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const error = await this.assertThat(
      this.gateway.fetchFilmById('tt0111161')
    ).willBeRejectedWith(IMDBError);

    this.assertThat(error.message).isEqual('Incorrect IMDb ID.');
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    const error = await this.assertThat(
      this.gateway.fetchFilmById('tt011161')
    ).willBeRejectedWith(IMDBError);

    this.assertThat(error.message).isEqual('Invalid API key!');
  }
}

export class FetchTVSerieByIdTest extends OMDBGatewayTest {
  async testRequestForATVSerieByIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves(IMDB_TV_SERIE_RESPONSE);

    const result = await this.gateway.fetchTVSerieById('tt0212671');
    const { data } = IMDB_TV_SERIE_RESPONSE;

    this.assertThat(result).isInstanceOf(OMDBTVSerieResult);
    this.assertThat(result.isRequestSuccesful()).isTrue();
    this.assertThat(result._isCollection()).isFalse();
    this.assertThat(result.title).isEqual(data.Title);
    this.assertThat(result.years).isEqual({ from: '2000', to: '2006' });
    this.assertThat(result.rated).isEqual(data.Rated);
    this.assertThat(result.released).isEqual(data.Released);
    this.assertThat(result.runtime).isEqual(data.Runtime);
    this.assertThat(result.genre).isEqual(['Comedy', 'Family']);
    this.assertThat(result.director).isEqual(data.Director);
    this.assertThat(result.writers).isEqual(
      ['Linwood Boomer', 'Michael Glouberman', 'Gary Murphy']
    );
    this.assertThat(result.actors).isEqual(
      ['Frankie Muniz', 'Bryan Cranston', 'Justin Berfield']
    );
    this.assertThat(result.plot).isEqual(data.Plot);
    this.assertThat(result.language).isEqual(data.Language);
    this.assertThat(result.country).isEqual(data.Country);
    this.assertThat(result.awards).isEqual(data.Awards);
    this.assertThat(result.poster).isEqual(data.Poster);
    this.assertThat(result.ratings[0].source).isEqual(data.Ratings[0].Source);
    this.assertThat(result.ratings[0].value).isEqual(data.Ratings[0].Value);
    this.assertThat(result.imdbId).isEqual(data.imdbID);
    this.assertThat(result.type).isEqual('serie');
    this.assertThat(result.production).isEqual(data.Production);
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const error = await this.assertThat(
      this.gateway.fetchTVSerieById('tt0111161')
    ).willBeRejectedWith(IMDBError);

    this.assertThat(error.message).isEqual('Incorrect IMDb ID.');
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    const error = await this.assertThat(
      this.gateway.fetchTVSerieById('tt011161')
    ).willBeRejectedWith(IMDBError);

    this.assertThat(error.message).isEqual('Invalid API key!');
  }
}

export class FetchTVSeasonBySerieIdTest extends OMDBGatewayTest {
  async testRequestForATVSeasonByIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves(IMDB_TV_SEASON_RESPONSE);

    const result = await this.gateway.fetchTVSeasonBySerieId('tt0212671', 1);
    const { data } = IMDB_TV_SEASON_RESPONSE;

    this.assertThat(result).isInstanceOf(OMDBTVSeasonResult);
    this.assertThat(result.isRequestSuccesful()).isTrue();
    this.assertThat(result.season).isEqual(Number(data.Season));
    this.assertThat(result.totalSeasons).isEqual(Number(data.totalSeasons));
    this.assertThat(result.episodes).hasLengthOf(data.Episodes.length);

    result.episodes.forEach((episode, index) => {
      const rawEpisode = data.Episodes[index];

      this.assertThat(episode.title).isEqual(rawEpisode.Title);
      this.assertThat(episode.releasedDate).isEqual(new Date(rawEpisode.Released));
      this.assertThat(episode.numberOfEpisode).isEqual(Number(rawEpisode.Episode));
      this.assertThat(episode.imdbId).isEqual(rawEpisode.imdbID);
    });
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const error = await this.assertThat(
      this.gateway.fetchTVSeasonBySerieId('tt0212671', 1)
    ).willBeRejectedWith(IMDBError);

    this.assertThat(error.message).isEqual('Incorrect IMDb ID.');
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    const error = await this.assertThat(
      this.gateway.fetchTVSeasonBySerieId('tt0212671', 1)
    ).willBeRejectedWith(IMDBError);

    this.assertThat(error.message).isEqual('Invalid API key!');
  }
}

export class FetchTVEpisodeByIdTest extends OMDBGatewayTest {
  async testRequestTVEpisodeByIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves(IMDB_TV_EPISODE_RESPONSE);

    const result = await this.gateway.fetchTVEpisodeById('tt3390684');
    const { data } = IMDB_TV_EPISODE_RESPONSE;

    this.assertThat(result).isInstanceOf(OMDBTVEpisodeResult);
    this.assertThat(result.isRequestSuccesful()).isTrue();
    this.assertThat(result._isCollection()).isFalse();
    this.assertThat(result.title).isEqual(data.Title);
    this.assertThat(result.year).isEqual(data.Year);
    this.assertThat(result.numberOfSeason).isEqual(Number(data.Season));
    this.assertThat(result.numberOfEpisode).isEqual(Number(data.Episode));
    this.assertThat(result.rated).isEqual(data.Rated);
    this.assertThat(result.released).isEqual(data.Released);
    this.assertThat(result.runtime).isEqual(data.Runtime);
    this.assertThat(result.director).isEqual(data.Director);
    this.assertThat(result.genre).isEqual(['Comedy', 'Drama', 'Romance']);
    this.assertThat(result.writers).isEqual(['Carter Bays', 'Craig Thomas']);
    this.assertThat(result.actors).isEqual(
      ['Josh Radnor', 'Jason Segel', 'Cobie Smulders']
    );
    this.assertThat(result.language).isEqual(['English', 'French']);
    this.assertThat(result.plot).isEqual(data.Plot);
    this.assertThat(result.country).isEqual(data.Country);
    this.assertThat(result.awards).isEqual(data.Awards);
    this.assertThat(result.poster).isEqual(data.Poster);
    this.assertThat(result.ratings[0].source).isEqual(data.Ratings[0].Source);
    this.assertThat(result.ratings[0].value).isEqual(data.Ratings[0].Value);
    this.assertThat(result.imdbId).isEqual(data.imdbID);
    this.assertThat(result.serieIMDBId).isEqual(data.seriesID);
    this.assertThat(result.type).isEqual('episode');
    this.assertThat(result.production).isEqual(data.Production);
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const error = await this.assertThat(
      this.gateway.fetchTVEpisodeById('tt0111161')
    ).willBeRejectedWith(IMDBError);

    this.assertThat(error.message).isEqual('Incorrect IMDb ID.');
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    const error = await this.assertThat(
      this.gateway.fetchTVEpisodeById('tt011161')
    ).willBeRejectedWith(IMDBError);

    this.assertThat(error.message).isEqual('Invalid API key!');
  }
}
