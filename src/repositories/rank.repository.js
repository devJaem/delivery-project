class RankRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getRank = async () => {
    const rank = await this.prisma.Restaurant.findMany({
      take: 3,
      orderBy: {
        revenues: 'desc', // 평점 내림차순으로 정렬
      },
    });

    return rank;
  };
  getHighRevenues = async () => {
    const rank = await this.prisma.Restaurant.findFirst({
      orderBy: {
        revenues: 'desc', // 평점 내림차순으로 정렬
      },
    });
    return rank.revenues;
  };
}

export default RankRepository;
