import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class RankController {
  constructor(rankService) {
    this.rankService = rankService;
  }

  getRank = async (req, res, next) => {
    try {
      const ranking = await this.rankService.getRank();
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RANK.COMMON.SUCCEED,
        data: ranking,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default RankController;
