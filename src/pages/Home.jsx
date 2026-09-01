import ProductCard from "@/components/ProductCard";
import AppLayout from "@/layouts/AppLayout";
import { getAllProducts } from "@/services/productService";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Button } from "@base-ui/react";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [])

    return (
        < div className="flex flex-col space-x-8!" >
            <div className="flex justify-center mt-16! w-full bg-gradient-to-r from-violet-600 to-violet-700 py-12!">
                <div className="w-4/5">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-bold text-white leading-tight">
                                Up to 50% Off
                            </h2>
                            <p className="text-violet-100 text-lg mt-2">Shop the best deals on all your favorite products</p>
                        </div>
                        <Button href="#" rel="noreferrer noopener" className="px-8! py-3! rounded-lg border-0 bg-white text-violet-600 font-semibold hover:bg-gray-100 transition whitespace-nowrap">Shop Now</Button>
                    </div>
                </div>
            </div>
            {/* Products Section */}
            <div className="flex justify-center w-full py-8!">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader />
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                ) : (
                    <div className="w-4/5 space-y-4!">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Featured Products</h3>
                        <div id="product-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Home;