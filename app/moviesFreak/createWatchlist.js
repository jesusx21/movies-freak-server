var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CouldNotCreateWatchlist } from './errors';
import { Watchlist } from './entities';
class CreateWatchlist {
    constructor(database, name, type, description) {
        this.database = database;
        this.name = name;
        this.type = type;
        this.description = description || '';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const watchlist = new Watchlist({
                name: this.name,
                type: this.type,
                description: this.description
            });
            try {
                return yield this.database.watchlists.create(watchlist);
            }
            catch (error) {
                throw new CouldNotCreateWatchlist(error);
            }
        });
    }
}
export default CreateWatchlist;
//# sourceMappingURL=createWatchlist.js.map