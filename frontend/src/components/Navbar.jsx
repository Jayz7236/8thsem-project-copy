import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Retrieve user from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for profile updates
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

      // Clear user data
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-b from-amber-100 to-orange-50 text-gray-800 py-6 px-6 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/home">
          <div className="text-2xl md:text-4xl font-bold text-amber-700">Alumni Connect</div>
        </Link>
  
        {/* Hamburger Toggle (visible on small screens) */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="focus:outline-none text-amber-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
  
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-xl font-medium items-center">
          <li><Link to="/alumni" className="text-gray-700 hover:text-amber-700">Alumni</Link></li>
          <li><Link to="/jobs" className="text-gray-700 hover:text-amber-700">Jobs</Link></li>
          <li><Link to="/forums" className="text-gray-700 hover:text-amber-700">Forums</Link></li>
          <li><Link to="/events" className="text-gray-700 hover:text-amber-700">Events</Link></li>
          <li><Link to="/gallery" className="text-gray-700 hover:text-amber-700">Gallery</Link></li>
          <li><Link to="/about" className="text-gray-700 hover:text-amber-700">About</Link></li>
  
          {user ? (
            <li className="relative group">
              <div className="text-gray-700 hover:text-amber-700 font-semibold cursor-pointer">
                {user?.name?.split(" ")[0] ?? "User"}
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white text-black shadow-md rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  Profile
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </li>
          ) : (
            <li 
              onClick={() => navigate("/login")} 
              className="cursor-pointer text-gray-700 hover:text-amber-700"
            >
              Login
            </li>
          )}
        </ul>
      </div>
  
      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden mt-4 px-4 space-y-3 text-base font-medium">
          <Link to="/alumni" className="block text-gray-700 hover:text-amber-700">Alumni</Link>
          <Link to="/jobs" className="block text-gray-700 hover:text-amber-700">Jobs</Link>
          <Link to="/forums" className="block text-gray-700 hover:text-amber-700">Forums</Link>
          <Link to="/events" className="block text-gray-700 hover:text-amber-700">Events</Link>
          <Link to="/gallery" className="block text-gray-700 hover:text-amber-700">Gallery</Link>
          <Link to="/about" className="block text-gray-700 hover:text-amber-700">About</Link>
  
          {user ? (
            <>
              <button 
                className="block w-full text-left text-gray-700 hover:text-amber-700"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                Profile
              </button>
              <button 
                className="block w-full text-left text-gray-700 hover:text-amber-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate("/login")} 
              className="block text-left text-gray-700 hover:text-amber-700"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
  
};

export default Navbar;
