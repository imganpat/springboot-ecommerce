import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, LoaderCircle, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/authService";
import { getToken } from "@/utils/auth";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        admin: false
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (getToken()) {
        return <Navigate to="/dashboard" replace />
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
            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                admin: formData.admin
            });
            navigate("/login", { state: { registered: true } });
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "We could not create your account. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md space-y-4 border-black/10 bg-white py-0! shadow-xl shadow-black/10">
            <CardHeader className="gap-3 p-4! sm:p-6! pb-0! sm:pb-0!">
                <div className="flex size-11 items-center justify-center rounded-xl bg-black text-white">
                    <UserPlus aria-hidden="true" className="size-5" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">Create your account</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-4! sm:p-6! pt-0! sm:pt-0!">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input id="name" name="name" placeholder="Alex Morgan" required value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" name="email" type="email" placeholder="alex@example.com" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="At least 6 characters" minLength={6} required value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="flex gap-2">
                        <Input id="admin" name="admin" type="checkbox" checked={formData.admin} onChange={handleChange} className={"size-4"} />
                        <Label htmlFor="admin">Admin</Label>
                    </div>
                    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                    <Button className="mt-2 h-10 w-full" disabled={isSubmitting} type="submit">
                        {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <>{"Create account"}<ArrowRight aria-hidden="true" /></>}
                    </Button>
                </form>
                <p className="text-center mt-2! text-sm text-muted-foreground">
                    Already have an account? <Link className="font-medium text-foreground underline underline-offset-4" to="/login">Login in</Link>
                </p>
            </CardContent>
        </Card>
    );
};

export default Register;