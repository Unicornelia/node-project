import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <header className="main-header">
      <nav className="main-header__nav">
        <ul className="main-header__item-list">
          <li className="main-header__item">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Shop
            </NavLink>
          </li>
          <li className="main-header__item">
            <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
              Products
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li className="main-header__item">
                <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Cart
                </NavLink>
              </li>
              <li className="main-header__item">
                <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Orders
                </NavLink>
              </li>
              <li className="main-header__item">
                <NavLink to="/admin/add-product" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Add Product
                </NavLink>
              </li>
              <li className="main-header__item">
                <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Admin Products
                </NavLink>
              </li>
            </>
          )}
        </ul>
        <ul className="main-header__item-list">
          {!isAuthenticated ? (
            <>
              <li className="main-header__item">
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Login
                </NavLink>
              </li>
              <li className="main-header__item">
                <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Sign Up
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="main-header__item">
                <form action="/logout" method="POST">
                  <button type="submit">Logout</button>
                </form>
              </li>
            </>
          )
          }
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
