import { FiKey, FiLogOut } from "react-icons/fi";

const MobileAuthButton = ({ isAuthenticated, handleLogout, navigate, setIsOpen }) => {
  return isAuthenticated ? (
    <button onClick={handleLogout} className="px-3 lg:px-6 py-1.5 md:py-2 lg:py-3 bg-linear-to-br from-amber-600 
      to-amber-700 text-[#2D1B0E] rounded-2xl font-bold hover:shadow-lg flex items-center space-x-2 text-sm"
    >
      <FiLogOut />
      <span>Logout</span>
    </button>
  ) : (
    <button onClick={() => { 
        navigate('/login'); 
        setIsOpen(false);
      }} className="px-3 lg:px-6 py-1.5 md:py-2 lg:py-3 bg-linear-to-br from-amber-600 to-amber-700 
        text-[#2D1B0E] rounded-2xl font-bold hover:shadow-lg flex items-center space-x-2 text-sm"
    >
      <FiKey />
      <span>Login</span>
    </button>
  )
}

export default MobileAuthButton;