import axiosInstance from "@/api/axios";
import { getAuthSession } from "@/utils/auth";

const getAdminHeaders = () => {
    const { user } = getAuthSession();

    if (!user?.email) {
        throw new Error("Admin session is missing");
    }

    return {
        "X-User-Email": user.email,
    };
};

export const getAdminProducts = async () => {
    const response = await axiosInstance.get("/admin/products", {
        headers: getAdminHeaders(),
    });

    return response.data;
};

export const createAdminProduct = async (productData) => {
    const response = await axiosInstance.post("/admin/products", productData, {
        headers: getAdminHeaders(),
    });

    return response.data;
};

export const updateAdminProduct = async (productId, productData) => {
    const response = await axiosInstance.put(`/admin/products/${productId}`, productData, {
        headers: getAdminHeaders(),
    });

    return response.data;
};

export const deleteAdminProduct = async (productId) => {
    const response = await axiosInstance.delete(`/admin/products/${productId}`, {
        headers: getAdminHeaders(),
    });

    return response.data;
};

export const restoreAdminProduct = async (productId) => {
    const response = await axiosInstance.post(`/admin/products/${productId}/restore`, {}, {
        headers: getAdminHeaders(),
    });

    return response.data;
};
