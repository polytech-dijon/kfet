import { Prisma } from '@prisma/client'
import { Category } from '../types/db'

export const articles = [
  {
    name: '7UP',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [1],
  },
  {
    name: 'Coca',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [2],
  },
  {
    name: 'Coca Cherry',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [3],
  },
  {
    name: 'Orangina',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [4],
  },
  {
    name: 'Ice Tea Pêche',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [5],
  },
  {
    name: 'Green Ice Tea',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [6],
    deleted: true,
  },
  {
    name: 'Oasis Tropical',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [7],
  },
  {
    name: 'Oasis Pomme Cassis Framboise',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [8],
  },
  {
    name: 'Schweppes Agrumes',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.COLD_DRINKS,
    products: [9],
  },
  {
    name: 'Caprisun',
    sell_price: new Prisma.Decimal(0.50),
    category: Category.COLD_DRINKS,
    products: [10],
  },
  {
    name: 'Bouteille d\'eau',
    sell_price: new Prisma.Decimal(0.50),
    category: Category.COLD_DRINKS,
    products: [11],
  },
  {
    name: 'Thé',
    sell_price: new Prisma.Decimal(0.30),
    category: Category.HOT_DRINKS,
    products: [],
  },
  {
    name: 'Petit café',
    sell_price: new Prisma.Decimal(0.30),
    category: Category.HOT_DRINKS,
    products: [],
  },
  {
    name: 'Grand café',
    sell_price: new Prisma.Decimal(0.50),
    category: Category.HOT_DRINKS,
    products: [],
  },
  {
    name: 'Chocolat',
    sell_price: new Prisma.Decimal(0.50),
    category: Category.HOT_DRINKS,
    products: [],
  },
  {
    name: 'Kinder Bueno',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.SWEET,
    products: [12],
  },
  {
    name: 'Kinder Bueno White',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.SWEET,
    products: [13],
  },
  {
    name: 'Bounty',
    sell_price: new Prisma.Decimal(0.70),
    category: Category.SWEET,
    products: [14],
  },
  {
    name: 'KitKat',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
    products: [15],
  },
  {
    name: 'Lion',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
    products: [16],
  },
  {
    name: 'Mars',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
    products: [17],
  },
  {
    name: 'Twix',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
    products: [18],
  },
  {
    name: 'Snickers',
    sell_price: new Prisma.Decimal(0.60),
    category: Category.SWEET,
    products: [19],
  },
  {
    name: 'M&M\'s',
    sell_price: new Prisma.Decimal(1.00),
    category: Category.SWEET,
    products: [20],
  },
  {
    name: 'Gaufre Nature',
    sell_price: new Prisma.Decimal(0.40),
    category: Category.SWEET,
    products: [21],
  },
  {
    name: 'Gaufre Chocolat',
    sell_price: new Prisma.Decimal(0.40),
    category: Category.SWEET,
    products: [22],
  },
  {
    name: 'Pitch',
    sell_price: new Prisma.Decimal(0.40),
    category: Category.SWEET,
    products: [23],
  },
  {
    name: 'Pizza 4 Fromages',
    sell_price: new Prisma.Decimal(3.50),
    category: Category.SALTY,
    products: [24],
  },
  {
    name: 'Pizza Chorizo',
    sell_price: new Prisma.Decimal(3.50),
    category: Category.SALTY,
    products: [25],
  },
  {
    name: 'Pizza Jambom/Fromage',
    sell_price: new Prisma.Decimal(3.50),
    category: Category.SALTY,
    products: [26],
  },
  {
    name: 'Pizza Chèvre',
    sell_price: new Prisma.Decimal(3.50),
    category: Category.SALTY,
    products: [27],
  },
  {
    name: 'Pastabox Bolognaise',
    sell_price: new Prisma.Decimal(3.00),
    category: Category.SALTY,
    products: [28],
  },
  {
    name: 'Pastabox Carbonara',
    sell_price: new Prisma.Decimal(3.00),
    category: Category.SALTY,
    products: [29],
  },
  {
    name: 'Pastabox 4 Fromages',
    sell_price: new Prisma.Decimal(3.00),
    category: Category.SALTY,
    products: [30],
  },
  {
    name: 'Nouilles Boeuf',
    sell_price: new Prisma.Decimal(1.50),
    category: Category.SALTY,
    products: [31],
  },
  {
    name: 'Nouilles Crevette',
    sell_price: new Prisma.Decimal(1.50),
    category: Category.SALTY,
    products: [32],
  },
  {
    name: 'Nouilles Poulet',
    sell_price: new Prisma.Decimal(1.50),
    category: Category.SALTY,
    products: [33],
  },
  {
    name: 'Nouilles Végératien',
    sell_price: new Prisma.Decimal(1.50),
    category: Category.SALTY,
    products: [34],
  },
  {
    name: 'Chips',
    sell_price: new Prisma.Decimal(0.40),
    category: Category.SALTY,
    products: [35],
  },
  {
    name: 'Saucisson',
    sell_price: new Prisma.Decimal(4.00),
    category: Category.SALTY,
    products: [36],
  },
]

