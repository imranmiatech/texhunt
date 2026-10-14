import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setUserMenuOpen(false);
    setVisible(false);
    navigate("/login");
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  const handleUserClick = () => {
    if (!token) {
      navigate("/login");
    } else {
      setUserMenuOpen((prev) => !prev);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 transition ${
      isActive ? "text-black font-bold" : "text-gray-600 hover:text-black font-semibold"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between py-3.5 px-6 text-sm font-semibold tracking-wider transition ${
      isActive
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-black"
    }`;

  return (
    <>
      {/* Sticky Header with Edge-to-Edge Backdrop */}
      <header className="sticky top-0 z-40 bg-[#fafafa]/95 backdrop-blur-md border-b border-gray-100 -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] transition-all">
        <div className="flex items-center justify-between py-3.5 sm:py-4 max-w-7xl mx-auto">
          {/* Brand Logo */}
          <Link to="/" className="flex items-baseline gap-1 group">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest text-black group-hover:text-gray-700 transition">
              TEXHUNT
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden sm:flex items-center gap-6 md:gap-8 text-xs font-semibold tracking-wider uppercase">
            <NavLink to="/" className={navLinkClass}>
              HOME
              <hr className="w-2/4 border-none h-[2px] bg-black hidden" />
            </NavLink>
            <NavLink to="/collection" className={navLinkClass}>
              COLLECTION
              <hr className="w-2/4 border-none h-[2px] bg-black hidden" />
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              ABOUT
              <hr className="w-2/4 border-none h-[2px] bg-black hidden" />
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              CONTACT
              <hr className="w-2/4 border-none h-[2px] bg-black hidden" />
            </NavLink>
          </ul>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              aria-label="Search clothing"
              className="p-2 rounded-full hover:bg-gray-100 transition active:scale-95"
            >
              <img
                src={assets.search_icon}
                alt="Search"
                className="w-4 sm:w-5 opacity-80 hover:opacity-100"
              />
            </button>

            {/* User Account / Dropdown (Touch & Click Friendly) */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserClick}
                aria-label="User Account"
                className="p-2 rounded-full hover:bg-gray-100 transition active:scale-95 flex items-center"
              >
                <img
                  className="w-5 sm:w-6 opacity-80 hover:opacity-100"
                  src={assets.user}
                  alt="Account"
                />
              </button>

              {/* Dropdown Menu (Opens on Click for Mobile, Hover for Desktop) */}
              {token && (
                <div
                  className={`absolute right-0 pt-2 z-50 transition-all ${
                    userMenuOpen ? "block" : "hidden sm:group-hover:block"
                  }`}
                >
                  <div className="flex flex-col gap-1 w-44 py-2 px-3 bg-white text-gray-700 rounded-xl shadow-2xl border border-gray-100 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/orders");
                      }}
                      className="text-left w-full cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-2 font-medium transition"
                    >
                      My Orders
                    </button>
                    <hr className="border-gray-100 my-1" />
                    <button
                      onClick={logout}
                      className="text-left w-full cursor-pointer text-red-600 hover:bg-red-50 rounded-lg px-2 py-2 font-medium transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <NavLink
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition active:scale-95"
            >
              <img
                src={assets.cart_icons}
                alt="Cart"
                className="w-5 min-w-5 opacity-85 hover:opacity-100"
              />
              <span className="absolute right-0.5 top-0.5 w-4 h-4 text-center leading-4 bg-black text-white rounded-full text-[10px] font-bold shadow-sm">
                {getCartCount()}
              </span>
            </NavLink>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setVisible(true)}
              aria-label="Open Navigation Menu"
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition active:scale-95"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 sm:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar / Drawer (Slide from Right) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[82vw] bg-white transition-transform duration-300 ease-out shadow-2xl flex flex-col justify-between sm:hidden ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link
              to="/"
              onClick={() => setVisible(false)}
              className="flex items-baseline gap-1"
            >
              <span className="text-xl font-extrabold tracking-widest text-black">
                TEXHUNT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>
            </Link>

            <button
              onClick={() => setVisible(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition"
              aria-label="Close Menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col py-3">
            <NavLink
              onClick={() => setVisible(false)}
              to="/"
              className={mobileNavLinkClass}
            >
              <span>HOME</span>
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </NavLink>

            <NavLink
              onClick={() => setVisible(false)}
              to="/collection"
              className={mobileNavLinkClass}
            >
              <span>COLLECTION</span>
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </NavLink>

            <NavLink
              onClick={() => setVisible(false)}
              to="/about"
              className={mobileNavLinkClass}
            >
              <span>ABOUT</span>
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </NavLink>

            <NavLink
              onClick={() => setVisible(false)}
              to="/contact"
              className={mobileNavLinkClass}
            >
              <span>CONTACT</span>
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </NavLink>
          </nav>
        </div>

        {/* Drawer Bottom Account Section */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          {token ? (
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setVisible(false);
                  navigate("/orders");
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 shadow-xs hover:bg-gray-100 transition"
              >
                <span>📦 My Orders</span>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
              >
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setVisible(false);
                navigate("/login");
              }}
              className="w-full py-3 px-4 bg-black text-white text-sm font-semibold rounded-lg tracking-wider uppercase shadow-md active:scale-95 transition"
            >
              Sign In / Register
            </button>
          )}

          <p className="text-[11px] text-gray-400 text-center mt-4">
            TexHunt Luxury Apparel © {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
