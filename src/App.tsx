// src/App.tsx
import { useRoutes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/HomePage/Navigation/Navigation';
import { routes } from './Routes/route';

function App() {
  const routing = useRoutes(routes);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navigation />}
      {routing}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;
