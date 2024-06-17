class ReviewRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 리뷰 목록 조회
    getAllReview = async (sort) => {
        const reviews = await this.prisma.Review.findMany({
            orderBy: {
                createdAt: sort,
            }
        })
        return reviews
    }
    // 리뷰 상세 조회
    getReviewById = async (reviewId) => {
        const review = await this.prisma.Review.findUnique({
            where: { reviewId: +reviewId }
        })
        return review
    }
    // 리뷰 생성
    createReview = async (user, createreview) => {
        const { comment, rating, reviewPicture } = createreview;
        const review = await this.prisma.Review.create({
            data: {
                comment,
                rating,
                reviewPicture,
                customer: {
                    connect: {
                        userId: user.userId,
                    }
                },
                // restaurant:{
                //     connect:{
                //         restaurantId: //파라미터 값으로 받아야하나?
                //     }
                // }
            }
        })
        return review;
    }
    // 리뷰 수정
    putReview = async (reviewId, user, changereview) => {
        const { comment, rating, reviewPicture } = changereview;
        const review = await this.prisma.Review.update({
            where: {
                // restaurantId: +restaurantId,
                // ownerId: user.userId
            },
            data: {
                ...(comment && { comment }),
                ...(rating && { rating }),
                ...(reviewPicture && { reviewPicture })
            },
        })
        return review;
    }
    // 리뷰 삭제
    deleteReview = async (reviewId, user) => {
        const review = await this.prisma.Restaurant.delete({
            where: {
                // restaurantId: +restaurantId,
                // ownerId: user.userId
            },
        })
        return review.reviewId;
    }

    //유저의 중복 리뷰찾기
    existedReview = async (user) => {
        const review = await this.prisma.Review.count({
            // where: { ownerId: user.userId },
        })
        return review;
    }
}

export default ReviewRepository;