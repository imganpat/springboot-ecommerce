import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, LoaderCircle, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";
import { setAuthSession } from "@/utils/auth";
import Loader from "@/components/Loader";


const Login = () => {
    const navigate = useNavigate();
    const { user, loading, setUser } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        admin: false
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) {
        return <Loader />;
    }

    if (user) {
        return <Navigate to={user.admin ? "/admin/dashboard" : "/dashboard"} replace />;
    }

    if (isSubmitting) {
        return <Loader />
    }

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const response = await loginUser({
                email: formData.email,
                password: formData.password,
                admin: formData.admin
            });

            const authUser = {
                id: response.id,
                name: response.name,
                email: response.email,
                admin: response.admin,
                token: response.token,
            };

            setAuthSession(response.token, authUser);
            setUser(authUser);

            navigate(response.admin ? "/admin/dashboard" : "/dashboard", { replace: true });
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-black/10 w-96 bg-white shadow-xl shadow-black/10 py-0! space-y-4">
            <CardHeader className="gap-3 p-4! sm:p-6! pb-0! sm:pb-0!">
                <div className="flex size-11 items-center justify-center rounded-xl bg-black text-white">
                    <UserPlus aria-hidden="true" className="size-5" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">Login to your account</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-4! sm:p-6! pt-0! sm:pt-0!">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" name="email" type="email" placeholder="alex@example.com" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="At least 6 characters" minLength={6} required value={formData.password} onChange={handleChange} />
                    </div>
                    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                    <Button className="mt-2 h-10 w-full" disabled={isSubmitting} type="submit">
                        {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <>{"Login"}<ArrowRight aria-hidden="true" /></>}
                    </Button>
                </form>
                <p className="text-center mt-2! text-sm text-muted-foreground">
                    Don't have an account? <Link className="font-medium text-foreground underline underline-offset-4" to="/register">Create one</Link>
                </p>
            </CardContent>
        </Card>

    );
};

export default Login;