import type { Ingredient } from "../types";

// 재료 이미지 import
import CoffeeBeanImg from "../assets/1-coffee-beans.png";
import WaterImg from "../assets/2-water.png";
import MilkImg from "../assets/3-milk.png";
import SugarImg from "../assets/4-sugar.png";
import IceImg from "../assets/5-ice.png";
import CaramelImg from "../assets/6-caramel.png";
import ChocolateImg from "../assets/7-chocolate.png";
import VanillaSyrupImg from "../assets/8-vanilla-syrup.png";
import StrawberryImg from "../assets/9-strawberry.png";
import MintLeavesImg from "../assets/10-mint-leaves.png";
import WhippedCreamImg from "../assets/11-whipped-cream.png";
import IceCreamImg from "../assets/12-ice-cream.png";

export const ingredients: Ingredient[] = [
  {
    id: 1,
    name: "Coffee Bean",
    icon: "☕",
    description: "Aromatic coffee beans",
    image: CoffeeBeanImg,
  },
  {
    id: 2,
    name: "Water",
    icon: "💧",
    description: "Pure water",
    image: WaterImg,
  },
  {
    id: 3,
    name: "Milk",
    icon: "🥛",
    description: "Fresh milk",
    image: MilkImg,
  },
  {
    id: 4,
    name: "Sugar",
    icon: "🧂",
    description: "White sugar crystals",
    image: SugarImg,
  },
  {
    id: 5,
    name: "Ice",
    icon: "🧊",
    description: "Ice cubes",
    image: IceImg,
  },
  {
    id: 6,
    name: "Caramel",
    icon: "🍮",
    description: "Sweet caramel ingredient",
    image: CaramelImg,
  },
  {
    id: 7,
    name: "Chocolate",
    icon: "🍫",
    description: "Dark chocolate",
    image: ChocolateImg,
  },
  {
    id: 8,
    name: "Vanilla Syrup",
    icon: "🌾",
    description: "Sweet vanilla syrup",
    image: VanillaSyrupImg,
  },
  {
    id: 9,
    name: "Strawberry",
    icon: "🍓",
    description: "Fresh strawberry",
    image: StrawberryImg,
  },
  {
    id: 10,
    name: "Mint Leaves",
    icon: "🌿",
    description: "Fresh mint leaves",
    image: MintLeavesImg,
  },
  {
    id: 11,
    name: "Whipped Cream",
    icon: "🍦",
    description: "Fluffy whipped cream",
    image: WhippedCreamImg,
  },
  {
    id: 12,
    name: "Ice Cream",
    icon: "🍨",
    description: "Vanilla ice cream",
    image: IceCreamImg,
  },
];

export const getIngredientById = (id: number): Ingredient | undefined => {
  return ingredients.find((ingredient) => ingredient.id === id);
};
