interface EpisodeRawResponse {
  title: string;
  releasedDate: Date;
  numberOfEpisode: number;
  imdbId: string;
}

export class Episode {
  private rawResponse: EpisodeRawResponse;

  constructor(rawResponse: EpisodeRawResponse) {
    this.rawResponse = rawResponse;
  }

  get title() {
    return this.rawResponse.title;
  }

  get releasedDate() {
    return this.rawResponse.releasedDate;
  }

  get numberOfEpisode() {
    return this.rawResponse.numberOfEpisode;
  }

  get imdbId() {
    return this.rawResponse.imdbId;
  }
}

class DummyTVSeasonResult {
  private rawResponse: any;
  episodes: Episode[];

  constructor() {
    this.rawResponse = this.getRawResponse();
    this.episodes = this.loadEpisodes();
  }

  get season() {
    return this.rawResponse.season;
  }

  get totalSeasons() {
    return this.rawResponse.totalSeasons;
  }

  private loadEpisodes() {
    return this.rawResponse.episodes.map((episode: EpisodeRawResponse) => new Episode(episode));
  }

  get error() {
    return this.rawResponse.Error;
  }

  getRawResponse() {
    return {
      title: 'How I Met Your Mother',
      season: 1,
      totalSeasons: 9,
      episodes: [
        {
          title: 'Pilot',
          releasedDate: new Date(2005, 9, 19),
          numberOfEpisode: 1,
          imdbId: 'tt0606110'
        },
        {
          title: 'Purple Giraffe',
          releasedDate: new Date(2005, 9, 26),
          numberOfEpisode: 2,
          imdbId: 'tt0606111'
        },
        {
          title: 'The Sweet Taste of Liberty',
          releasedDate: new Date(2005, 10, 3),
          numberOfEpisode: 3,
          imdbId: 'tt0606117'
        },
        {
          title: 'Return of the Shirt',
          releasedDate: new Date(2005, 10, 10),
          numberOfEpisode: 4,
          imdbId: 'tt0606112'
        },
        {
          title: 'Okay Awesome',
          releasedDate: new Date(2005, 10, 17),
          numberOfEpisode: 5,
          imdbId: 'tt0606109'
        },
        {
          title: 'The Slutty Pumpkin',
          releasedDate: new Date(2005, 10, 24),
          numberOfEpisode: 6,
          imdbId: 'tt0606116'
        },
        {
          title: 'Matchmaker',
          releasedDate: new Date(2005, 11, 7),
          numberOfEpisode: 7,
          imdbId: 'tt0606108'
        },
        {
          title: 'The Duel',
          releasedDate: new Date(2005, 11, 14),
          numberOfEpisode: 8,
          imdbId: 'tt0606113'
        },
        {
          title: 'Belly Full of Turkey',
          releasedDate: new Date(2005, 11, 21),
          numberOfEpisode: 9,
          imdbId: 'tt0606104'
        },
        {
          title: 'The Pineapple Incident',
          releasedDate: new Date(2005, 11, 28),
          numberOfEpisode: 10,
          imdbId: 'tt0606115'
        },
        {
          title: 'The Limo',
          releasedDate: new Date(2005, 12, 19),
          numberOfEpisode: 11,
          imdbId: 'tt0606114'
        },
        {
          title: 'The Wedding',
          releasedDate: new Date(2006, 1, 9),
          numberOfEpisode: 12,
          imdbId: 'tt0606118'
        },
        {
          title: 'Drumroll, Please',
          releasedDate: new Date(2006, 1, 23),
          numberOfEpisode: 13,
          imdbId: 'tt0606106'
        },
        {
          title: 'Zip, Zip, Zip',
          releasedDate: new Date(2006, 2, 6),
          numberOfEpisode: 14,
          imdbId: 'tt0606119'
        },
        {
          title: 'Game Night',
          releasedDate: new Date(2006, 2, 27),
          numberOfEpisode: 15,
          imdbId: 'tt0606107'
        },
        {
          title: 'Cupcake',
          releasedDate: new Date(2006, 3, 6),
          numberOfEpisode: 16,
          imdbId: 'tt0606105'
        },
        {
          title: 'Life Among the Gorillas',
          releasedDate: new Date(2006, 3, 20),
          numberOfEpisode: 17,
          imdbId: 'tt0756504'
        },
        {
          title: 'Nothing Good Happens After 2 AM',
          releasedDate: new Date(2006, 4, 10),
          numberOfEpisode: 18,
          imdbId: 'tt0606103'
        },
        {
          title: 'Mary the Paralegal',
          releasedDate: new Date(2006, 4, 24),
          numberOfEpisode: 19,
          imdbId: 'tt0788623'
        },
        {
          title: 'Best Prom Ever',
          releasedDate: new Date(2006, 5, 1),
          numberOfEpisode: 20,
          imdbId: 'tt0760776'
        },
        {
          title: 'Milk',
          releasedDate: new Date(2006, 5, 8),
          numberOfEpisode: 21,
          imdbId: 'tt0801608'
        },
        {
          title: 'Come On',
          releasedDate: new Date(2006, 5, 15),
          numberOfEpisode: 22,
          imdbId: 'tt0774239'
        }
      ]
    };
  }
}

export default DummyTVSeasonResult;
