/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface DripDropCafeInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "EMPTY"
      | "baseURIs"
      | "burnCoffeeNFT"
      | "coffeeNFT"
      | "craftCoffee"
      | "findMatchingRecipe"
      | "getAllMenus"
      | "getIngredientName"
      | "getMenuBaseURI"
      | "getMenuInfo"
      | "getMenuPrice"
      | "getMenusWithRecipes"
      | "getRecipeHash"
      | "getRecipePattern"
      | "getValidIngredients"
      | "hasRequiredIngredients"
      | "ingredient"
      | "menuPrices"
      | "orderMenu"
      | "owner"
      | "payment"
      | "recipes"
      | "redeemCoffee"
      | "registerIngredient"
      | "removeIngredient"
      | "renounceOwnership"
      | "setMenuPrice"
      | "setRecipe"
      | "transferOwnership"
      | "validatePattern"
      | "withdrawPayments"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Crafted"
      | "MenuOrdered"
      | "MenuPriceSet"
      | "OwnershipTransferred"
      | "RecipeSet"
      | "Redeemed"
  ): EventFragment;

  encodeFunctionData(functionFragment: "EMPTY", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "baseURIs",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "burnCoffeeNFT",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "coffeeNFT", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "craftCoffee",
    values: [BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "findMatchingRecipe",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllMenus",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getIngredientName",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getMenuBaseURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getMenuInfo",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getMenuPrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getMenusWithRecipes",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRecipeHash",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRecipePattern",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getValidIngredients",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hasRequiredIngredients",
    values: [AddressLike, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "ingredient",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "menuPrices",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "orderMenu",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "payment", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "recipes",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemCoffee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "registerIngredient",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeIngredient",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setMenuPrice",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setRecipe",
    values: [BigNumberish, BigNumberish[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validatePattern",
    values: [BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawPayments",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "EMPTY", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "baseURIs", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "burnCoffeeNFT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "coffeeNFT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "craftCoffee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "findMatchingRecipe",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllMenus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getIngredientName",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMenuBaseURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMenuInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMenuPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMenusWithRecipes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRecipeHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRecipePattern",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getValidIngredients",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasRequiredIngredients",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ingredient", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "menuPrices", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "orderMenu", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payment", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "recipes", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemCoffee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerIngredient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeIngredient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMenuPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setRecipe", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatePattern",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawPayments",
    data: BytesLike
  ): Result;
}

export namespace CraftedEvent {
  export type InputTuple = [
    user: AddressLike,
    menuId: BigNumberish,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [user: string, menuId: bigint, tokenId: bigint];
  export interface OutputObject {
    user: string;
    menuId: bigint;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MenuOrderedEvent {
  export type InputTuple = [
    user: AddressLike,
    menuId: BigNumberish,
    ingredientId: BigNumberish
  ];
  export type OutputTuple = [
    user: string,
    menuId: bigint,
    ingredientId: bigint
  ];
  export interface OutputObject {
    user: string;
    menuId: bigint;
    ingredientId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MenuPriceSetEvent {
  export type InputTuple = [menuId: BigNumberish, price: BigNumberish];
  export type OutputTuple = [menuId: bigint, price: bigint];
  export interface OutputObject {
    menuId: bigint;
    price: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RecipeSetEvent {
  export type InputTuple = [menuId: BigNumberish];
  export type OutputTuple = [menuId: bigint];
  export interface OutputObject {
    menuId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RedeemedEvent {
  export type InputTuple = [user: AddressLike, tokenId: BigNumberish];
  export type OutputTuple = [user: string, tokenId: bigint];
  export interface OutputObject {
    user: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DripDropCafe extends BaseContract {
  connect(runner?: ContractRunner | null): DripDropCafe;
  waitForDeployment(): Promise<this>;

  interface: DripDropCafeInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  EMPTY: TypedContractMethod<[], [bigint], "view">;

  baseURIs: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  burnCoffeeNFT: TypedContractMethod<
    [tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  coffeeNFT: TypedContractMethod<[], [string], "view">;

  craftCoffee: TypedContractMethod<
    [menuId: BigNumberish, pattern: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  findMatchingRecipe: TypedContractMethod<
    [pattern: BigNumberish[]],
    [bigint],
    "view"
  >;

  getAllMenus: TypedContractMethod<
    [],
    [
      [bigint[], bigint[], boolean[], string[]] & {
        menuIds: bigint[];
        prices: bigint[];
        hasRecipes: boolean[];
        baseURIList: string[];
      }
    ],
    "view"
  >;

  getIngredientName: TypedContractMethod<[id: BigNumberish], [string], "view">;

  getMenuBaseURI: TypedContractMethod<[menuId: BigNumberish], [string], "view">;

  getMenuInfo: TypedContractMethod<
    [menuId: BigNumberish],
    [
      [bigint, boolean, string, bigint[]] & {
        price: bigint;
        hasRecipe: boolean;
        baseURI: string;
        pattern: bigint[];
      }
    ],
    "view"
  >;

  getMenuPrice: TypedContractMethod<[menuId: BigNumberish], [bigint], "view">;

  getMenusWithRecipes: TypedContractMethod<[], [bigint[]], "view">;

  getRecipeHash: TypedContractMethod<[menuId: BigNumberish], [string], "view">;

  getRecipePattern: TypedContractMethod<
    [menuId: BigNumberish],
    [bigint[]],
    "view"
  >;

  getValidIngredients: TypedContractMethod<[], [bigint[]], "view">;

  hasRequiredIngredients: TypedContractMethod<
    [user: AddressLike, pattern: BigNumberish[]],
    [boolean],
    "view"
  >;

  ingredient: TypedContractMethod<[], [string], "view">;

  menuPrices: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  orderMenu: TypedContractMethod<[menuId: BigNumberish], [void], "nonpayable">;

  owner: TypedContractMethod<[], [string], "view">;

  payment: TypedContractMethod<[], [string], "view">;

  recipes: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  redeemCoffee: TypedContractMethod<
    [tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  registerIngredient: TypedContractMethod<
    [id: BigNumberish, name: string],
    [void],
    "nonpayable"
  >;

  removeIngredient: TypedContractMethod<
    [id: BigNumberish],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setMenuPrice: TypedContractMethod<
    [menuId: BigNumberish, price: BigNumberish],
    [void],
    "nonpayable"
  >;

  setRecipe: TypedContractMethod<
    [menuId: BigNumberish, pattern: BigNumberish[], uriPrefix: string],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  validatePattern: TypedContractMethod<
    [menuId: BigNumberish, pattern: BigNumberish[]],
    [boolean],
    "view"
  >;

  withdrawPayments: TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "EMPTY"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "baseURIs"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "burnCoffeeNFT"
  ): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "coffeeNFT"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "craftCoffee"
  ): TypedContractMethod<
    [menuId: BigNumberish, pattern: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "findMatchingRecipe"
  ): TypedContractMethod<[pattern: BigNumberish[]], [bigint], "view">;
  getFunction(
    nameOrSignature: "getAllMenus"
  ): TypedContractMethod<
    [],
    [
      [bigint[], bigint[], boolean[], string[]] & {
        menuIds: bigint[];
        prices: bigint[];
        hasRecipes: boolean[];
        baseURIList: string[];
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getIngredientName"
  ): TypedContractMethod<[id: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getMenuBaseURI"
  ): TypedContractMethod<[menuId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getMenuInfo"
  ): TypedContractMethod<
    [menuId: BigNumberish],
    [
      [bigint, boolean, string, bigint[]] & {
        price: bigint;
        hasRecipe: boolean;
        baseURI: string;
        pattern: bigint[];
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getMenuPrice"
  ): TypedContractMethod<[menuId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getMenusWithRecipes"
  ): TypedContractMethod<[], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "getRecipeHash"
  ): TypedContractMethod<[menuId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getRecipePattern"
  ): TypedContractMethod<[menuId: BigNumberish], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "getValidIngredients"
  ): TypedContractMethod<[], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "hasRequiredIngredients"
  ): TypedContractMethod<
    [user: AddressLike, pattern: BigNumberish[]],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "ingredient"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "menuPrices"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "orderMenu"
  ): TypedContractMethod<[menuId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "payment"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "recipes"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "redeemCoffee"
  ): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "registerIngredient"
  ): TypedContractMethod<
    [id: BigNumberish, name: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "removeIngredient"
  ): TypedContractMethod<[id: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setMenuPrice"
  ): TypedContractMethod<
    [menuId: BigNumberish, price: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setRecipe"
  ): TypedContractMethod<
    [menuId: BigNumberish, pattern: BigNumberish[], uriPrefix: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "validatePattern"
  ): TypedContractMethod<
    [menuId: BigNumberish, pattern: BigNumberish[]],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "withdrawPayments"
  ): TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Crafted"
  ): TypedContractEvent<
    CraftedEvent.InputTuple,
    CraftedEvent.OutputTuple,
    CraftedEvent.OutputObject
  >;
  getEvent(
    key: "MenuOrdered"
  ): TypedContractEvent<
    MenuOrderedEvent.InputTuple,
    MenuOrderedEvent.OutputTuple,
    MenuOrderedEvent.OutputObject
  >;
  getEvent(
    key: "MenuPriceSet"
  ): TypedContractEvent<
    MenuPriceSetEvent.InputTuple,
    MenuPriceSetEvent.OutputTuple,
    MenuPriceSetEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "RecipeSet"
  ): TypedContractEvent<
    RecipeSetEvent.InputTuple,
    RecipeSetEvent.OutputTuple,
    RecipeSetEvent.OutputObject
  >;
  getEvent(
    key: "Redeemed"
  ): TypedContractEvent<
    RedeemedEvent.InputTuple,
    RedeemedEvent.OutputTuple,
    RedeemedEvent.OutputObject
  >;

  filters: {
    "Crafted(address,uint256,uint256)": TypedContractEvent<
      CraftedEvent.InputTuple,
      CraftedEvent.OutputTuple,
      CraftedEvent.OutputObject
    >;
    Crafted: TypedContractEvent<
      CraftedEvent.InputTuple,
      CraftedEvent.OutputTuple,
      CraftedEvent.OutputObject
    >;

    "MenuOrdered(address,uint256,uint8)": TypedContractEvent<
      MenuOrderedEvent.InputTuple,
      MenuOrderedEvent.OutputTuple,
      MenuOrderedEvent.OutputObject
    >;
    MenuOrdered: TypedContractEvent<
      MenuOrderedEvent.InputTuple,
      MenuOrderedEvent.OutputTuple,
      MenuOrderedEvent.OutputObject
    >;

    "MenuPriceSet(uint256,uint256)": TypedContractEvent<
      MenuPriceSetEvent.InputTuple,
      MenuPriceSetEvent.OutputTuple,
      MenuPriceSetEvent.OutputObject
    >;
    MenuPriceSet: TypedContractEvent<
      MenuPriceSetEvent.InputTuple,
      MenuPriceSetEvent.OutputTuple,
      MenuPriceSetEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "RecipeSet(uint256)": TypedContractEvent<
      RecipeSetEvent.InputTuple,
      RecipeSetEvent.OutputTuple,
      RecipeSetEvent.OutputObject
    >;
    RecipeSet: TypedContractEvent<
      RecipeSetEvent.InputTuple,
      RecipeSetEvent.OutputTuple,
      RecipeSetEvent.OutputObject
    >;

    "Redeemed(address,uint256)": TypedContractEvent<
      RedeemedEvent.InputTuple,
      RedeemedEvent.OutputTuple,
      RedeemedEvent.OutputObject
    >;
    Redeemed: TypedContractEvent<
      RedeemedEvent.InputTuple,
      RedeemedEvent.OutputTuple,
      RedeemedEvent.OutputObject
    >;
  };
}
