import { Prisma } from '@prisma/client'
import { Category } from '../types/db'

export const articles = [
  {
    name: '7UP',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Coca',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Coca Cherry',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Orangina',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Ice Tea Pêche',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Green Ice Tea',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    deleted: true,
  },
  {
    name: 'Oasis Tropical',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Oasis Pomme Cassis Framboise',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Schweppes Agrumes',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Caprisun',
    sell_price: new Prisma.Decimal(0.50),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Bouteille d\'eau',
    sell_price: new Prisma.Decimal(0.50),
    category: Category.COLD_DRINKS,
  },
  {
    name: 'Thé',
    sell_price: new Prisma.Decimal(0.30),
    category: Category.HOT_DRINKS,
  },
  {
    name: 'Petit café',
    sell_price: new Prisma.Decimal(0.30),
    category: Category.HOT_DRINKS,
  },
  {
    name: 'Grand café',
    sell_price: new Prisma.Decimal(0.50),
    category: Category.HOT_DRINKS,
  },
  {
    name: 'Chocolat',
    sell_price: new Prisma.Decimal(0.50),
    category: Category.HOT_DRINKS,
  },
  {
    name: 'Kinder Bueno',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.SWEET,
  },
  {
    name: 'Kinder Bueno White',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.SWEET,
  },
  {
    name: 'Bounty',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.SWEET,
  },
  {
    name: 'KitKat',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
  },
  {
    name: 'Lion',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
  },
  {
    name: 'Mars',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
  },
  {
    name: 'Twix',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
  },
  {
    name: 'Snickers',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
  },
  {
    name: 'M&M\'s',
    sell_price: new Prisma.Decimal(1.00),
    category: Category.SWEET,
  },
  {
    name: 'Gaufre Nature',
    sell_price: new Prisma.Decimal(0.40),
    category: Category.SWEET,
  },
  {
    name: 'Gaufre Chocolat',
    sell_price: new Prisma.Decimal(0.40),
    category: Category.SWEET,
  },
  {
    name: 'Pitch',
    sell_price: new Prisma.Decimal(0.40),
    category: Category.SWEET,
  },
  {
    name: 'Pizza 4 Fromages',
    sell_price: new Prisma.Decimal(3.50),
    category: Category.SALTY,
  },
  {
    name: 'Pizza Chorizo',
    sell_price: new Prisma.Decimal(3.50),
    category: Category.SALTY,
  },
  {
    name: 'Pizza Jambom/Fromage',
    sell_price: new Prisma.Decimal(3.50),
    category: Category.SALTY,
  },
  {
    name: 'Pizza Chèvre',
    sell_price: new Prisma.Decimal(3.50),
    category: Category.SALTY,
  },
  {
    name: 'Pastabox Bolognaise',
    sell_price: new Prisma.Decimal(3.00),
    category: Category.SALTY,
  },
  {
    name: 'Pastabox Carbonara',
    sell_price: new Prisma.Decimal(3.00),
    category: Category.SALTY,
  },
  {
    name: 'Pastabox 4 Fromages',
    sell_price: new Prisma.Decimal(3.00),
    category: Category.SALTY,
  },
  {
    name: 'Nouilles Boeuf',
    sell_price: new Prisma.Decimal(1.50),
    category: Category.SALTY,
  },
  {
    name: 'Nouilles Crevette',
    sell_price: new Prisma.Decimal(1.50),
    category: Category.SALTY,
  },
  {
    name: 'Nouilles Poulet',
    sell_price: new Prisma.Decimal(1.50),
    category: Category.SALTY,
  },
  {
    name: 'Nouilles Végératien',
    sell_price: new Prisma.Decimal(1.50),
    category: Category.SALTY,
  },
  {
    name: 'Chips',
    sell_price: new Prisma.Decimal(0.40),
    category: Category.SALTY,
  },
  {
    name: 'Saucisson',
    sell_price: new Prisma.Decimal(4.00),
    category: Category.SALTY,
  },
]
