export default class Film {
  constructor(args) {
    this._id = args.id;
    this.name = args.name;
    this.plot = args.plot;
  }

  get id() {
    return this._id;
  }
}