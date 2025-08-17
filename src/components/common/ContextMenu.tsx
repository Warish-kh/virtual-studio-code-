import React, { useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

const ContextMenu: React.FC = () => {
  const { state: uiState, closeContextMenu } = useUIStore();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Get context menu data from UI state
  const { x, y, items } = uiState.contextMenu;
  
  console.log('ContextMenu render:', { x, y, items: items.length, isOpen: uiState.contextMenu.isOpen });
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeContextMenu]);
  
  // Handle menu item click
  const handleItemClick = (action?: () => void, itemLabel?: string) => {
    console.log('Context menu item clicked:', itemLabel, 'action type:', typeof action);
    console.log('Action function:', action);
    
    if (action && typeof action === 'function') {
      try {
        console.log('Executing action for:', itemLabel);
        action();
        console.log('Action executed successfully for:', itemLabel);
      } catch (error) {
        console.error('Error executing context menu action for', itemLabel, ':', error);
        console.error('Error details:', error);
      }
    } else {
      console.warn('No action or invalid action for:', itemLabel);
      console.warn('Action value:', action);
    }
    closeContextMenu();
  };
  
  // Don't render if not open
  if (!uiState.contextMenu.isOpen) {
    return null;
  }

  return (
    <div 
      ref={menuRef}
      className="context-menu fixed border-2 border-red-500 bg-yellow-100 dark:bg-yellow-900"
      style={{ 
        top: y,
        left: x,
        zIndex: 9999,
        // Ensure menu doesn't go off-screen
        maxHeight: `calc(100vh - ${y + 10}px)`,
        overflow: 'auto',
        minWidth: '200px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => {
        if (item.separator) {
          return <div key={item.id} className="context-menu-separator" />;
        }
        
        // Get icon component if specified
        const IconComponent = item.icon ? (LucideIcons as any)[item.icon] : null;
        
        return (
          <div 
            key={item.id}
            className="context-menu-item"
            onClick={() => handleItemClick(item.action, item.label)}
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;