import {
  AddProductInput,
  ProductSearchQueryInput,
  UpdateProductInput,
} from "./product.types";

export const getAllProducts = async () => {
    
};


export const searchProduct = async (data: ProductSearchQueryInput) => {};

export const getProductById = async (id: string | string[]) => {};

export const addProduct = async (products: AddProductInput[]) => {};

export const updateProduct = async (products: UpdateProductInput) => {};

export const deleteProduct = async (id: string | string[]) => {};
