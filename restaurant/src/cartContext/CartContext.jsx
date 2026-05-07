//     import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

//     const CartContext = createContext();

//     // REDUCER HANDLING CART ACTIONS LIKE ADD, REMOVE, UPDATE QUANTITY AND ITEMS
//     const cartReducer = (state, action) => {
//         switch (action.type) {
//             case 'ADD_ITEM': {
//                 const {item, quantity} = action.payload;
//                 const existingItem = state.find(presentItems => presentItems.id === item.id);
//                 if (existingItem) {
//                     return state.map(presentItems => presentItems.id === item.id ? {...presentItems, quantity: presentItems.quantity + quantity,}:  presentItems)
//                 }
//                 return [...state, {...item, quantity}];
//             }
//             case 'REMOVE_ITEM': {
//                 return state.filter(presentItems => presentItems.id !== action.payload.itemId);
//             }
//             case 'UPDATE QUANTITY': {
//                 const {itemId, newQuantity} = action.payload;
//                 return state.map(presentItems => presentItems.id === itemId ? {...presentItems, quantity: Math.max(1,  newQuantity)} : presentItems )
//             }
//             default: return state;
//         }
//     }

//     // INITIALIZE CART FROM LOCAL STORAGE
//     const initializer = () => {
//         if (typeof window !== 'undefined') {
//             const localCart = localStorage.getItem('cart');
//             return localCart ? JSON.parse(localCart) : [];
//         }
//         return [];
//     }

//     export const CartProvider = ({ children }) => {
//         const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
//         // PERSIST CART STATE TO LOCAL STORAGE
//         useEffect(() => {
//             localStorage.setItem('cart', JSON.stringify(cartItems));
//         }, [cartItems])

//         // CALCULATE TOTAL COST AND TOTAL ITEM COUNT
//         // const carTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//         const carTotal = cartItems.reduce(
//   (total, item) => total + parseFloat(item.price.toString().replace('₹', '')) * item.quantity,
//   0
// );

//         const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//         // FORMAT TOTAL ITEMS IN POWER FORM
//         const formatTotalItems = (num) => {
//             if (num >= 1000) {
//                 return (num / 1000).toFixed(1) + 'k'
//             }
//             return num;
//         }

//         // DISPATCHER WRAPPED WITH useCALLBACK FOR PERFORMANCE
//         const addToCart = useCallback((item, quantity) => {
//             dispatch({type: 'ADD_ITEM', payload: {item, quantity}})
//         }, [])  
    
//         const removeFromCart = useCallback((itemId) => {
//             dispatch({type: 'REMOVE_ITEM', payload: {itemId}})
//         }, [])

//         const updateQuantity = useCallback((itemId, newQuantity) => {
//             dispatch({type: 'UPDATE_QUANTITY', payload: {itemId, newQuantity}})
//         }, [])  

//         return (
//             <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, carTotal, totalItems: formatTotalItems(totalItemsCount)}}>
//                 {children}
//             </CartContext.Provider>
//         )
//     }

//     export const useCart = () => useContext(CartContext);


































































// THIS IS THE LAST CORRECT CODE
// THIS IS THE LAST CORRECT CODE
// THIS IS THE LAST CORRECT CODE
// THIS IS THE LAST CORRECT CODE
// THIS IS THE LAST CORRECT CODE

// import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

// const CartContext = createContext();

// // ------------------ REDUCER ------------------
// const cartReducer = (state, action) => {
//   switch (action.type) {

//     case 'ADD_ITEM': {
//       const { item, quantity } = action.payload;
//       const existingItem = state.find(cartItem => cartItem.id === item.id);

//       // ✅ Increment quantity if item exists
//       if (existingItem) {
//         return state.map(cartItem =>
//           cartItem.id === item.id
//             ? { ...cartItem, quantity: quantity }
//             : cartItem
//         );
//       }

//       // ✅ Add new item
//       return [...state, { ...item, quantity }];
//     }

//     case 'REMOVE_ITEM': {
//       return state.filter(cartItem => cartItem.id !== action.payload.itemId);
//     }

//     case 'UPDATE_QUANTITY': {
//       const { itemId, newQuantity } = action.payload;
//       return state.map(cartItem =>
//         cartItem.id === itemId
//           ? { ...cartItem, quantity: Math.max(1, newQuantity) }
//           : cartItem
//       );
//     }

//     default:
//       return state;
//   }
// };

// // ------------------ INITIALIZE FROM LOCAL STORAGE ------------------
// const initializer = () => {
//   if (typeof window !== 'undefined') {
//     const localCart = localStorage.getItem('cart');
//     return localCart ? JSON.parse(localCart) : [];
//   }
//   return [];
// };

// // ------------------ PROVIDER ------------------
// export const CartProvider = ({ children }) => {
//   const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
// console.log("Cart Items:", cartItems);

