import { NavLink } from "react-router-dom";
import MobileAuthButton from "./MobileAuthButton";
import { FiShoppingCart } from "react-icons/fi";

const MobileMenu = ({ isOpen, setIsOpen, navLinks, totalItems, isAuthenticated, handleLogout, navigate }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-[#2D1B0E] border-t-4 border-amber-900/40 relative shadow-lg 
      shadow-amber-900/30 w-full">
      <div className="px-4 py-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink key={link.lname} to={link.to} onClick={() => setIsOpen(false)} className={({isActive}) => 
            `block px-4 py-3 text-sm rounded-xl transition-all items-center 
            ${isActive ? 'bg-amber-600/30 text-amber-400' : 'text-amber-100 hover:bg-amber-600/20'}
              border-2 ${isActive ? 'border-amber-600/50' : 'border-amber-900/30'}` }
          >
            <span className="mr-3 text-amber-500">{link.icon}</span>
            {link.lname}
          </NavLink>
        ))}

        <div className="pt-4 border-t-2 border-amber-900/30 space-y-2">
          <NavLink to='/cart' onClick={() => setIsOpen(false)} className="w-full px-4 py-3 text-amber-100
            rounded-xl border-2 border-amber-900/30 hover:border-amber-600/50 flex items-center 
            justify-center space-x-2 text-sm"
          >
            <FiShoppingCart className="text-lg" />
            {totalItems > 0 && (
              <span className="top-2 right-2 bg-amber-600 text-amber-100 text-xs
                w-5 h-5 rounded-full flex items-center justify-center"
              >
                {totalItems}
              </span>
            )}
          </NavLink>
          <MobileAuthButton 
            isAuthenticated={isAuthenticated} 
            handleLogout={handleLogout} 
            navigate={navigate} 
            setIsOpen={setIsOpen} 
          />
        </div>
      </div>
    </div>
  )
}

export default MobileMenu;