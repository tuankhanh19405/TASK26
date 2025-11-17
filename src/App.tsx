import { useRoutes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

function App() {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/cart', element: <Cart /> },
  ]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          {routes}
        </main>
      </div>
    </CartProvider>
  );
}

export default App;