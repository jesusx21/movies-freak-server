/* eslint-disable no-unused-vars */
import { TitleNotFound, TokenNotUsed } from './errors';

export interface SingleRespponse {
  status: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 412 | 500;
  data: any;
}

export interface MultipleRespponse {
  status: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 412 | 500;
  data: {
    skip: number;
    limit: number;
    totalItems: number;
    items: any[]
  };
}


class Monopoly<TitleInterface> {
  private titles: any;

  constructor() {
    this.titles = {};
  }

  async onPost(_request: object): Promise<SingleRespponse | MultipleRespponse> {
    throw new TokenNotUsed();
  }

  async onGet(_request: object): Promise<SingleRespponse | MultipleRespponse> {
    throw new TokenNotUsed();
  }

  async onPut(_request: object): Promise<SingleRespponse> {
    throw new TokenNotUsed();
  }

  async onDelete(_request: object): Promise<SingleRespponse> {
    throw new TokenNotUsed();
  }

  /**
   * See title as a dependency, so what setTitle does is to set a dependency to boardgame
   */
  setTitle(titleName: string, titleValue: object) {
    this.titles[titleName] = titleValue;
  }

  /**
   * See title as a dependency, so what getTitle does is to get a dependency
   * from the boardgame by its name
   */
  getTitle(titleName: string) {
    const title = this.titles[titleName];

    if (!title) {
      throw new TitleNotFound(titleName);
    }

    return title;
  }

  /**
   * See title as a dependency, so what getTitle does is to get all of the dependencies
   * from the boardgame
   */
  getTitles(): TitleInterface {
    return this.titles;
  }
}

export default Monopoly;
