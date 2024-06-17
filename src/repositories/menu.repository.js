class MenuRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 메뉴 생성
  createMenu = async (restaurantId, menuName, price, description, imageUrl) => {
    return await this.prisma.menu.create({
      data: {
        restaurantId,
        menuName,
        price,
        description,
        imageUrl,
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    });
  };

  // 해당 가게의 메뉴 전체 조회
  findAllMenu = async (restaurantId) => {
    return await this.prisma.menu.findMany({
      where: {
        restaurantId,
      },
      include: {
        restaurant: {
          select: {
            restaurantId: true,
          },
        },
      },
    });
  };

  // 해당 메뉴 조회
  findMenuById = async (menuId) => {
    return await this.prisma.menu.findFirst({
      where: {
        menuId,
      },
      include: {
        options: {
          optionId: true,
          name: true,
          description: true,
        },
        restaurant: {
          ownerId: true,
        },
      },
    });
  };

  // 메뉴 옵션 생성
  createOption = async (menuId, name, description) => {
    return await this.prisma.options.create({
      data: {
        menuId,
        name,
        description,
      },
      include: {
        menu: {
          select: {
            name: true,
          },
        },
      },
    });
  };

  //옵션 항목 생성
  createSelect = async (optionId, name) => {
    return await this.prisma.select.create({
      data: {
        optionId,
        name,
      },
    });
  };
}

export default MenuRepository;