//   // Persist cart state
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Calculate totals
//   const cartTotal = cartItems.reduce(
//     (total, item) => total + parseFloat(item.price.toString().replace('₹', '')) * item.quantity,
//     0
//   );

//   const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   const formatTotalItems = (num) => (num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num);

//   // ------------------ ACTIONS ------------------
//   const addToCart = useCallback((item, quantity = 1) => {
//     dispatch({ type: 'ADD_ITEM', payload: { item, quantity } });
//   }, []);

//   const removeFromCart = useCallback((itemId) => {
//     dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
//   }, []);

//   const updateQuantity = useCallback((itemId, newQuantity) => {
//     dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, newQuantity } });
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         cartTotal,
//         totalItems: formatTotalItems(totalItemsCount),
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);



































































































import { createContext } from "react";

// Only export the context
export const CartContext = createContext();





































































































































// import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case "ADD_ITEM": {
//       const { item, quantity } = action.payload;
//       const existingItem = state.find(cartItem => cartItem.id === item.id);

//       if (existingItem) {
//         // Increment quantity properly
//         return state.map(cartItem =>
//           cartItem.id === item.id
//             ? { ...cartItem, quantity: cartItem.quantity + quantity }
//             : cartItem
//         );
//       }
//       return [...state, { ...item, quantity }];
//     }

//     case "REMOVE_ITEM":
//       return state.filter(cartItem => cartItem.id !== action.payload.itemId);

//     case "UPDATE_QUANTITY": {
//       const { itemId, newQuantity } = action.payload;
//       return state.map(cartItem =>
//         cartItem.id === itemId
//           ? { ...cartItem, quantity: Math.max(1, newQuantity) }
//           : cartItem
//       );
//     }

//     default:
//       return state;
//   }
// };

// const initializer = () => {
//   if (typeof window !== "undefined") {
//     const localCart = localStorage.getItem("cart");
//     return localCart ? JSON.parse(localCart) : [];
//   }
//   return [];
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const carTotal = cartItems.reduce(
//     (total, item) =>
//       total + parseFloat(item.price.toString().replace("₹", "")) * item.quantity,
//     0
//   );

//   const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   const formatTotalItems = num => (num >= 1000 ? (num / 1000).toFixed(1) + "k" : num);

//   const addToCart = useCallback((item, quantity = 1) => {
//     dispatch({ type: "ADD_ITEM", payload: { item, quantity } });
//   }, []);

//   const removeFromCart = useCallback(itemId => {
//     dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
//   }, []);

//   const updateQuantity = useCallback((itemId, newQuantity) => {
//     dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, newQuantity } });
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         carTotal,
//         totalItems: formatTotalItems(totalItemsCount),
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
















































// import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

// const CartContext = createContext();

// /* ------------------ REDUCER ------------------ */
// const cartReducer = (state, action) => {
//   switch (action.type) {

//     case 'ADD_ITEM': {
//       const { item, quantity } = action.payload;
//       const existingItem = state.find(cartItem => cartItem.id === item.id);

//       // ✅ INCREMENT quantity if item exists
//       if (existingItem) {
//         return state.map(cartItem =>
//           cartItem.id === item.id
//             ? { ...cartItem, quantity: cartItem.quantity + quantity }
//             : cartItem
//         );
//       }

//       // ✅ Add new item
//       return [...state, { ...item, quantity }];
//     }

//     case 'REMOVE_ITEM': {
//       return state.filter(cartItem => cartItem.id !== action.payload.itemId);
//     }

//     case 'UPDATE_QUANTITY': {
//       const { itemId, newQuantity } = action.payload;
//       return state.map(cartItem =>
//         cartItem.id === itemId
//           ? { ...cartItem, quantity: Math.max(1, newQuantity) }
//           : cartItem
//       );
//     }

//     default:
//       return state;
//   }
// };

// /* ------------------ LOCAL STORAGE INIT ------------------ */
// const initializer = () => {
//   if (typeof window !== 'undefined') {
//     const storedCart = localStorage.getItem('cart');
//     return storedCart ? JSON.parse(storedCart) : [];
//   }
//   return [];
// };

// /* ------------------ PROVIDER ------------------ */
// export const CartProvider = ({ children }) => {
//   const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

//   // ✅ Persist cart
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   // ✅ Totals
//   const cartTotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   const totalItemsCount = cartItems.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );

//   const formatTotalItems = (num) => (
//     num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num
//   );

//   /* ------------------ ACTIONS ------------------ */
//   const addToCart = useCallback((item, quantity = 1) => {
//     dispatch({ type: 'ADD_ITEM', payload: { item, quantity } });
//   }, []);

//   const removeFromCart = useCallback((itemId) => {
//     dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
//   }, []);

//   const updateQuantity = useCallback((itemId, newQuantity) => {
//     dispatch({
//       type: 'UPDATE_QUANTITY',
//       payload: { itemId, newQuantity },
//     });
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         cartTotal,
//         totalItems: formatTotalItems(totalItemsCount),
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
