import Login from "../login/Login";

const LoginModal = ({ showLoginModal, handleLoginSuccess, navigate }) => {
  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-br from-[#2D1B0E] to=[#4a372a] rounded-xl p-6 w-full 
        max-w-120 relative border-4 border-amber-700/30 shadow-[0_0_30px] shadow-amber-500/30"
      >
        <button onClick={() => navigate('/')} className="absolute top-2 right-6 text-white hover:text-amber-300 text-2xl cursor-pointer lg:text-3xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text
          text-transparent mb-4 text-center"
        >
          Foodie-Frenzy
        </h2>
        <Login onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
      </div>
    </div>
  )
}

export default LoginModal;