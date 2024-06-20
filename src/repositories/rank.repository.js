class RankRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getRank = async () => {
        const rank = await this.prisma.Restaurant.findMany({
            take: 3,
            orderBy: {
                revenue: 'desc' // 평점 내림차순으로 정렬
            },
        })

        return rank;
    }
    getHighRevenue = async () => {
        const rank = await this.prisma.Restaurant.findFirst({

            orderBy: {
                revenue: 'desc' // 평점 내림차순으로 정렬
            },
        })
        return rank.revenue;
    }
}
export default RankRepository;