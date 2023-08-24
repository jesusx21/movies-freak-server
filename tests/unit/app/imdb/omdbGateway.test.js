import axios from 'axios';
import { expect } from 'chai';

import TestCase from '../../../testHelper';
import IMDB_FILM_RESPONSE from '../../data/imdbFilmResponse';
import IMDB_TV_SERIE_RESPONSE from '../../data/imdbTVSerieResponse';
import IMDB_TV_SEASON_RESPONSE from '../../data/imdbTVSeasonResponse';
import IMDB_TV_EPISODE_RESPONSE from '../../data/imdbTVEpisodeResponse';

import OMDBGateway from '../../../../app/imdb/gateways/omdb/omdbGateway';
import OMDBTVSeasonResult from '../../../../app/imdb/gateways/omdb/result/tvSesonResult';
import OMDBFilmResult from '../../../../app/imdb/gateways/omdb/result/filmResult';
import OMDBTVSerieResult from '../../../../app/imdb/gateways/omdb/result/tvSerieResult';
import OMDBTVEpisodeResult from '../../../../app/imdb/gateways/omdb/result/tvEpisodeResult';
import { IMDBError } from '../../../../app/imdb/errors';

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

    expect(result).to.be.instanceOf(OMDBFilmResult);
    expect(result.isRequestSuccesful()).to.be.true;
    expect(result._isCollection()).to.be.false;
    expect(result.title).to.be.equal(data.Title);
    expect(result.year).to.be.equal(data.Year);
    expect(result.rated).to.be.equal(data.Rated);
    expect(result.released).to.be.equal(data.Released);
    expect(result.runtime).to.be.equal(data.Runtime);
    expect(result.genre).to.be.deep.equal(data.Genre.split(','));
    expect(result.director).to.be.equal(data.Director);
    expect(result.writers).to.be.deep.equal(['Stephen King', 'Frank Darabont']);
    expect(result.actors).to.be.deep.equal(
      ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']
    );
    expect(result.plot).to.be.equal(data.Plot);
    expect(result.language).to.be.equal(data.Language);
    expect(result.country).to.be.equal(data.Country);
    expect(result.awards).to.be.equal(data.Awards);
    expect(result.poster).to.be.equal(data.Poster);
    expect(result.ratings[0].source).to.be.equal(data.Ratings[0].Source);
    expect(result.ratings[0].value).to.be.equal(data.Ratings[0].Value);
    expect(result.ratings[1].source).to.be.equal(data.Ratings[1].Source);
    expect(result.ratings[1].value).to.be.equal(data.Ratings[1].Value);
    expect(result.ratings[2].source).to.be.equal(data.Ratings[2].Source);
    expect(result.ratings[2].value).to.be.equal(data.Ratings[2].Value);
    expect(result.imdbId).to.be.equal(data.imdbID);
    expect(result.type).to.be.equal('film');
    expect(result.production).to.be.equal(data.Production);
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const error = await expect(
      this.gateway.fetchFilmById('tt0111161')
    ).to.be.rejectedWith(IMDBError);

    expect(error.message).to.be.equal('Incorrect IMDb ID.');
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    const error = await expect(
      this.gateway.fetchFilmById('tt011161')
    ).to.be.rejectedWith(IMDBError);

    expect(error.message).to.be.equal('Invalid API key!');
  }
}

export class FetchTVSerieByIdTest extends OMDBGatewayTest {
  async testRequestForATVSerieByIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves(IMDB_TV_SERIE_RESPONSE);

    const result = await this.gateway.fetchTVSerieById('tt0212671');
    const { data } = IMDB_TV_SERIE_RESPONSE;

    expect(result).to.be.instanceOf(OMDBTVSerieResult);
    expect(result.isRequestSuccesful()).to.be.true;
    expect(result._isCollection()).to.be.false;
    expect(result.title).to.be.equal(data.Title);
    expect(result.years).to.be.deep.equal({ from: '2000', to: '2006' });
    expect(result.rated).to.be.equal(data.Rated);
    expect(result.released).to.be.equal(data.Released);
    expect(result.runtime).to.be.equal(data.Runtime);
    expect(result.genre).to.be.deep.equal(['Comedy', 'Family']);
    expect(result.director).to.be.equal(data.Director);
    expect(result.writers).to.be.deep.equal(
      ['Linwood Boomer', 'Michael Glouberman', 'Gary Murphy']
    );
    expect(result.actors).to.be.deep.equal(
      ['Frankie Muniz', 'Bryan Cranston', 'Justin Berfield']
    );
    expect(result.plot).to.be.equal(data.Plot);
    expect(result.language).to.be.equal(data.Language);
    expect(result.country).to.be.equal(data.Country);
    expect(result.awards).to.be.equal(data.Awards);
    expect(result.poster).to.be.equal(data.Poster);
    expect(result.ratings[0].source).to.be.equal(data.Ratings[0].Source);
    expect(result.ratings[0].value).to.be.equal(data.Ratings[0].Value);
    expect(result.imdbId).to.be.equal(data.imdbID);
    expect(result.type).to.be.equal('serie');
    expect(result.production).to.be.equal(data.Production);
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const error = await expect(
      this.gateway.fetchTVSerieById('tt0111161')
    ).to.be.rejectedWith(IMDBError);

