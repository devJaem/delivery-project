import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export const SearchTypeMiddleware = (req, res, next) => {
    try {
        const { searchType, searchWord } = req.body;
        if (!searchType || !searchWord) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(MESSAGES.SEARCH.COMMON.REQUIRED);
        }
        let whereCondition = {};
        if (searchType === 'name') {
            whereCondition = {
                name: {
                    contains: searchWord,
                },
            };
        } else if (searchType === 'address') {
            whereCondition = {
                address: {
                    contains: searchWord,
                },
            };
        } else if (searchType === 'category') {
            whereCondition = {
                category: {
                    contains: searchWord,
                },
            };
        }
        else {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(MESSAGES.SEARCH.COMMON.INVALID);
        }
        req.searchCondition = whereCondition;
        next();

    } catch (err) {
        next(err);
    }

}

