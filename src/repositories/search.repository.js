class SearchRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getSearch = async (searchCondition) => {
    const search = await this.prisma.Restaurant.findMany({
      where: searchCondition,
    });
    return search;
  };
}

export default SearchRepository;
