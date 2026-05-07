// // cartContext/useCart.js
import { useContext } from "react";


// export const useCart = () => useContext(CartContext);








// import { useContext } from "react";
import { CartContext } from "./CartContext";

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within a CartProvider");
//   return context;
// };




export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};



// src/cartContext/CartContext.js
// import { createContext } from "react";

// ✅ Export context only
// export const CartContext = createContext();