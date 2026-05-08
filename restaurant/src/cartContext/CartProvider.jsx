import { useCallback, useEffect, useReducer } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";

// ------------------ REDUCER ------------------
const cartReducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE_CART":
      return action.payload;

    case "ADD_ITEM": {
      const { _id, item, quantity } = action.payload;
      const exists = state.find((cartItem) => cartItem._id === _id);

      // ✅ Increment quantity if item exists
      if (exists) {
        return state.map((cartItem) =>
          cartItem._id === _id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
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
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

// ------------------ PROVIDER ------------------
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
  console.log("Cart Items:", cartItems);

  // Persist cart state
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

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
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://foodie-fenzy-delivery-backend-git-main-sifons-projects.vercel.app/api/cart", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => dispatch({ type: "HYDRATE_CART", payload: res.data }))
        .catch((err) => {
          if (err.response?.status === 403) {
            console.log("Token expired. Logging out...");
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          } else {
            console.error(err);
          }
        });
    }
  }, []);

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
  const token = localStorage.getItem("authToken");
  try {
    const res = await axios.post(
      "http://foodie-fenzy-delivery-backend-git-main-sifons-projects.vercel.app/api/cart",
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
    console.error("Add to cart failed:", err.response?.data || err.message);
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
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`http://foodie-fenzy-delivery-backend-git-main-sifons-projects.vercel.app/api/cart/${_id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "REMOVE_ITEM", payload: _id });
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Token expired. Logging out...");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
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
    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.put(
        `http://foodie-fenzy-delivery-backend-git-main-sifons-projects.vercel.app/api/cart/${_id}`,
        { quantity: qty },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "UPDATE_QUANTITY", payload: res.data });
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Token expired. Logging out...");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      } else {
        console.error("Update failed:", err.response?.data || err.message);
      }
    }
  }, []);








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
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `http://foodie-fenzy-delivery-backend-git-main-sifons-projects.vercel.app/api/cart/clear`,
        {},
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Token expired. Logging out...");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
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