export const products = [
  {
    name: '7UP',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.37),
  },
  {
    name: 'Coca',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.50), // à vérifier
  },
  {
    name: 'Coca Cherry',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.50), // à vérifier
  },
  {
    name: 'Orangina',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.51),
  },
  {
    name: 'Ice Tea Pêche',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.43),
  },
  {
    name: 'Green Ice Tea',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.50), // à vérifier,
    deleted: true,
  },
  {
    name: 'Oasis Tropical',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.50), // à vérifier
  },
  {
    name: 'Oasis Pomme Cassis Framboise',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.50), // à vérifier
  },
  {
    name: 'Schweppes Agrumes',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.50), // à vérifier
  },
  {
    name: 'Caprisun',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.31),
  },
  {
    name: 'Bouteille d\'eau',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.25),
  },
  {
    name: 'Kinder Bueno',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.59),
  },
  {
    name: 'Kinder Bueno White',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.62),
  },
  {
    name: 'Bounty',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.48),
  },
  {
    name: 'KitKat',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.48),
  },
  {
    name: 'Lion',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.50), // à vérifier
  },
  {
    name: 'Mars',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.37),
  },
  {
    name: 'Twix',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.40),
  },
  {
    name: 'KitKat',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.48),
  },
  {
    name: 'Lion',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.52),
  },
  {
    name: 'Mars',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.37),
  },
  {
    name: 'Twix',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.40),
  },
  {
    name: 'Snickers',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.52),
  },
  {
    name: 'M&M\'s',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.50), // à vérifier
  },
  {
    name: 'Gaufre Nature',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.21),
  },
  {
    name: 'Gaufre Chocolat',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.27),
  },
  {
    name: 'Pitch',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.20),
  },
  {
    name: 'Pizza 4 Fromages',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.75),
  },
  {
    name: 'Pizza Chorizo',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.94),
  },
  {
    name: 'Pizza Jambom/Fromage',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.69),
  },
  {
    name: 'Pizza Chèvre',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.50), // à vérifier
  },
  {
    name: 'Pastabox Bolognaise',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.00), // à vérifier
  },
  {
    name: 'Pastabox Carbonara',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.00), // à vérifier
  },
  {
    name: 'Pastabox 4 Fromages',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.00), // à vérifier
  },
  {
    name: 'Nouilles Boeuf',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.00), // à vérifier
  },
  {
    name: 'Nouilles Crevette',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.00), // à vérifier
  },
  {
    name: 'Nouilles Poulet',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.00), // à vérifier
  },
  {
    name: 'Nouilles Végératien',
    quantity: 1000,
    buying_price: new Prisma.Decimal(1.00), // à vérifier
  },
  {
    name: 'Chips',
    quantity: 1000,
    buying_price: new Prisma.Decimal(0.18),
  },
  {
    name: 'Saucisson',
    quantity: 1000,
    buying_price: new Prisma.Decimal(2.52),
  },
]