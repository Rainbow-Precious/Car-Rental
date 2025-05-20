// src/App.tsx
import { useRoutes } from "react-router-dom";
import { routes } from "../src/Routes/route"; // adjust path if necessary
import { Toaster } from 'react-hot-toast';

export default function App() {
  // useRoutes will look at your routes array and render the matching element
  const element = useRoutes(routes);
  return (
    <>
      {element}
      <Toaster 
        position="top-right"
        toastOptions={{
          // Default styles for different toast types
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
            duration: 5000, // Errors stay longer
          },
          // Default toast styling
          style: {
            border: '1px solid #18181b',
            padding: '16px',
            color: '#FFFFFF',
            background: '#27272A',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </>
  );
}
