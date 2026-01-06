
/**
* main.tsx
* 
* Punto de entrada de la aplicación React.
* Renderiza el componente raíz <App /> en el DOM.
*/

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
