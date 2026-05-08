import { FiHome, FiBook, FiStar, FiPhone, FiPackage } from "react-icons/fi";

export const navLinks = (isAuthenticated) => [
  { lname: 'Home', to: '/', icon: <FiHome />},
  { lname: 'Menu', to: '/menu', icon: <FiBook />},
  { lname: 'About', to: '/about', icon: <FiStar />},
  { lname: 'Contact', to: '/contact', icon: <FiPhone />},
  ...(isAuthenticated ? [
    {lname: 'My Orders', to: '/myorder', icon: <FiPackage />}
  ]: [])
];