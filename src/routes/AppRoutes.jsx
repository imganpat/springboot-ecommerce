import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/routes/ProtectedRoute";
import ProductPage from "@/pages/ProductPage";
import AppLayout from "@/layouts/AppLayout";
import CartPage from "@/pages/CartPage";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <MainLayout>
                            <AppLayout>
                                <Home />
                            </AppLayout>
                        </MainLayout>
                    }
                />
                <Route
                    path="product/:id"
                    element={
                        <MainLayout>
                            <AppLayout>
                                <ProductPage />
                            </AppLayout>
                        </MainLayout>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <MainLayout>
                            <AppLayout>
                                <CartPage />
                            </AppLayout>
                        </MainLayout>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <MainLayout>
                            <Login />
                        </MainLayout>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <MainLayout>
                            <Register />
                        </MainLayout>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <AppLayout>
                                    <Dashboard />
                                </AppLayout>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute adminOnly>
                            <MainLayout>
                                <AppLayout>
                                    <AdminDashboard />
                                </AppLayout>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;