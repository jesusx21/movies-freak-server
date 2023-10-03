import { Watchlist } from './entities';
import { CouldNotCreateWatchlist, InvalidType } from './errors';

const VALID_TYPES = ['marathon', 'saga'];

export default class CreateWatchlist {
  constructor(database, name, type, description = '') {
    this._database = database;
    this._name = name;
    this._type = type;
    this._description = description;
  }

  async execute() {
    if (!VALID_TYPES.includes(this._type)) {
      throw new InvalidType(this._type);
    }

    const watchlist = new Watchlist({
      name: this._name,
      type: this._type,
      description: this._description
    });

    try {
      return await this._database.watchlists.create(watchlist);
    } catch (error) {
      throw new CouldNotCreateWatchlist(error);
    }
  }
}
