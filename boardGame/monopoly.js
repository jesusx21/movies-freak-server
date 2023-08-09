/* eslint-disable no-unused-vars */
import { TitleNotFound, TokenNotUsed } from './errors';

export default class Monopoly {
  constructor() {
    this._titles = {};
  }

  async onPost(_request) {
    throw new TokenNotUsed();
  }

  async onGet(_request) {
    throw new TokenNotUsed();
  }

  async onPut(_request) {
    throw new TokenNotUsed();
  }

  async onDelete(_request) {
    throw new TokenNotUsed();
  }

  /**
   * See title as a dependency, so what setTitle does is to set a dependency to boardgame
   */
  setTitle(titleName, titleValue) {
    this._titles[titleName] = titleValue;
  }

  /**
   * See title as a dependency, so what getTitle does is to get a dependency
   * from the boardgame by its name
   */
  getTitle(titleName) {
    const title = this._titles[titleName];

    if (!title) {
      throw new TitleNotFound(titleName);
    }

    return title;
  }

  /**
   * See title as a dependency, so what getTitle does is to get all of the dependencies
   * from the boardgame
   */
  getTitles() {
    return this._titles;
  }
}
