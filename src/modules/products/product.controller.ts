import * as ProductServices from "./product.service";
import { HTTP_STATUS } from "../../constants/httpStatus.constant";
import { sendResponse } from "../../common/utils/apiResponse.util";
import { asyncHandler } from "../../common/utils/asyncHandler.util";

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductServices.getAllProducts();
  sendResponse({
    res,
    data: products,
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Products fetched successfully.",
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const products = await ProductServices.getProductById(req?.body?.id);
  sendResponse({
    res,
    data: products,
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Product fetched successfully.",
  });
});

export const addProduct = asyncHandler(async (req, res) => {
  const products = await ProductServices.addProduct(req?.body?.data);
  sendResponse({
    res,
    data: products,
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Product added successfully.",
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const products = await ProductServices.deleteProduct(req?.body?.id);
  sendResponse({
    res,
    data: products,
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Products deleted successfully.",
  });
});
