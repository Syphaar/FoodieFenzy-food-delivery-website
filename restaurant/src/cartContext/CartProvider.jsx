import { useCallback, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";

const API_URL = "https://foodie-fenzy-delivery-backend.vercel.app";

const getAuthToken = () => localStorage.getItem("authToken");

const getTokenUserId = (token = getAuthToken()) => {
  if (!token) return "guest";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.email || "guest";
  } catch {
    return "guest";
  }
};

const getCartStorageKey = () => `cart:${getTokenUserId()}`;

const clearAuthSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  localStorage.removeItem("loginData");
};

const isAuthError = err => err.response?.status === 401 || err.response?.status === 403;

const redirectToLogin = () => {
  clearAuthSession();
  window.dispatchEvent(new Event("auth-changed"));
  window.location.href = "/login";
};

// ------------------ REDUCER ------------------
const cartReducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE_CART":
      return action.payload;

    case "ADD_ITEM": {
      const { _id, item, quantity } = action.payload;
      const exists = state.find((cartItem) => cartItem._id === _id || cartItem.item?._id === item?._id);

      // ✅ Increment quantity if item exists
      if (exists) {
        return state.map((cartItem) =>
          cartItem._id === exists._id
            ? { _id, item, quantity }
            : cartItem,
        );
      }

      // ✅ Add new item
      return [...state, { _id, item, quantity }];
    }

    case "REMOVE_ITEM": {
      return state.filter((cartItem) => cartItem._id !== action.payload);
    }

    case "UPDATE_QUANTITY": {
      const { _id, quantity } = action.payload;
      return state.map((cartItem) =>
        cartItem._id === _id ? { ...cartItem, quantity } : cartItem,
      );
    }
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

// ------------------ INITIALIZE FROM LOCAL STORAGE ------------------
const initializer = () => {
  try {
    return JSON.parse(localStorage.getItem(getCartStorageKey()) || "[]");
  } catch {
    return [];
  }
};

