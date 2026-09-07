import axiosInstance from "@/api/axios";

export const getAllProducts = async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
}

export const getProductById = async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
}