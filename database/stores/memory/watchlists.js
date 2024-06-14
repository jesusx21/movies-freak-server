import Store from './store';
class InMemoryWatchlistStore {
    constructor() {
        this.store = new Store();
    }
    create(watchlist) {
        return this.store.create(watchlist);
    }
}
export default InMemoryWatchlistStore;
//# sourceMappingURL=watchlists.js.map