import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Minus, Square, Search, MoreVertical } from 'lucide-react';
import VSCodeMenu from './VSCodeMenu';

const MENUS = [
  { key: 'file', label: 'File' },
  { key: 'edit', label: 'Edit' },
  { key: 'selection', label: 'Selection' },
  { key: 'view', label: 'View' },
  { key: 'go', label: 'Go' },
  { key: 'run', label: 'Run' },
];

const VSCodeTitleBar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuBarRef = useRef(null);

  const handleMenuClick = (key) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!openMenu) return;
    function handleClickOutside(event) {
      if (
        menuBarRef.current &&
        !menuBarRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  return (
    <div className="vscode-titlebar">
      <div className="flex items-center" ref={menuBarRef}>
        {/* VS Code Logo */}
        <div className="h-6 w-6 mr-2">
          <svg viewBox="0 0 24 24" fill="none" className="text-primary h-full w-full">
            <path 
              d="M16.03 18.0L4.8 12L16.03 6L16.5 6.3V17.7L16.03 18.0Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="currentColor"
            />
            <path 
              d="M4.8 12L2 14.5V9.5L4.8 12Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="currentColor"
            />
            <path 
              d="M16.5 17.7L9.5 21L9 20.5V3.5L9.5 3L16.5 6.3L10 12L16.5 17.7Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="currentColor"
            />
          </svg>
        </div>
        {/* Menu Bar */}
        <div className="flex items-center space-x-4 mr-4 relative">
          {MENUS.map(({ key, label }) => (
            <button
              key={key}
              className={`text-xs px-2 py-1 rounded-sm ${openMenu === key ? 'bg-blue-600 text-white' : 'hover:bg-accent hover:text-accent-foreground'}`}
              onClick={() => handleMenuClick(key)}
            >
              {label}
            </button>
          ))}
          <button className="text-xs hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-sm">
            <MoreVertical className="h-3 w-3" />
          </button>
          {/* Dropdown menu */}
          {openMenu && (
            <VSCodeMenu menu={openMenu} />
          )}
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button className="vscode-titlebar-button" aria-label="Go back">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="vscode-titlebar-button" aria-label="Go forward">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="flex-1 mx-4">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search"
            className="w-full h-6 px-8 text-xs bg-muted rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        </div>
      </div>
      {/* Window Controls */}
      <div className="flex items-center space-x-2">
        <button className="vscode-titlebar-button" aria-label="Minimize">
          <Minus className="h-4 w-4" />
        </button>
        <button className="vscode-titlebar-button" aria-label="Maximize">
          <Square className="h-4 w-4" />
        </button>
        <button className="vscode-titlebar-button text-destructive hover:bg-destructive hover:text-destructive-foreground" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default VSCodeTitleBar;