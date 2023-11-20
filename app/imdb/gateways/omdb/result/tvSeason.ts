interface EpisodeRawResponse {
  Title: string;
  Released: string;
  Episode: number | string;
  imdbID: string;
}

export class Episode {
  private rawResponse: EpisodeRawResponse;

  constructor(rawResponse: EpisodeRawResponse) {
    this.rawResponse = rawResponse;
  }

  get title() {
    return this.rawResponse.Title;
  }

  get releasedDate() {
    return new Date(this.rawResponse.Released);
  }

  get numberOfEpisode() {
    return Number(this.rawResponse.Episode);
  }

  get imdbId() {
    return this.rawResponse.imdbID;
  }
}

class OMDBTVSeasonResult {
  readonly episodes: Episode[];
  private rawResponse: any;

  constructor(rawResponse: any) {
    this.rawResponse = rawResponse;
    this.episodes = this.loadEpisodes();
  }

  get season() {
    return Number(this.rawResponse.Season);
  }

  get totalSeasons() {
    return Number(this.rawResponse.totalSeasons);
  }

  private loadEpisodes(): Episode[] {
    return this.rawResponse.Episodes.map((episode: EpisodeRawResponse) => new Episode(episode));
  }

  get error() {
    return this.rawResponse.Error;
  }

  isRequestSuccesful() {
    return JSON.parse(this.rawResponse?.Response?.toLowerCase());
  }
}

export default OMDBTVSeasonResult;
