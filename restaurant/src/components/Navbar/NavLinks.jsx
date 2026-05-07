// import { NavLink } from "react-router-dom";

// export const NavLinks = ({ navLinks, isMobile, setIsOpen }) => (
//   <>
//     {navLinks.map(link => (
//       <NavLink
//         key={link.lname}
//         to={link.to}
//         onClick={() => isMobile && setIsOpen(false)}
//         className={({isActive}) => 
//           `block px-4 py-3 text-sm rounded-xl transition-all items-center 
//           ${isActive ? 'bg-amber-600/30 text-amber-400' : 'text-amber-100 hover:bg-amber-600/20'}
//           border-2 ${isActive ? 'border-amber-600/50' : 'border-amber-900/30'}`
//         }
//       >
//         <span className="mr-3 text-amber-500">{link.icon}</span>
//         {link.lname}
//       </NavLink>
//     ))}
//   </>
// )



































// import { NavLink } from "react-router-dom";

// export const NavLinks = ({ navLinks }) => (
//   <>
//     {navLinks.map((link) => (
//       <NavLink
//         key={link.lname}
//         to={link.to}
//         className={({ isActive }) =>
//           `group px-3 md:px-3 lg:px-4 py-2 md:py-2 lg:py-3 text-sm md:text-[15px] lg:text-base 
//           relative transition-all duration-300 flex items-center hover:bg-amber-900/20 rounded-3xl 
//           border-2 ${
//             isActive
//               ? "border-amber-600/50 bg-amber-900/20 shadow-[inset-0_0_15px] shadow-amber-50/20"
//               : "border-amber-900/30 hover:border-amber-600/50"
//           } shadow-md shadow-amber-900/20`
//         }
//       >
//         <span className="mr-2 text-sm md:text-[15px] lg:text-base text-amber-500 group-hover:text-amber-300 transition-all">
//           {link.icon}
//         </span>
//         <span className="text-amber-100 group-hover:text-amber-300 relative">
//           {link.lname}
//           <span className="absolute -bottom-1 left-0 w-0 h-1 bg-amber-300 transition-all duration-400 group-hover:w-full" />
//         </span>
//       </NavLink>
//     ))}
//   </>
// );






























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