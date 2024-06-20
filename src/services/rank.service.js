import { MESSAGES } from '../constants/message.constant.js';
import { ConflictError, NotFoundError } from '../errors/http.error.js';

class RankService {
  constructor(rankRepository) {
    this.rankRepository = rankRepository;
  }
  getRank = async () => {
    //만약 전부 0원이라면 랭킹정보가 없다고 나오게 하길
    const revenueAllzero = await this.rankRepository.getHighrevenue();
    if (revenueAllzero == 0) return MESSAGES.RANK.COMMON.NOT_FOUND;
    const rank = await this.rankRepository.getRank();
    return rank.map((restaurant, index) => {
      return {
        rank: index + 1,
        restaurantId: restaurant.restaurantId,
        name: restaurant.name,
        address: restaurant.address,
        category: restaurant.category,
        description: restaurant.description,
        revenue: restaurant.revenue,
      };
    });
  };
}

export default RankService;
