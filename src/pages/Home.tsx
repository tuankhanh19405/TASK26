// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

interface ProductFromAPI {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  discountPercentage?: number;
}

const Home = () => {
  const [products, setProducts] = useState<ProductFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products?limit=12');
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError('Không tải được sản phẩm 😢');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: ProductFromAPI) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.title,
        price: Math.round(product.price * (1 - (product.discountPercentage || 0) / 100) * 24500), // Ước lượng VND
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center my-10 text-gray-800">
        Sản phẩm nổi bật
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const discountedPrice = product.discountPercentage
            ? product.price * (1 - product.discountPercentage / 100)
            : product.price;

          const priceVND = Math.round(discountedPrice * 24500); // ~1 USD = 24.500 VNĐ
          const originalPriceVND = Math.round(product.price * 24500);

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.discountPercentage && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2 h-14">
                  {product.title}
                </h3>

                <div className="mt-3">
                  <p className="text-2xl font-bold text-blue-600">
                    {priceVND.toLocaleString('vi-VN')}₫
                  </p>
                  {product.discountPercentage && (
                    <p className="text-sm text-gray-500 line-through">
                      {originalPriceVND.toLocaleString('vi-VN')}₫
                    </p>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition active:scale-95"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;