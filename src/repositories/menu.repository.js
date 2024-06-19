class MenuRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 메뉴 생성
  createMenu = async (restaurantId, name, price, description, menuPicture) => {
    return await this.prisma.menu.create({
      data: {
        restaurantId,
        name,
        price,
        description,
        menuPicture,
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
  getAllMenu = async (restaurantId) => {
    return await this.prisma.menu.findMany({
      where: {
        restaurantId,
      },
    });
  };

  // 해당 메뉴 조회
  getMenuById = async (menuId) => {
    return await this.prisma.menu.findFirst({
      where: {
        menuId,
      },
      include: {
        restaurant: {
          select: {
            name: true,
            ownerId: true,
          },
        },
      },
    });
  };

  updateMenu = async (menuId, name, price, description, menuPicture) => {
    return await this.prisma.menu.update({
      data: {
        name,
        price,
        description,
        menuPicture,
      },
      where: {
        menuId,
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

  deleteMenu = async (menuId) => {
    return await this.prisma.menu.delete({
      where: {
        menuId,
      },
    });
  };
}

export default MenuRepository;
