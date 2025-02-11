import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import logo from "../../public/Images/Logo_Inventory_Mangement.png";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 p-2 ${
        scrolling ? "backdrop-blur-md bg-white/30 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <img
          src="/Images/Logo_Inventory_Mangement.png"
          className="h-14"
          alt="Logo"
        />
        <ul className="flex space-x-6 text-gray-900">
          <li className="cursor-pointer hover:text-gray-600">
            <Link to="/">Home</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-600">
            <Link to="/billing">Billing</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-600">
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-600">
            <Link to="/addProduct">Add Product</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
