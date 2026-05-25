import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  History, 
  Bell, 
  LogOut, 
  Search, 
  User,
  ChevronDown
} from 'lucide-react';

const MainLayout = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mockUser = {
    name: 'Nguyen Van A',
    email: 'nva@company.com',
    role: 'Manager'
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/audit-logs', label: 'Audit Logs', icon: History },
    { path: '/notifications', label: 'Notifications', icon: Bell }
  ];

  const getPageTitle = () => {
    const activeItem = navItems.find(item => item.path === location.pathname);
    return activeItem ? activeItem.label : 'Workflow Tracker';
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-primary-50">
      <aside className="w-64 bg-white border-r border-primary-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-primary-100 gap-3">
          <div className="w-8 h-8 rounded-md-custom bg-accent-500 flex items-center justify-center text-white font-bold">
            W
          </div>
          <div>
            <h1 className="text-base font-bold text-primary-900 m-0 p-0 leading-tight">Workflow</h1>
            <span className="text-xs text-primary-500 font-medium">Tracker Console</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-md-custom text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-50 text-accent-700'
                      : 'text-primary-600 hover:bg-primary-100 hover:text-primary-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-100 bg-primary-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {mockUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-primary-900 truncate leading-tight">{mockUser.name}</p>
              <p className="text-xs text-primary-500 truncate mt-0.5">{mockUser.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-danger-500 hover:bg-danger-50 rounded-md-custom transition-colors border border-transparent hover:border-danger-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout System
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-primary-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-primary-900 m-0">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-primary-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 bg-primary-50 border border-primary-200 rounded-md-custom text-sm placeholder-primary-400 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>

            <button className="relative p-2 text-primary-600 hover:bg-primary-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:bg-primary-100 p-1.5 rounded-md-custom transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center font-bold text-sm">
                  {mockUser.name.charAt(0)}
                </div>
                <ChevronDown className="w-4 h-4 text-primary-500" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-primary-200 rounded-md-custom shadow-lg-flat py-1 z-50">
                  <div className="px-4 py-2 border-b border-primary-100">
                    <p className="text-xs text-primary-400">Signed in as</p>
                    <p className="text-sm font-semibold text-primary-900 truncate">{mockUser.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
