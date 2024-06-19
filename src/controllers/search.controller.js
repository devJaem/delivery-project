import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    // 검색
    getSearch = async (req, res, next) => {
        try {
            const searchCondition = req.searchCondition;
            const search = await this.searchService.getSearch(searchCondition);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.SEARCH.COMMON.SUCCEED,
                data: search,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default SearchController;