    expect(error.message).to.be.equal('Incorrect IMDb ID.');
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    const error = await expect(
      this.gateway.fetchTVSerieById('tt011161')
    ).to.be.rejectedWith(IMDBError);

    expect(error.message).to.be.equal('Invalid API key!');
  }
}

export class FetchTVSeasonBySerieIdTest extends OMDBGatewayTest {
  async testRequestForATVSeasonByIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves(IMDB_TV_SEASON_RESPONSE);

    const result = await this.gateway.fetchTVSeasonBySerieId('tt0212671', 1);
    const { data } = IMDB_TV_SEASON_RESPONSE;

    expect(result).to.be.instanceOf(OMDBTVSeasonResult);
    expect(result.isRequestSuccesful()).to.be.true;
    expect(result.season).to.be.equal(Number(data.Season));
    expect(result.totalSeasons).to.be.equal(Number(data.totalSeasons));
    expect(result.episodes).to.have.lengthOf(data.Episodes.length);

    result.episodes.forEach((episode, index) => {
      const rawEpisode = data.Episodes[index];

      expect(episode.title).to.be.equal(rawEpisode.Title);
      expect(episode.releasedDate).to.be.deep.equal(new Date(rawEpisode.Released));
      expect(episode.numberOfEpisode).to.be.equal(Number(rawEpisode.Episode));
      expect(episode.imdbId).to.be.equal(rawEpisode.imdbID);
    });
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const error = await expect(
      this.gateway.fetchTVSeasonBySerieId('tt0212671', 1)
    ).to.be.rejectedWith(IMDBError);

    expect(error.message).to.be.equal('Incorrect IMDb ID.');
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    const error = await expect(
      this.gateway.fetchTVSeasonBySerieId('tt0212671', 1)
    ).to.be.rejectedWith(IMDBError);

    expect(error.message).to.be.equal('Invalid API key!');
  }
}

export class FetchTVEpisodeByIdTest extends OMDBGatewayTest {
  async testRequestTVEpisodeByIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves(IMDB_TV_EPISODE_RESPONSE);

    const result = await this.gateway.fetchTVEpisodeById('tt3390684');
    const { data } = IMDB_TV_EPISODE_RESPONSE;

    expect(result).to.be.instanceOf(OMDBTVEpisodeResult);
    expect(result.isRequestSuccesful()).to.be.true;
    expect(result._isCollection()).to.be.false;
    expect(result.title).to.be.equal(data.Title);
    expect(result.year).to.be.equal(data.Year);
    expect(result.numberOfSeason).to.be.equal(Number(data.Season));
    expect(result.numberOfEpisode).to.be.equal(Number(data.Episode));
    expect(result.rated).to.be.equal(data.Rated);
    expect(result.released).to.be.equal(data.Released);
    expect(result.runtime).to.be.equal(data.Runtime);
    expect(result.director).to.be.equal(data.Director);
    expect(result.genre).to.be.deep.equal(['Comedy', 'Drama', 'Romance']);
    expect(result.writers).to.be.deep.equal(['Carter Bays', 'Craig Thomas']);
    expect(result.actors).to.be.deep.equal(
      ['Josh Radnor', 'Jason Segel', 'Cobie Smulders']
    );
    expect(result.language).to.be.deep.equal(['English', 'French']);
    expect(result.plot).to.be.equal(data.Plot);
    expect(result.country).to.be.equal(data.Country);
    expect(result.awards).to.be.equal(data.Awards);
    expect(result.poster).to.be.equal(data.Poster);
    expect(result.ratings[0].source).to.be.equal(data.Ratings[0].Source);
    expect(result.ratings[0].value).to.be.equal(data.Ratings[0].Value);
    expect(result.imdbId).to.be.equal(data.imdbID);
    expect(result.serieIMDBId).to.be.equal(data.seriesID);
    expect(result.type).to.be.equal('episode');
    expect(result.production).to.be.equal(data.Production);
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const error = await expect(
      this.gateway.fetchTVEpisodeById('tt0111161')
    ).to.be.rejectedWith(IMDBError);

    expect(error.message).to.be.equal('Incorrect IMDb ID.');
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    const error = await expect(
      this.gateway.fetchTVEpisodeById('tt011161')
    ).to.be.rejectedWith(IMDBError);

    expect(error.message).to.be.equal('Invalid API key!');
  }
}
