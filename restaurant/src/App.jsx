// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import ContactPage from "./pages/contactPage/ContactPage"
import AboutPage from "./pages/AboutPage/AboutPage"
import Menu from "./pages/menu/Menu"
import Cart from "./pages/cart/Cart"
import SignUp from "./components/signUp/SignUp"
import PrivateRoute from "./components/privateRoute/PrivateRoute"
import VerifyPaymentPage from "./pages/verifyPaymentPage/VerifyPaymentPage"
import CheckoutPage from "./pages/checkoutPage/CheckoutPage"
import MyOrderPage from "./pages/myOrderPage/MyOrderPage"

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/contact" element={<ContactPage /> } />
        <Route path="/about" element={<AboutPage /> } />
        <Route path="/menu" element={<Menu /> } />

        <Route path="/login" element={<Home /> } />
        <Route path="/signup" element={<SignUp /> } />

        {/* PAYMENT VERIFICATION */}
        <Route path="/myorder/verify" element={<VerifyPaymentPage /> } />

        <Route path="/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
         } />
         

        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute> } />
        <Route path="/myorder" element={<PrivateRoute><MyOrderPage /></PrivateRoute> } />
      </Routes>
    </>
  )
}

export default App
