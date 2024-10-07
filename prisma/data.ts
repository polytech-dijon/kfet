import { Prisma } from '@prisma/client'
import { Category } from '../types/db'

export const articles = [
  {
    name:'Café vanille ou noisette',
    sell_price: new Prisma.Decimal(0.5),
    category: Category.HOT_DRINKS
},
{
    name:'Café',
    sell_price: new Prisma.Decimal(0.5),
    category: Category.HOT_DRINKS
},
{
    name:'Thé',
    sell_price: new Prisma.Decimal(0.3),
    category: Category.HOT_DRINKS
},
{
    name:'Salade',
    sell_price: new Prisma.Decimal(4.0),
    category: Category.SALTY
},
{
    name:'Pizza',
    sell_price: new Prisma.Decimal(3.5),
    category: Category.SALTY
},
{
    name:'Pastabox',
    sell_price: new Prisma.Decimal(3.0),
    category: Category.SALTY
},
{
    name:'Wraps',
    sell_price: new Prisma.Decimal(3.0),
    category: Category.SALTY
},
{
    name:'Sandwichs',
    sell_price: new Prisma.Decimal(2.5),
    category: Category.SALTY
},
{
    name:'Nouilles',
    sell_price: new Prisma.Decimal(1.7),
    category: Category.SALTY
},
{
    name:'Red-bull',
    sell_price: new Prisma.Decimal(1.5),
    category: Category.COLD_DRINKS
},
{
    name:'Coca-cola (Zéro, Cherry)',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.COLD_DRINKS
},
{
    name:'Fanta (Citron, FD)',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.COLD_DRINKS
},
{
    name:'Fuze-tea',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.COLD_DRINKS
},
{
    name:'Oasis (Tropical, PCF)',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.COLD_DRINKS
},
{
    name:'Orangina',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.COLD_DRINKS
},
{
    name:'Kinder bueno',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.SWEET
},
{
    name:'Kinder bueno white',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.SWEET
},
{
    name:'Kitkat',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.SWEET
},
{
    name:'Lion',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.SWEET
},
{
    name:'Oreo',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.SWEET
},
{
    name:'Twix',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.SWEET
},
{
    name:'Snickers',
    sell_price: new Prisma.Decimal(0.8),
    category: Category.SWEET
},
{
    name:'Sucette',
    sell_price: new Prisma.Decimal(0.2),
    category: Category.SWEET
},
{
    name:'Barre protéiné',
    sell_price: new Prisma.Decimal(1.0),
    category: Category.SWEET
},
{
    name:'Gaufre chocolat',
    sell_price: new Prisma.Decimal(0.6),
    category: Category.SWEET
},
{
    name:'Gaufre nature',
    sell_price: new Prisma.Decimal(0.5),
    category: Category.SWEET
},
{
    name:'Pom\'Pote',
    sell_price: new Prisma.Decimal(0.5),
    category: Category.SWEET
},
{
    name:'Chips',
    sell_price: new Prisma.Decimal(0.5),
    category: Category.SALTY
},
{
    name:'Eau gazeuse',
    sell_price: new Prisma.Decimal(0.6),
    category: Category.COLD_DRINKS
},
{
    name:'Eau (bouteille)',
    sell_price: new Prisma.Decimal(0.5),
    category: Category.COLD_DRINKS
},
{
    name:'Caprisun',
    sell_price: new Prisma.Decimal(0.5),
    category: Category.COLD_DRINKS
},
{
    name:'Lait',
    sell_price: new Prisma.Decimal(0.5),
    category: Category.COLD_DRINKS
},
{
    name:'Jus de fruit',
    sell_price: new Prisma.Decimal(0.4),
    category: Category.COLD_DRINKS
}
]
