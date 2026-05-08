import { FiKey, FiLogOut } from "react-icons/fi";

const DesktopAuthButton = ({ isAuthenticated, handleLogout, navigate }) => {
  return isAuthenticated ? (
    <button onClick={handleLogout} className="px-3 lg:px-4 py-1.5 md:py-2 lg:py-3 bg-linear-to-br from-amber-600 to-amber-700 text-[#2D1B0E] 
      rounded-2xl font-bold hover:shadow-lg hover:shadow-amber-600/40 transition-all transform hover:scale-[1.02] border-2 border-amber-600/20 
      flex items-center space-x-2 shadow-md shadow-amber-900/20 text-xs md:text-sm"
    >
      <FiLogOut className="text-base md:text-lg" />
      <span className="text-shadow">Logout</span>
    </button>
  ) : (
    <button onClick={() => navigate('/login')} className="px-3 lg:px-4 py-1.5 md:py-2 lg:py-3 bg-linear-to-br from-amber-600 to-amber-700 text-[#2D1B0E] 
      rounded-2xl font-bold hover:shadow-lg hover:shadow-amber-600/40 transition-all transform hover:scale-[1.02] border-2 border-amber-600/20 
      flex items-center space-x-2 shadow-md shadow-amber-900/20 text-sm"
    >
      <FiKey className="text-base md:text-lg" />
      <span className="text-shadow">Login</span>
    </button>
  )
}

export default DesktopAuthButton;