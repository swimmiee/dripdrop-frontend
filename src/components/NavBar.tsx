import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-coffee-light text-coffee p-4">
      <div className="max-w-4xl mx-auto flex justify-center space-x-8">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mx-2 px-4 py-2 rounded transition-colors ${
              isActive
                ? 'bg-coffee text-coffee-light'
                : 'hover:underline hover:text-coffee-dark'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/cook"
          className={({ isActive }) =>
            `mx-2 px-4 py-2 rounded transition-colors ${
              isActive
                ? 'bg-coffee text-coffee-light'
                : 'hover:underline hover:text-coffee-dark'
            }`
          }
        >
          Cook
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar; 