// ------------------ PROVIDER ------------------
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
  const [cartStorageKey, setCartStorageKey] = useState(getCartStorageKey);
  console.log("Cart Items:", cartItems);

  useEffect(() => {
    const handleAuthChange = () => {
      const nextCartStorageKey = getCartStorageKey();
      setCartStorageKey(nextCartStorageKey);
      try {
        dispatch({
          type: "HYDRATE_CART",
          payload: JSON.parse(localStorage.getItem(nextCartStorageKey) || "[]")
        });
      } catch {
        dispatch({ type: "HYDRATE_CART", payload: [] });
      }
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  // Persist cart state
  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems, cartStorageKey]);

  // HYDRATE FROM SERVER API
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     axios
  //       .get("http://localhost:4000/api/cart", {
  //         withCredentials: true,
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((res) => dispatch({ type: "HYDRATE_CART", payload: res.data }))
  //       .catch((err) => {
  //         if (err.response?.status != 401) console.error(err);
  //       });
  //   }
  // }, []);


  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios
        .get(`${API_URL}/api/cart`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => dispatch({ type: "HYDRATE_CART", payload: res.data }))
        .catch((err) => {
          if (isAuthError(err)) {
            console.log("Token expired. Logging out...");
            redirectToLogin();
          } else {
            console.error(err);
          }
        });
    }
  }, [cartStorageKey]);

  // ------------------ ACTIONS ------------------
  // const addToCart = useCallback(async (item, qty) => {
  //   if (!item._id) {
  //     return console.error("Missing _id:", item);
  //   }

  //   const token = localStorage.getItem("authToken");
  //   try {
  //     await axios.post(
  //       "http://localhost:4000/api/cart",
  //       { itemId: item._id, quantity: Number(qty) },
  //       {
  //         withCredentials: true,
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );

  //     dispatch({
  //       type: "ADD_ITEM",
  //       payload: { _id: item._id, item, quantity: Number(qty) },
  //     });
  //   } catch (err) {
  //     console.error("Add to cart failed:", err.response?.data || err.message);
  //   }
  // }, []);



  // const addToCart = useCallback(async (item, qty) => {
  //   if (!item._id) return console.error("Missing _id:", item);
  //   const token = localStorage.getItem("authToken");

  //   try {
  //     await axios.post(
  //       "http://localhost:4000/api/cart",
  //       { itemId: item._id, quantity: Number(qty) },
  //       { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     dispatch({ type: "ADD_ITEM", payload: { _id: item._id, item, quantity: Number(qty) } });
  //   } catch (err) {
  //     if (err.response?.status === 403) {
  //       console.log("Token expired. Logging out...");
  //       localStorage.removeItem("authToken");
  //       window.location.href = "/login";
  //     } else {
  //       console.error("Add to cart failed:", err.response?.data || err.message);
  //     }
  //   }
  // }, []);





  const addToCart = useCallback(async (item, qty) => {
  const token = getAuthToken();
  try {
    const res = await axios.post(
      `${API_URL}/api/cart`,
      { itemId: item._id, quantity: Number(qty) },
      { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
    );

    const cartEntry = res.data; // <-- backend returns cart entry _id
    dispatch({
      type: "ADD_ITEM",
      payload: {
        _id: cartEntry._id, // cart entry ID!
        item: cartEntry.item,
        quantity: cartEntry.quantity
      }
    });
  } catch (err) {
    if (isAuthError(err)) {
      redirectToLogin();
    } else {
      console.error("Add to cart failed:", err.response?.data || err.message);
    }
  }
}, []);









// //
  // const addToCart = useCallback(async (item, qty) => {
  //   const token = localStorage.getItem('authToken')
  //   const res = await axios.post(
  //     'http://foodie-fenzy-delivery-backend-git-main-sifons-projects.vercel.app/api/cart',
  //     // { itemId: item._id, quantity: qty },
  //     { itemId: item._id, quantity: Number(qty) },
  //     {
  //       withCredentials: true,
  //       headers: { Authorization: `Bearer ${token}`}
  //     }
  //   )
  //   dispatch({ type: 'ADD_ITEM', payload: res.data });
  // }, []);

  // const addToCart = useCallback(async (item, qty) => {
  //   if (!item?.id) return console.error("Item object missing _id:", item);

  //   try {
  //     const res = await axios.post(
  //       'http://foodie-fenzy-delivery-backend-git-main-sifons-projects.vercel.app/api/cart',
  //       { itemId: item._id, quantity: qty }, // send real MongoDB ObjectId
  //       { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
  //     );

  //     dispatch({ type: 'ADD_ITEM', payload: { _id: item._id, item, quantity: qty } });
  //   } catch (err) {
  //     console.error('Add to cart failed:', err.response?.data || err.message);
  //   }
  // }, []);

  // REMOVE FROM CART
  // const removeFromCart = useCallback(async (_id) => {
  //   const token = localStorage.getItem("authToken");
  //   await axios.delete(`http://localhost:4000/api/cart/${_id}`, {
  //     withCredentials: true,
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   dispatch({ type: "REMOVE_ITEM", payload: _id });
  // }, []);
  

  const removeFromCart = useCallback(async (_id) => {
    const token = getAuthToken();
    try {
      await axios.delete(`${API_URL}/api/cart/${_id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "REMOVE_ITEM", payload: _id });
    } catch (err) {
      if (isAuthError(err)) {
        console.log("Token expired. Logging out...");
        redirectToLogin();
      } else {
        console.error("Remove failed:", err.response?.data || err.message);
      }
    }
  }, []);













  // UPDATE QUANTITY
  // const updateQuantity = useCallback(async (_id, qty) => {
  //   const token = localStorage.getItem("authToken");
  //   const res = await axios.put(
  //     `http://localhost:4000/api/cart/${_id}`,
  //     { quantity: qty },
  //     {
  //       withCredentials: true,
  //       headers: { Authorization: `Bearer ${token}` },
  //     },
  //   );
  //   dispatch({ type: "UPDATE_QUANTITY", payload: res.data });
  // }, []);



  const updateQuantity = useCallback(async (_id, qty) => {
    if (qty < 1) {
      await removeFromCart(_id);
      return;
    }

    const token = getAuthToken();
    try {
      const res = await axios.put(
        `${API_URL}/api/cart/${_id}`,
        { quantity: qty },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "UPDATE_QUANTITY", payload: res.data });
    } catch (err) {
      if (isAuthError(err)) {
        console.log("Token expired. Logging out...");
        redirectToLogin();
      } else {
        console.error("Update failed:", err.response?.data || err.message);
      }
    }
  }, [removeFromCart]);








  // to clear cart
  // const clearCart = useCallback(async () => {
  //   const token = localStorage.getItem("authToken");
  //   await axios.put(
  //     `http://localhost:4000/api/cart/clear`,
  //     {},
  //     {
  //       withCredentials: true,
  //       headers: { Authorization: `Bearer ${token}` },
  //     },
  //   );
  //   dispatch({ type: "CLEAR_CART" });
  // }, [dispatch]);


  const clearCart = useCallback(async () => {
    const token = getAuthToken();
    try {
      await axios.put(
        `${API_URL}/api/cart/clear`,
        {},
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      if (isAuthError(err)) {
        console.log("Token expired. Logging out...");
        redirectToLogin();
      } else {
        console.error("Clear cart failed:", err.response?.data || err.message);
      }
    }
  }, [dispatch]);










  const totalItems = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0,
  );
  const totalAmount = cartItems.reduce((sum, cartItem) => {
    const price = cartItem?.item?.price ?? 0;
    const qty = cartItem?.quantity ?? 0;
    return sum + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
