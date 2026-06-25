import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/home' },
  { label: 'Human Resources', to: '/hr' },
  { label: 'Finance', to: '/finance' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Sales', to: '/sales' },
  { label: 'Procurement', to: '/procurement' },
  { label: 'Projects', to: '/projects' },
  { label: 'Reports', to: '/reports' },
  { label: 'Settings', to: '/settings' },
];

export default function BottomNav() {
  return (
    <div className="bg-white border-top-1 border-100 px-4">
      <div className="flex align-items-center gap-6 overflow-x-auto no-scrollbar bottom-nav-bar">
        {navItems.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `no-underline text-sm font-bold h-full flex align-items-center border-bottom-3 transition-all transition-duration-200 
               ${
                 isActive
                   ? 'text-blue-600 border-blue-600'
                   : 'text-600 border-transparent hover:text-900 hover:border-200'
               }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
