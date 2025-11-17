import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, dispatch, totalPrice } = useCart();

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500">Giỏ hàng trống!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-blue-600 font-medium">
                {item.price.toLocaleString('vi-VN')}₫
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
              >
                <MinusIcon className="h-5 w-5" />
              </button>

              <span className="w-12 text-center font-medium">{item.quantity}</span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= 99}
                className="p-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
              >
                <PlusIcon className="h-5 w-5" />
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <p className="text-2xl font-bold">
          Tổng tiền: <span className="text-blue-600">{totalPrice.toLocaleString('vi-VN')}₫</span>
        </p>
      </div>
    </div>
  );
};

export default Cart;