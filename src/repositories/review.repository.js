class ReviewRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 리뷰 목록 조회
  getAllReview = async (restaurantId, sort) => {
    const reviews = await this.prisma.Review.findMany({
      where: { restaurantId: +restaurantId },
      orderBy: {
        createdAt: sort,
      },
    });
    return reviews;
  };
  // 리뷰 상세 조회
  getReviewById = async (restaurantId, reviewId) => {
    const review = await this.prisma.Review.findUnique({
      where: {
        reviewId: +reviewId,
        restaurantId: +restaurantId,
      },
    });
    return review;
  };
  // 리뷰 생성
  createReview = async (restaurantId, user, createreview) => {
    const { comment, rating, reviewPicture } = createreview;
    const review = await this.prisma.Review.create({
      data: {
        comment,
        rating: +rating,
        reviewPicture,
        customer: {
          connect: {
            userId: user.userId,
          },
        },
        restaurant: {
          connect: {
            restaurantId: +restaurantId,
          },
        },
      },
    });
    return review;
  };
  // 리뷰 수정
  putReview = async (restaurantId, reviewId, user, changereview) => {
    const { comment, rating, reviewPicture } = changereview;
    const review = await this.prisma.Review.update({
      where: {
        restaurantId: +restaurantId,
        customerId: user.userId,
        reviewId: +reviewId,
      },
      data: {
        ...(comment && { comment }),
        ...+(rating && { rating }),
        ...(reviewPicture && { reviewPicture }),
      },
    });
    return review;
  };
  // 리뷰 삭제
  deleteReview = async (restaurantId, reviewId, user) => {
    const review = await this.prisma.Review.delete({
      where: {
        restaurantId: +restaurantId,
        customerId: user.userId,
        reviewId: +reviewId,
      },
    });
    return review.reviewId;
  };
  // 음식점 존재 여부 파악
  existedRestaurant = async (restaurantId) => {
    const existedrestaurant = await this.prisma.Restaurant.findFirst({
      where: { restaurantId: +restaurantId },
    });
    return existedrestaurant;
  };
}

export default ReviewRepository;
