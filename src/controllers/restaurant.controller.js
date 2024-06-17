import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { uploadToS3 } from '../middlewares/image-upload-middleware.js';

class RestaurantController {
  constructor(restaurantService) {
    this.restaurantService = restaurantService;
  }
  // 목록 조회
  getAllRestaurant = async (req, res, next) => {
    try {
      let { sort } = req.query;
      const restaurant = await this.restaurantService.getAllRestaurant(sort);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESTAURANT.GET_ALL.SUCCEED,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  };
  // 상세 조회
  getRestaurantById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const restaurant = await this.restaurantService.getRestaurantById(id);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESTAURANT.GET_MORE.SUCCEED,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  };
  // 생성
  createRestaurant = async (req, res, next) => {
    try {
      const user = req.user;
      const createrestaurant = req.body;
      const restaurant = await this.restaurantService.createRestaurant(
        user,
        createrestaurant,
      );
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESTAURANT.CREATE.SUCCEED,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  };
  // 수정
  putRestaurant = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const changeRestaurant = req.body;
      const restaurant = await this.restaurantService.putRestaurant(
        id,
        user,
        changeRestaurant,
      );
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESTAURANT.UPDATE.SUCCEED,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  };
  // 삭제
  deleteRestaurant = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const restaurant = await this.restaurantService.deleteRestaurant(
        id,
        user,
      );
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESTAURANT.DELETE.SUCCEED,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default RestaurantController;
