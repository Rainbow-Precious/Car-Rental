// src/App.tsx
import { useRoutes } from "react-router-dom";
import { routes } from "../src/Routes/route"; // adjust path if necessary
import { Toaster } from '../src/utils/toast';
import DevResetHelper from "./components/HomePage/Login/DevResetHelper";

export default function App() {
  // useRoutes will look at your routes array and render the matching element
  const element = useRoutes(routes);
  return (
    <>
      {element}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
        }}
        toastOptions={{
          // Default options for all toasts
          duration: 5000,
          style: {
            background: '#1F2937',
            color: '#FFFFFF',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            fontSize: '16px',
          },
        }}
      />
      <DevResetHelper />
    </>
  );
}
