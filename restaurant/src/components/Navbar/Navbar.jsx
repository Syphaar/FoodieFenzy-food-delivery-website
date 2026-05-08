import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../cartContext/useCart";
import DesktopAuthButton from "./DesktopAuthButton";
import MobileAuthButton from "./MobileAuthButton";
import { navLinks as generateNavLinks } from "./NavLinks";
import TopDecorativeLine from "./TopDecorativeLine";
import LogoSection from "./LogoSection";
import MobileMenu from "./MobileMenu";
import LoginModal from "./LoginModal";
import { FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('authToken')));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginModal(location.pathname === '/login');
      setIsAuthenticated(Boolean(localStorage.getItem('authToken')));
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLoginSuccess = (token, user) => {
    if (token) localStorage.setItem('authToken', token);
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('loginData', JSON.stringify({ loggedIn: true, user }));
    }
    setIsAuthenticated(true);
    setShowLoginModal(false);
    navigate('/');
  }

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('auth-changed'));
    setIsAuthenticated(false);
    navigate('/');
  }

  const navLinks = generateNavLinks(isAuthenticated);

  return (
    <nav className=" bg-[#2D1B0E] border-b-8 border-amber-900/30 shadow-[0_25px_50px_-12px] shadow-amber-900/30
      sticky top-0 font-vibes group/nav overflow-x-hidden z-50"
    >
      <TopDecorativeLine />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
          <LogoSection />

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-1 lg:space-x-4 flex-1 justify-end">
            {navLinks.map((link) => (
              <NavLink key={link.lname} to={link.to} className={({isActive}) => 
                `group px-3 md:px-3 lg:px-4 py-2 md:py-2 lg:py-3 text-sm md:text-[15px] lg:text-base 
                relative transition-all duration-300 flex items-center hover:bg-amber-900/20 rounded-3xl 
                border-2
                ${
                  isActive ? 'border-amber-600/50 bg-amber-900/20 shadow-[inset-0_0_15px] shadow-amber-50/20' 
                  : 'border-amber-900/30 hover:border-amber-600/50'
                } shadow-md shadow-amber-900/20` }
              >
                <span className="mr-2 text-sm md:text-[15px] lg:text-base text-amber-500 group-hover:text-amber-300 transition-all">
                  {link.icon}
                </span>
                <span className="text-amber-100 group-hover:text-amber-300 relative">
                  {link.lname}
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-amber-300 transition-all duration-400 group-hover:w-full" />
                </span>
              </NavLink>
            ))}

            <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 ml-3 md:ml-3 lg:ml-6
              mr-2 md:mr-3 lg:mr-4"
            >
              <NavLink to={'/cart'} className='p-2 lg:p-3 text-amber-100 rounded-xl transition-all relative 
                border-2 border-amber-900/30 hover:border-amber-600/50 group bg-amber-900/20 
                hover:shadow-lg hover:shadow-amber-500/30 shadow-md shadow-amber-900/20'
              >
                <FiShoppingCart className="text-base md:text-lg" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-amber-100 text-xs
                    w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </span>
                )}
              </NavLink>
              <DesktopAuthButton isAuthenticated={isAuthenticated} handleLogout={handleLogout} navigate={navigate}/>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center mr-2 md:hidden">
            <button className="text-amber-500 hover:text-amber-300 focus:outline-none transition-all 
              p-2 rounded-xl border-2 border-amber-900/30 hover:border-amber-600/50 relative shadow-md
              shadow-amber-900/20 hover:shadow-lg hover:shadow-amber-500/30" onClick={() => setIsOpen(!isOpen)}
            >
              <div className="space-y-2 relative">
                <span className={`block w-6 h-1 bg-current transition-all
                  ${isOpen ? 'rotate-45 translate-y-1.75' : ''}`} 
                />
                <span className={`block w-6 h-1 bg-current ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-1 bg-current transition-all
                  ${isOpen ? '-rotate-45 -translate-y-1.75' : ''}`} 
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <MobileMenu 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        navLinks={navLinks} 
        totalItems={totalItems} 
        isAuthenticated={isAuthenticated} 
        handleLogout={handleLogout} 
        navigate={navigate} 
      />

      {/* LOGIN MODAL */}
      <LoginModal 
        showLoginModal={showLoginModal} 
        handleLoginSuccess={handleLoginSuccess} 
        navigate={navigate} 
      />
    </nav>
  );
};

export default Navbar;
