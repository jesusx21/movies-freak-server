var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Monopoly } from '../../../boardGame';
import { HTTPStatusCode } from '../../../boardGame/types';
import CreateFilm from '../../../app/moviesFreak/createFilm';
import { HTTPInternalError } from '../../httpResponses';
class FilmsResource extends Monopoly {
    onPost(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { database, imdb, presenters } = this.getTitles();
            const useCase = new CreateFilm(database, imdb, request.body.imdbId);
            let result;
            try {
                result = yield useCase.execute();
            }
            catch (error) {
                throw new HTTPInternalError(error);
            }
            return {
                status: HTTPStatusCode.CREATED,
                data: presenters.presentFilm(result)
            };
        });
    }
    onGet({ query }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { database, presenters } = this.getTitles();
            const skip = Number(query.skip || 0);
            const limit = Number(query.limit || 25);
            let result;
            try {
                result = yield database.films.find({ skip, limit });
            }
            catch (error) {
                throw new HTTPInternalError(error);
            }
            return {
                status: HTTPStatusCode.OK,
                data: {
                    skip,
                    limit,
                    totalItems: result.totalItems,
                    items: presenters.presentFilms(result.items)
                }
            };
        });
    }
}
export default FilmsResource;
//# sourceMappingURL=films.js.map