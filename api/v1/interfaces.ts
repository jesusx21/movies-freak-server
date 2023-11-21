import Database from "../../database/stores/memory";
import DummyGateway from "../../app/imdb/gateways/dummy/dummyGateway";
import Presenters from "./presenters";

export interface Titles {
  database: Database;
  imdb: DummyGateway;
  presenters: Presenters
}
