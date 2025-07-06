// 이미지 import
import EspressoImg from "../assets/coffee/Espresso.png";
import CappuccinoImg from "../assets/coffee/Cappuccino.png";
import CaramelMacchiatoFrappeImg from "../assets/coffee/Caramel Macchiato Frappe.png";
import AffogatoImg from "../assets/coffee/Affogato.png";
import MintChocolateIcecreamImg from "../assets/coffee/Mint chocolate icecream.png";
import StrawberryJuiceImg from "../assets/coffee/Strawberry Juice.png";
import IcedCafeLatteImg from "../assets/coffee/Iced Cafe Latte.png";

export interface CoffeeMenu {
  id: number;
  name: string;
  description: string;
  image: string;
  recipe: number[]; // 9칸 레시피 (재료 ID 배열)
  price: number; // USDC 가격
}

export const coffeeMenus: CoffeeMenu[] = [
  {
    id: 1,
    name: "Espresso",
    description: "Strong and bold espresso shot",
    image: EspressoImg,
    recipe: [1, 1, 1, 1, 2, 1, 1, 1, 1], // Coffee Bean pattern with Water in center
    price: 3,
  },
  {
    id: 2,
    name: "Cappuccino",
    description: "Classic cappuccino with steamed milk and foam",
    image: CappuccinoImg,
    recipe: [11, 11, 11, 1, 1, 1, 3, 3, 3], // Whipped Cream, Coffee Bean, Milk
    price: 4,
  },
  {
    id: 4,
    name: "Caramel Macchiato Frappe",
    description: "Iced caramel macchiato with whipped cream",
    image: CaramelMacchiatoFrappeImg,
    recipe: [6, 3, 6, 5, 1, 5, 6, 3, 6], // Caramel, Milk, Ice, Coffee Bean
    price: 6,
  },
  {
    id: 7,
    name: "Affogato",
    description: "Espresso poured over vanilla ice cream",
    image: AffogatoImg,
    recipe: [1, 1, 1, 12, 12, 12, 8, 8, 8], // Coffee Bean, Ice Cream, Vanilla Syrup
    price: 7,
  },
  {
    id: 9,
    name: "Mint Chocolate Ice Cream",
    description: "Refreshing mint chocolate ice cream drink",
    image: MintChocolateIcecreamImg,
    recipe: [10, 7, 10, 12, 12, 12, 10, 7, 10], // Mint Leaves, Chocolate, Ice Cream
    price: 9,
  },
  {
    id: 10,
    name: "Strawberry Juice",
    description: "Fresh strawberry juice with ice",
    image: StrawberryJuiceImg,
    recipe: [9, 9, 9, 5, 2, 5, 9, 9, 9], // Strawberry, Ice, Water
    price: 5,
  },
  {
    id: 15,
    name: "Iced Cafe Latte",
    description: "Smooth iced latte with perfect milk balance",
    image: IcedCafeLatteImg,
    recipe: [5, 3, 5, 1, 1, 1, 5, 3, 5], // Ice, Milk, Coffee Bean
    price: 8,
  },
];

// 메뉴 ID로 메뉴 찾기
export const getCoffeeMenuById = (id: number): CoffeeMenu | undefined => {
  return coffeeMenus.find((menu) => menu.id === id);
};

// 레시피로 메뉴 찾기 (클라이언트 사이드 매칭)
export const findMenuByRecipe = (recipe: number[]): CoffeeMenu | undefined => {
  return coffeeMenus.find(
    (menu) =>
      menu.recipe.length === recipe.length &&
      menu.recipe.every((ingredient, index) => ingredient === recipe[index])
  );
};
