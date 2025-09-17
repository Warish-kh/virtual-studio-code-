import { useUIStore } from '@/store/uiStore';
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';
import { Check, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const menuData = [
  {
    group: [
      { label: 'New Text File', shortcut: 'Ctrl+N', onClick: () => {}, submenu: false },
      { label: 'New File...', shortcut: 'Ctrl+Alt+Windows+N', onClick: () => {}, submenu: false },
      { label: 'New Window', shortcut: 'Ctrl+Shift+N', onClick: () => {}, submenu: false },
      { label: 'New Window with Profile', onClick: () => {}, submenu: true },
    ]
  },
  {
    group: [
      { label: 'Open File...', shortcut: 'Ctrl+O', onClick: () => {}, submenu: false },
      { label: 'Open Folder...', shortcut: 'Ctrl+K Ctrl+O', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Open Workspace from File...', onClick: () => {}, submenu: false },
      { label: 'Open Recent', onClick: () => {}, submenu: true },
      { label: 'Clone Repository', onClick: () => {}, submenu: false, disabled: true },
    ]
  },
  {
    group: [
      { label: 'Add Folder to Workspace...', onClick: () => {}, submenu: false },
      { label: 'Save Workspace As...', onClick: () => {}, submenu: false },
      { label: 'Duplicate Workspace', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Save', shortcut: 'Ctrl+S', onClick: () => {}, submenu: false },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Save All', shortcut: 'Ctrl+K S', onClick: () => {}, submenu: false, disabled: true },
    ]
  },
  {
    group: [
      { label: 'Share', onClick: () => {}, submenu: true },
    ]
  },
  {
    group: [
      { label: 'Auto Save', onClick: () => {}, submenu: false, check: true },
      { label: 'Preferences', onClick: () => {}, submenu: true },
    ]
  },
  {
    group: [
      { label: 'Revert File', onClick: () => {}, submenu: false },
      { label: 'Close Editor', shortcut: 'Ctrl+F4', onClick: () => {}, submenu: false },
      { label: 'Close Window', shortcut: 'Alt+F4', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Exit', onClick: () => {}, submenu: false },
    ]
  },
];

const selectionMenuData = [
  {
    group: [
      { label: 'Select All', shortcut: 'Ctrl+A', onClick: () => {}, submenu: false },
      { label: 'Expand Selection', shortcut: 'Shift+Alt+RightArrow', onClick: () => {}, submenu: false },
      { label: 'Shrink Selection', shortcut: 'Shift+Alt+LeftArrow', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Copy Line Up', shortcut: 'Shift+Alt+UpArrow', onClick: () => {}, submenu: false },
      { label: 'Copy Line Down', shortcut: 'Shift+Alt+DownArrow', onClick: () => {}, submenu: false },
      { label: 'Move Line Up', shortcut: 'Alt+UpArrow', onClick: () => {}, submenu: false },
      { label: 'Move Line Down', shortcut: 'Alt+DownArrow', onClick: () => {}, submenu: false },
      { label: 'Duplicate Selection', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Add Cursor Above', shortcut: 'Ctrl+Alt+UpArrow', onClick: () => {}, submenu: false },
      { label: 'Add Cursor Below', shortcut: 'Ctrl+Alt+DownArrow', onClick: () => {}, submenu: false },
      { label: 'Add Cursors to Line Ends', shortcut: 'Shift+Alt+I', onClick: () => {}, submenu: false },
      { label: 'Add Next Occurrence', shortcut: 'Ctrl+D', onClick: () => {}, submenu: false },
      { label: 'Add Previous Occurrence', onClick: () => {}, submenu: false },
      { label: 'Select All Occurrences', shortcut: 'Ctrl+Shift+L', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Switch to Ctrl+Click for Multi-Cursor', onClick: () => {}, submenu: false },
      { label: 'Column Selection Mode', onClick: () => {}, submenu: false },
    ]
  },
];

const editMenuData = [
  {
    group: [
      { label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => {}, submenu: false },
      { label: 'Redo', shortcut: 'Ctrl+Y', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Cut', shortcut: 'Ctrl+X', onClick: () => {}, submenu: false },
      { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => {}, submenu: false },
      { label: 'Paste', shortcut: 'Ctrl+V', onClick: () => {}, submenu: false, disabled: true },
    ]
  },
  {
    group: [
      { label: 'Find', shortcut: 'Ctrl+F', onClick: () => {}, submenu: false },
      { label: 'Replace', shortcut: 'Ctrl+H', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Find in Files', shortcut: 'Ctrl+Shift+F', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Replace in Files', shortcut: 'Ctrl+Shift+H', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Toggle Line Comment', shortcut: 'Ctrl+/', onClick: () => {}, submenu: false },
      { label: 'Toggle Block Comment', shortcut: 'Shift+Alt+A', onClick: () => {}, submenu: false },
      { label: 'Emmet: Expand Abbreviation', shortcut: 'Tab', onClick: () => {}, submenu: false },
    ]
  },
];

const viewMenuData = [
  {
    group: [
      { label: 'Command Palette...', shortcut: 'Ctrl+Shift+P', onClick: () => {}, submenu: false },
      { label: 'Open View...', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Appearance', onClick: () => {}, submenu: true },
      { label: 'Editor Layout', onClick: () => {}, submenu: true },
    ]
  },
  {
    group: [
      { label: 'Explorer', shortcut: 'Ctrl+Shift+E', onClick: () => {}, submenu: false },
      { label: 'Search', shortcut: 'Ctrl+Shift+F', onClick: () => {}, submenu: false },
      { label: 'Source Control', shortcut: 'Ctrl+Shift+G', onClick: () => {}, submenu: false },
      { label: 'Run', shortcut: 'Ctrl+Shift+D', onClick: () => {}, submenu: false },
      { label: 'Extensions', shortcut: 'Ctrl+Shift+X', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Chat', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Problems', shortcut: 'Ctrl+Shift+M', onClick: () => {}, submenu: false },
      { label: 'Output', shortcut: 'Ctrl+Shift+U', onClick: () => {}, submenu: false },
      { label: 'Debug Console', shortcut: 'Ctrl+Shift+Y', onClick: () => {}, submenu: false },
      { label: 'Terminal', shortcut: 'Ctrl+`', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Word Wrap', shortcut: 'Alt+Z', onClick: () => {}, submenu: false, disabled: true },
    ]
  },
];

const goMenuData = [
  {
    group: [
      { label: 'Back', shortcut: 'Alt+LeftArrow', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Forward', shortcut: 'Alt+RightArrow', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Last Edit Location', shortcut: 'Ctrl+K Ctrl+Q', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Switch Editor', onClick: () => {}, submenu: true },
      { label: 'Switch Group', onClick: () => {}, submenu: true },
    ]
  },
  {
    group: [
      { label: 'Go to File...', shortcut: 'Ctrl+P', onClick: () => {}, submenu: false },
      { label: 'Go to Symbol in Workspace...', shortcut: 'Ctrl+T', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Go to Symbol in Editor...', shortcut: 'Ctrl+Shift+O', onClick: () => {}, submenu: false },
      { label: 'Go to Definition', shortcut: 'F12', onClick: () => {}, submenu: false },
      { label: 'Go to Declaration', onClick: () => {}, submenu: false },
      { label: 'Go to Type Definition', onClick: () => {}, submenu: false },
      { label: 'Go to Implementations', shortcut: 'Ctrl+F12', onClick: () => {}, submenu: false },
      { label: 'Go to References', shortcut: 'Shift+F12', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Go to Line/Column...', shortcut: 'Ctrl+G', onClick: () => {}, submenu: false },
      { label: 'Go to Bracket', shortcut: 'Ctrl+Shift+\\', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Next Problem', shortcut: 'F8', onClick: () => {}, submenu: false },
      { label: 'Previous Problem', shortcut: 'Shift+F8', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Next Change', shortcut: 'Alt+F3', onClick: () => {}, submenu: false },
      { label: 'Previous Change', shortcut: 'Shift+Alt+F3', onClick: () => {}, submenu: false },
    ]
  },
];

const runMenuData = [
  {
    group: [
      { label: 'Start Debugging', shortcut: 'F5', onClick: () => {}, submenu: false },
      { label: 'Run Without Debugging', shortcut: 'Ctrl+F5', onClick: () => {}, submenu: false },
      { label: 'Stop Debugging', shortcut: 'Shift+F5', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Restart Debugging', shortcut: 'Ctrl+Shift+F5', onClick: () => {}, submenu: false, disabled: true },
    ]
  },
  {
    group: [
      { label: 'Open Configurations', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Add Configuration...', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Step Over', shortcut: 'F10', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Step Into', shortcut: 'F11', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Step Out', shortcut: 'Shift+F11', onClick: () => {}, submenu: false, disabled: true },
      { label: 'Continue', shortcut: 'F5', onClick: () => {}, submenu: false, disabled: true },
    ]
  },
  {
    group: [
      { label: 'Toggle Breakpoint', shortcut: 'F9', onClick: () => {}, submenu: false },
      { label: 'New Breakpoint', onClick: () => {}, submenu: true },
    ]
  },
  {
    group: [
      { label: 'Enable All Breakpoints', onClick: () => {}, submenu: false },
      { label: 'Disable All Breakpoints', onClick: () => {}, submenu: false },
      { label: 'Remove All Breakpoints', onClick: () => {}, submenu: false },
    ]
  },
  {
    group: [
      { label: 'Install Additional Debuggers...', onClick: () => {}, submenu: false },
    ]
  },
];

const VSCodeMenu: React.FC<{ menu?: 'file' | 'edit' | 'selection' | 'view' | 'go' | 'run' }> = ({ menu = 'file' }) => {
  const { toggleMenu } = useUIStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{ group: number; item: number } | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleMenu]);

  let data = menuData;
  if (menu === 'selection') data = selectionMenuData;
  if (menu === 'edit') data = editMenuData;
  if (menu === 'view') data = viewMenuData;
  if (menu === 'go') data = goMenuData;
  if (menu === 'run') data = runMenuData;

  let groupIndex = 0;
  const { isSignedIn } = useUser();
  return (
    <div
      ref={menuRef}
      className="absolute top-8 left-2 z-50 bg-[#23272e] border border-[#333] shadow-lg rounded-md w-80 py-1 text-white select-none max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#373b41] scrollbar-track-[#23272e]"
      onClick={e => e.stopPropagation()}
      tabIndex={0}
    >
      {/* Account section */}
      <div className="px-3 py-1.5 text-sm flex items-center gap-2">
        {isSignedIn ? (
          <SignOutButton signOutOptions={{ redirectUrl: '/sign-in' }}>
            <button className="w-full text-left hover:bg-[#373b41] rounded px-2 py-1">Sign out</button>
          </SignOutButton>
        ) : (
          <SignInButton mode="modal">
            <button className="w-full text-left hover:bg-[#373b41] rounded px-2 py-1">Sign in</button>
          </SignInButton>
        )}
      </div>
      <div className="my-1 border-t border-[#333]" />
      {data.map((section, i) => (
        <React.Fragment key={i}>
          {i !== 0 && <div className="my-1 border-t border-[#333]" />}
          {section.group.map((item, j) => (
            <div
              key={item.label}
              className={`flex items-center px-3 py-1.5 text-sm relative cursor-pointer ${item.disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-[#373b41]'} ${hovered && hovered.group === i && hovered.item === j ? 'bg-[#373b41]' : ''}`}
              onMouseEnter={() => setHovered({ group: i, item: j })}
              onMouseLeave={() => setHovered(null)}
              onClick={item.onClick}
              tabIndex={item.disabled ? -1 : 0}
            >
              {/* Checkmark for Auto Save */}
              {item.check && (
                <span className="mr-2 text-blue-400 flex items-center w-4">
                  <Check className="h-4 w-4" />
                </span>
              )}
              {!item.check && <span className="w-4 mr-2" />}
              <span>{item.label}</span>
              {/* Submenu arrow */}
              {item.submenu && (
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              )}
              {/* Shortcut */}
              {item.shortcut && !item.submenu && (
                <span className="ml-auto text-xs text-gray-400 font-mono">{item.shortcut}</span>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default VSCodeMenu;