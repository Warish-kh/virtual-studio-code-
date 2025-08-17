import React, { createContext, useState, useContext, ReactNode } from 'react';
import { FileNode } from '@/types';

// Define context type
interface DragContextType {
  draggedItem: FileNode | null;
  setDraggedItem: (item: FileNode | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

// Create context
const DragContext = createContext<DragContextType | undefined>(undefined);

// Provider component
export const DragProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [draggedItem, setDraggedItem] = useState<FileNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragContext.Provider value={{ draggedItem, setDraggedItem, isDragging, setIsDragging }}>
      {children}
    </DragContext.Provider>
  );
};

// Hook for using the drag context
export const useDrag = () => {
  const context = useContext(DragContext);
  if (context === undefined) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
};

// Draggable component
export const Draggable: React.FC<{ 
  item: FileNode; 
  children: ReactNode; 
  className?: string;
}> = ({ item, children, className }) => {
  const { setDraggedItem, setIsDragging } = useDrag();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItem(item);
    setIsDragging(true);
    
    // Set drag data
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: item.id,
      path: item.path,
      type: item.type
    }));
    
    // Set drag image
    const dragImage = document.createElement('div');
    dragImage.classList.add('bg-primary', 'text-primary-foreground', 'px-2', 'py-1', 'rounded', 'text-xs');
    dragImage.textContent = item.name;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={className}
    >
      {children}
    </div>
  );
};

// Droppable component
export const Droppable: React.FC<{
  onDrop: (item: FileNode, targetPath: string) => void;
  targetPath: string;
  children: ReactNode;
  className?: string;
  acceptsType?: 'file' | 'directory' | 'both' | 'none';
}> = ({ onDrop, targetPath, children, className, acceptsType = 'both' }) => {
  const { draggedItem, setIsDragging } = useDrag();
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Check if we can drop here
    if (draggedItem) {
      // Check if the item type is acceptable
      if (
        acceptsType === 'both' ||
        acceptsType === draggedItem.type
      ) {
        // Check if the target is not the dragged item itself or its child
        if (targetPath !== draggedItem.path && !targetPath.startsWith(draggedItem.path + '/')) {
          e.dataTransfer.dropEffect = 'move';
          setIsOver(true);
          return;
        }
      }
    }
    
    // Not allowed to drop
    e.dataTransfer.dropEffect = 'none';
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    
    if (draggedItem) {
      // Check if we can drop here
      if (
        (acceptsType === 'both' || acceptsType === draggedItem.type) &&
        targetPath !== draggedItem.path &&
        !targetPath.startsWith(draggedItem.path + '/')
      ) {
        onDrop(draggedItem, targetPath);
      }
    }
    
    setIsDragging(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${className} ${isOver ? 'bg-primary/10' : ''}`}
    >
      {children}
    </div>
  );
};

// Export default provider
export default DragProvider;