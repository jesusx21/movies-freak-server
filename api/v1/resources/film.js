var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HTTPStatusCode } from '../../../boardGame/types';
import { Monopoly } from '../../../boardGame';
import { HTTPInternalError, HTTPNotFound } from '../../httpResponses';
import { FilmNotFound } from '../../../database/stores/errors';
class FilmResource extends Monopoly {
    onGet(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { database, presenters } = this.getTitles();
            const { filmId } = req.params;
            let film;
            try {
                film = yield database.films.findById(filmId);
            }
            catch (error) {
                if (error instanceof FilmNotFound) {
                    throw new HTTPNotFound('FILM_NOT_FOUND');
                }
                throw new HTTPInternalError(error);
            }
            return {
                status: HTTPStatusCode.OK,
                data: presenters.presentFilm(film)
            };
        });
    }
}
export default FilmResource;
//# sourceMappingURL=film.js.map