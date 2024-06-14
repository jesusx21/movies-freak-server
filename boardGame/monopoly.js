var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TitleNotFound, TokenNotUsed } from './errors';
class Monopoly {
    constructor() {
        this.titles = {};
    }
    onPost(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new TokenNotUsed();
        });
    }
    onGet(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new TokenNotUsed();
        });
    }
    onPut(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new TokenNotUsed();
        });
    }
    onDelete(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new TokenNotUsed();
        });
    }
    /**
     * See title as a dependency, so what setTitle does is to set a dependency to boardgame
     */
    setTitle(titleName, titleValue) {
        this.titles[titleName] = titleValue;
    }
    /**
     * See title as a dependency, so what getTitle does is to get a dependency
     * from the boardgame by its name
     */
    getTitle(titleName) {
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
    getTitles() {
        return this.titles;
    }
}
export default Monopoly;
//# sourceMappingURL=monopoly.js.map