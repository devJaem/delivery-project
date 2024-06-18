

class SearchService {
    constructor(searchRepository) {
        this.searchRepository = searchRepository;
    }
    getSearch = async (searchCondition) => {
        const searchRestaurants = await this.searchRepository.getSearch(searchCondition);
        return searchRestaurants.map((restaurant) => {
            return {
                restaurantId: restaurant.restaurantId,
                name: restaurant.name,
                address: restaurant.address,
                category: restaurant.category
            }
        })
    }
}

export default SearchService;