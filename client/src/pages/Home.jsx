// import ProductCard from "@/components/ProductCard";
// import { getAllProducts } from "@/services/productService";
// import { useEffect, useState } from "react";
// import Loader from "@/components/Loader";
// import { ArrowDown, ArrowRight, BadgeCheck, Headphones, Laptop, Keyboard, Mouse, ShieldCheck, Truck } from "lucide-react";
// import { Link } from "react-router-dom";

// const Home = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 setLoading(true);
//                 const data = await getAllProducts();
//                 const availableProducts = Array.isArray(data) ? data : [];
//                 setProducts(availableProducts);
//             } catch (error) {
//                 console.error("Failed to fetch products:", error);
//                 setProducts([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, []);

//     const heroProduct = products[0];
//     const heroImage = heroProduct?.imageFilename || heroProduct?.imageFilenames?.[0];
//     const heroImageUrl = heroImage ? `http://localhost:8080/uploads/images/${heroImage}` : "";
//     const categories = [[Laptop, "Workspaces"], [Keyboard, "Keyboards"], [Headphones, "Audio"], [Mouse, "Accessories"]];

//     return (
//         <div className="flex flex-col gap-14 pb-12">
//             <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#17211b] px-6 py-12 text-white sm:px-12 lg:min-h-[450px] lg:px-16 lg:py-16">
//                 <div className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-[#60a5fa] blur-3xl opacity-20" />
//                 <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
//                     <div className="max-w-xl">
//                         <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#93c5fd]"><BadgeCheck className="h-4 w-4" /> Curated tech, made simple</p>
//                         <h1 className="max-w-lg text-5xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl">Better gear for your everyday.</h1>
//                         <p className="mt-6 max-w-md text-base leading-7 text-white/65">Thoughtful essentials for focused work, deep play, and everything in between.</p>
//                         <Link to="#featured" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#3b82f6] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#60a5fa]">Explore collection <ArrowRight className="h-4 w-4" /></Link>
//                     </div>
//                     <div className="relative hidden min-h-72 items-center justify-center lg:flex">
//                         <div className="absolute h-64 w-64 rounded-full border border-white/10" /><div className="absolute h-48 w-48 rounded-full border border-[#93c5fd]/40" />
//                         {/* {heroImageUrl ? <img src={heroImageUrl} alt={heroProduct?.name || "Featured product"} className="relative z-10 h-72 w-72 object-contain drop-shadow-2xl" /> : <Laptop className="relative z-10 h-40 w-40 text-[#93c5fd]" strokeWidth={1} />} */}
//                     </div>
//                 </div>
//                 <div className="absolute bottom-6 right-8 hidden items-center gap-2 text-xs text-white/45 lg:flex"><ArrowDown className="h-4 w-4" /> Scroll to shop</div>
//             </section>

//             <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 {categories.map(([Icon, label]) => <a key={label} href="#featured" className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4 transition hover:border-[#3b82f6] hover:bg-[#eff6ff]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f0e9] text-[#17211b] transition group-hover:bg-white"><Icon className="h-5 w-5" /></span><span className="text-sm font-semibold">{label}</span></a>)}
//             </section>

//             <section id="featured" className="scroll-mt-28">
//                 <div className="mb-7 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e56b45]">The edit</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured products</h2></div><span className="hidden text-sm text-muted-foreground sm:block">Small upgrades. Big difference.</span></div>
//                 {loading ? (
//                     <div className="flex items-center justify-center py-20">
//                         <Loader />
//                     </div>
//                 ) : products.length === 0 ? (
//                     <div className="flex items-center justify-center py-20">
//                         <p className="text-gray-500 text-lg">No products found</p>
//                     </div>
//                 ) : (
//                     <div>
//                         <div id="product-container" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                             {products.map((product) => (
//                                 <ProductCard key={product.id} product={product} />
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </section>
//             <section id="why-Neki" className="grid gap-6 border-y border-black/10 py-10 sm:grid-cols-3">
//                 {[[Truck, "Quick delivery", "Get your essentials moving quickly."], [ShieldCheck, "Shop with confidence", "Reliable products, clearly described."], [BadgeCheck, "Selected with intent", "Less noise, better choices."]].map(([Icon, title, description]) => <div key={title} className="flex gap-4"><Icon className="h-6 w-6 shrink-0 text-[#e56b45]" /><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div></div>)}
//             </section>
//         </div>
//     );
// };

