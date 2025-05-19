// src/App.tsx
import { useRoutes } from "react-router-dom";
import { routes } from "../src/Routes/route"; // adjust path if necessary

export default function App() {
  // useRoutes will look at your routes array and render the matching element
  const element = useRoutes(routes);
  return element;
}