// export default Home;    


import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/services/productService";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import {
    ArrowDown,
    ArrowRight,
    BadgeCheck,
    Headphones,
    Laptop,
    Keyboard,
    Mouse,
    ShieldCheck,
    Truck
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getAllProducts();
                const availableProducts = Array.isArray(data) ? data : [];
                setProducts(availableProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const heroProduct = products[0];
    const heroImage =
        heroProduct?.imageFilename || heroProduct?.imageFilenames?.[0];

    const heroImageUrl = heroImage
        ? `http://localhost:8080/uploads/images/${heroImage}`
        : "";

    const categories = [
        [Laptop, "Workspaces"],
        [Keyboard, "Keyboards"],
        [Headphones, "Audio"],
        [Mouse, "Accessories"]
    ];

    return (
        <div className="flex flex-col gap-14 pb-12">
            {/* Hero */}
            <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#17211b] px-6 py-12 text-white sm:px-12 lg:min-h-[450px] lg:px-16 lg:py-16">
                <div className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-[#60a5fa] blur-3xl opacity-20" />

                <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
                    <div className="max-w-xl">
                        <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#93c5fd]">
                            <BadgeCheck className="h-4 w-4" />
                            Curated tech, made simple
                        </p>

                        <h1 className="max-w-lg text-5xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl">
                            Better gear for your everyday.
                        </h1>

                        <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                            Thoughtful essentials for focused work, deep play, and
                            everything in between.
                        </p>

                        <Link
                            to="#featured"
                            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#3b82f6] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#60a5fa]"
                        >
                            Explore collection
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="relative hidden min-h-72 items-center justify-center lg:flex">
                        <div className="absolute h-64 w-64 rounded-full border border-white/10" />
                        <div className="absolute h-48 w-48 rounded-full border border-[#93c5fd]/40" />
                    </div>
                </div>

                <div className="absolute bottom-6 right-8 hidden items-center gap-2 text-xs text-white/45 lg:flex">
                    <ArrowDown className="h-4 w-4" />
                    Scroll to shop
                </div>
            </section>

            {/* Categories */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {categories.map(([Icon, label]) => (
                    <a
                        key={label}
                        href="#featured"
                        className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4 transition hover:border-[#3b82f6] hover:bg-[#eff6ff]"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f0e9] text-[#17211b] transition group-hover:bg-white">
                            <Icon className="h-5 w-5" />
                        </span>

                        <span className="text-sm font-semibold">{label}</span>
                    </a>
                ))}
            </section>

            {/* Featured Products */}
            <section id="featured" className="scroll-mt-28">
                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e56b45]">
                            {/* The edit */}
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Featured products
                        </h2>
                    </div>

                    <span className="hidden text-sm text-muted-foreground sm:block">
                        {/* Small upgrades. Big difference. */}
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader />
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-lg text-gray-500">
                            No products found
                        </p>
                    </div>
                ) : (
                    <div>
                        <div
                            id="product-container"
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Why Neki */}
            <section
                id="why-Neki"
                className="grid gap-6 border-y border-black/10 py-10 sm:grid-cols-3"
            >
                {[
                    [
                        Truck,
                        "Quick delivery",
                        "Get your essentials moving quickly."
                    ],
                    [
                        ShieldCheck,
                        "Shop with confidence",
                        "Reliable products, clearly described."
                    ],
                    [
                        BadgeCheck,
                        "Selected with intent",
                        "Less noise, better choices."
                    ]
                ].map(([Icon, title, description]) => (
                    <div key={title} className="flex gap-4">
                        <Icon className="h-6 w-6 shrink-0 text-[#3b82f6]" />

                        <div>
                            <h3 className="font-bold">{title}</h3>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Home;