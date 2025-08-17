import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { FileNode, FileSystemState } from '@/types';
import { produce } from 'immer';

const initialRoot: FileNode = {
  id: 'root',
  name: 'root',
  type: 'directory',
  path: '/',
  children: [
    {
      id: uuidv4(),
      name: 'src',
      type: 'directory',
      path: '/src',
      children: [
        {
          id: uuidv4(),
          name: 'index.js',
          type: 'file',
          content: `// JavaScript Example
console.log("Hello, VS Code clone!");

// Simple function
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// Function call
console.log(greet("Developer"));

// Async example
setTimeout(() => {
  console.log("This runs after 1 second");
}, 1000);`,
          extension: 'js',
          path: '/src/index.js',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        },
        {
          id: uuidv4(),
          name: 'styles.css',
          type: 'file',
          content: `/* CSS Example */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.button {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.button:hover {
  background: #45a049;
}

.card {
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`,
          extension: 'css',
          path: '/src/styles.css',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        },
        {
          id: uuidv4(),
          name: 'example.py',
          type: 'file',
          content: `# Python Example
print("Hello from Python!")

# Simple function
def greet(name):
    return f"Hello, {name}!"

# List operations
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(f"Original: {numbers}")
print(f"Doubled: {doubled}")

# Function call
print(greet("Python Developer"))

# Dictionary example
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

for key, value in person.items():
    print(f"{key}: {value}")

# Simple calculation
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Fibonacci sequence:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
          extension: 'py',
          path: '/src/example.py',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        },
        {
          id: uuidv4(),
          name: 'index.html',
          type: 'file',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VS Code Clone Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to VS Code Clone</h1>
        <p>This is a web-based VS Code clone built with React and TypeScript.</p>
        
        <div class="card">
            <h2>Features</h2>
            <ul>
                <li>File Explorer</li>
                <li>Code Editor with Monaco</li>
                <li>Integrated Terminal</li>
                <li>Code Execution</li>
                <li>Dark/Light Themes</li>
            </ul>
        </div>
        
        <div class="card">
            <h2>Try It Out</h2>
            <p>Open the terminal and run some code:</p>
            <code>run javascript console.log("Hello World!")</code><br>
            <code>run python print("Hello from Python!")</code>
        </div>
        
        <button class="button" onclick="alert('Button clicked!')">
            Click Me!
        </button>
    </div>
    
    <script>
        // Inline JavaScript
        console.log("HTML page loaded!");
        
        // Add some interactivity
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
            });
        });
    </script>
</body>
</html>`,
          extension: 'html',
          path: '/src/index.html',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        },
        {
          id: uuidv4(),
          name: 'typescript-example.ts',
          type: 'file',
          content: `// TypeScript Example
interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

class UserManager {
    private users: User[] = [];
    
    constructor() {
        console.log("UserManager initialized");
    }
    
    addUser(user: User): void {
        this.users.push(user);
        console.log(\`User \${user.name} added\`);
    }
    
    getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }
    
    getAllUsers(): User[] {
        return this.users;
    }
    
    removeUser(id: number): boolean {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            console.log(\`User with ID \${id} removed\`);
            return true;
        }
        return false;
    }
}

// Usage example
const userManager = new UserManager();

const user1: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    isActive: true
};

const user2: User = {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    isActive: true
};

userManager.addUser(user1);
userManager.addUser(user2);

console.log("All users:", userManager.getAllUsers());
console.log("User 1:", userManager.getUserById(1));

// Generic function example
function createArray<T>(length: number, value: T): T[] {
    return Array(length).fill(value);
}

const stringArray = createArray(3, "hello");
const numberArray = createArray(4, 42);

console.log("String array:", stringArray);
console.log("Number array:", numberArray);`,
          extension: 'ts',
          path: '/src/typescript-example.ts',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        }
      ],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    },
    {
      id: uuidv4(),
      name: 'README.md',
      type: 'file',
      content: `# VS Code Clone

A web-based VS Code clone created with React, TypeScript, and modern web technologies.

## Features

- **File Explorer**: Navigate and manage project files
- **Code Editor**: Monaco Editor with syntax highlighting
- **Integrated Terminal**: Execute commands and run code
- **Code Execution**: Run JavaScript, Python, TypeScript, HTML, and CSS
- **Dark/Light Themes**: Switch between themes
- **Responsive Design**: Works on desktop and mobile

## Getting Started

1. Open a file in the editor
2. Use the "Run Code" button or Ctrl+Enter to execute code
3. Open the terminal to run commands
4. Use "run <language> <code>" in terminal for direct execution

## Supported Languages

- **JavaScript/JSX**: Full execution with console output
- **TypeScript/TSX**: Type-stripped execution
- **Python**: Basic Python-like execution
- **Java**: Basic Java-like execution
- **C++**: Basic C++ execution
- **C#**: Basic C# execution
- **Go**: Basic Go execution
- **Rust**: Basic Rust execution
- **PHP**: Basic PHP execution
- **Ruby**: Basic Ruby execution
- **Swift**: Basic Swift execution
- **Kotlin**: Basic Kotlin execution
- **Scala**: Basic Scala execution
- **R**: Basic R execution
- **MATLAB**: Basic MATLAB execution
- **HTML**: Rendered in preview
- **CSS**: Applied to test elements

## Examples

### JavaScript
\`\`\`javascript
console.log("Hello World!");
const numbers = [1, 2, 3, 4, 5];
console.log(numbers.map(n => n * 2));
\`\`\`

### Python
\`\`\`python
print("Hello from Python!")
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(f"Doubled: {doubled}")
\`\`\`

### Terminal Commands
\`\`\`bash
run javascript console.log("Hello!")
run python print("Hello from Python!")
help
date
\`\`\`

## Development

This project uses:
- React 18 with TypeScript
- Monaco Editor for code editing
- XTerm for terminal emulation
- Zustand for state management
- Tailwind CSS for styling

## License

MIT License - feel free to use and modify!`,
      extension: 'md',
      path: '/README.md',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    }
  ],
  createdAt: Date.now(),
  modifiedAt: Date.now(),
};

export const useFileSystemStore = create(
  persist<{
    state: FileSystemState;
    createFile: (parentPath: string, name: string, content?: string) => void;
    createDirectory: (parentPath: string, name: string) => void;
    deleteNode: (path: string) => void;
    renameNode: (path: string, newName: string) => void;
    updateFileContent: (path: string, content: string) => void;
    moveNode: (sourcePath: string, targetPath: string) => void;
    selectNode: (node: FileNode | null) => void;
    copyToClipboard: (node: FileNode, operation: 'copy' | 'cut') => void;
    paste: (targetPath: string) => void;
    getNodeByPath: (path: string) => FileNode | null;
    clearClipboard: () => void;
    testCreateFile: () => void;
    loadExternalFolder: (dirHandle: any) => Promise<void>;
  }>(
    (set, get) => ({
      state: {
        root: initialRoot,
        selectedNode: null,
        clipboard: {
          node: null,
          operation: null,
        },
      },
      
      getNodeByPath: (path: string): FileNode | null => {
        const { root } = get().state;
        if (path === '/') return root;
        
        const parts = path.split('/').filter(Boolean);
        let current: FileNode = root;
        
        for (const part of parts) {
          if (!current.children) return null;
          
          const found = current.children.find(child => child.name === part);
          if (!found) return null;
          
          current = found;
        }
        
        return current;
      },
      
      createFile: (parentPath: string, name: string, content = '') => {
        console.log('createFile called with:', { parentPath, name, content });
        set(
          produce((draft) => {
            const newPath = `${parentPath === '/' ? '' : parentPath}/${name}`;
            const extension = name.includes('.') ? name.split('.').pop() || '' : '';
            
            const newFile: FileNode = {
              id: uuidv4(),
              name,
              type: 'file',
              content,
              extension,
              path: newPath,
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            };
            
            // Find and update the parent node in the draft state
            const findAndUpdate = (node: FileNode, targetPath: string): boolean => {
              if (node.path === targetPath) {
                if (node.type !== 'directory') return false;
                if (!node.children) node.children = [];
                node.children.push(newFile);
                node.modifiedAt = Date.now();
                return true;
              }
              
              if (node.children) {
                for (const child of node.children) {
                  if (findAndUpdate(child, targetPath)) return true;
                }
              }
              
              return false;
            };
            
            console.log('Searching for parent path:', parentPath);
            
            // Helper function to get all available paths
            const getAllPaths = (node: FileNode): string[] => {
              const paths: string[] = [node.path];
              if (node.children) {
                node.children.forEach(child => {
                  paths.push(...getAllPaths(child));
                });
              }
              return paths;
            };
            
            console.log('Current root structure:', JSON.stringify(draft.state.root, null, 2));
            
            const success = findAndUpdate(draft.state.root, parentPath);
            if (!success) {
              console.error(`Failed to create file: parent path '${parentPath}' not found or not a directory`);
              console.log('Available paths:', getAllPaths(draft.state.root));
            } else {
              console.log(`File '${name}' created successfully in '${parentPath}'`);
            }
          })
        );
      },
      
      createDirectory: (parentPath: string, name: string) => {
        console.log('createDirectory called with:', { parentPath, name });
        set(
          produce((draft) => {
            const newPath = `${parentPath === '/' ? '' : parentPath}/${name}`;
            
            const newDir: FileNode = {
              id: uuidv4(),
              name,
              type: 'directory',
              children: [],
              path: newPath,
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            };
            
            // Find and update the parent node in the draft state
            const findAndUpdate = (node: FileNode, targetPath: string): boolean => {
              if (node.path === targetPath) {
                if (node.type !== 'directory') return false;
                if (!node.children) node.children = [];
                node.children.push(newDir);
                node.modifiedAt = Date.now();
                return true;
              }
              
              if (node.children) {
                for (const child of node.children) {
                  if (findAndUpdate(child, targetPath)) return true;
                }
              }
              
              return false;
            };
            
            console.log('Searching for parent path:', parentPath);
            
            // Helper function to get all available paths
            const getAllPaths = (node: FileNode): string[] => {
              const paths: string[] = [node.path];
              if (node.children) {
                node.children.forEach(child => {
                  paths.push(...getAllPaths(child));
                });
              }
              return paths;
            };
            
            const success = findAndUpdate(draft.state.root, parentPath);
            if (!success) {
              console.error(`Failed to create directory: parent path '${parentPath}' not found or not a directory`);
              console.log('Available paths:', getAllPaths(draft.state.root));
            } else {
              console.log(`Directory '${name}' created successfully in '${parentPath}'`);
            }
          })
        );
      },
      
      deleteNode: (path: string) => {
        console.log('deleteNode called with path:', path);
        set(
          produce((draft) => {
            if (path === '/') {
              console.log('Cannot delete root');
              return;
            }
            
            const parts = path.split('/').filter(Boolean);
            const nodeName = parts.pop() || '';
            const parentPath = parts.length === 0 ? '/' : `/${parts.join('/')}`;
            
            console.log('Deleting node:', nodeName, 'from parent:', parentPath);
            
            // Find and update the parent node in the draft state
            const findAndUpdateParent = (node: FileNode, targetPath: string): boolean => {
              if (node.path === targetPath) {
                if (!node.children) {
                  console.log('Parent has no children');
                  return false;
                }
                
                const originalLength = node.children.length;
                node.children = node.children.filter(child => child.name !== nodeName);
                const newLength = node.children.length;
                
                if (originalLength === newLength) {
                  console.log('Node not found in parent:', nodeName);
                } else {
                  console.log('Node deleted successfully:', nodeName);
                  node.modifiedAt = Date.now();
                }
                
                return true;
              }
              
              if (node.children) {
                for (const child of node.children) {
                  if (findAndUpdateParent(child, targetPath)) return true;
                }
              }
              
              return false;
            };
            
            const success = findAndUpdateParent(draft.state.root, parentPath);
            if (!success) {
              console.error('Parent path not found:', parentPath);
            }
            
            // Clear selection if the deleted node was selected
            if (draft.state.selectedNode?.path.startsWith(path)) {
              draft.state.selectedNode = null;
            }
          })
        );
      },
      
      renameNode: (path: string, newName: string) => {
        console.log('renameNode called with path:', path, 'newName:', newName);
        set(
          produce((draft) => {
            if (path === '/') return; // Cannot rename root
            
            const node = get().getNodeByPath(path);
            if (!node) return;
            
            const parts = path.split('/').filter(Boolean);
            parts.pop(); // Remove the old name
            const parentPath = parts.length === 0 ? '/' : `/${parts.join('/')}`;
            const newPath = `${parentPath === '/' ? '' : parentPath}/${newName}`;
            
            // Update the node and its children paths
            const updateNodePath = (node: FileNode, oldPath: string, newPath: string): void => {
              node.name = newName;
              node.path = newPath;
              
              if (node.type === 'file') {
                node.extension = newName.includes('.') ? newName.split('.').pop() || '' : '';
              }
              
              if (node.children) {
                for (const child of node.children) {
                  const childNewPath = child.path.replace(oldPath, newPath);
                  updateNodePath(child, child.path, childNewPath);
                }
              }
              
              node.modifiedAt = Date.now();
            };
            
            // Find and update the node in the draft state
            const findAndUpdate = (node: FileNode, targetPath: string): boolean => {
              if (node.path === targetPath) {
                console.log('Found node to rename:', node.name);
                updateNodePath(node, path, newPath);
                return true;
              }
              
              if (node.children) {
                for (let i = 0; i < node.children.length; i++) {
                  if (node.children[i].path === targetPath) {
                    console.log('Found node to rename in children:', node.children[i].name);
                    updateNodePath(node.children[i], targetPath, newPath);
                    return true;
                  }
                  
                  if (findAndUpdate(node.children[i], targetPath)) return true;
                }
              }
              
              return false;
            };
            
            const success = findAndUpdate(draft.state.root, path);
            if (!success) {
              console.error('Node not found for rename:', path);
            } else {
              console.log('Node renamed successfully:', path, '->', newPath);
            }
            
            // Update selection if the renamed node was selected
            if (draft.state.selectedNode?.path === path) {
              draft.state.selectedNode.name = newName;
              draft.state.selectedNode.path = newPath;
              if (draft.state.selectedNode.type === 'file') {
                draft.state.selectedNode.extension = newName.includes('.') ? newName.split('.').pop() || '' : '';
              }
            }
          })
        );
      },
      
      updateFileContent: (path: string, content: string) => {
        set(
          produce((draft) => {
            // Find and update the file in the draft state
            const findAndUpdate = (node: FileNode, targetPath: string): boolean => {
              if (node.path === targetPath && node.type === 'file') {
                node.content = content;
                node.modifiedAt = Date.now();
                return true;
              }
              
              if (node.children) {
                for (const child of node.children) {
                  if (findAndUpdate(child, targetPath)) return true;
                }
              }
              
              return false;
            };
            
            findAndUpdate(draft.state.root, path);
          })
        );
      },
      
      moveNode: (sourcePath: string, targetPath: string) => {
        set(
          produce((draft) => {
            if (sourcePath === '/' || targetPath === sourcePath) return;
            
            const sourceNode = get().getNodeByPath(sourcePath);
            if (!sourceNode) return;
            
            const targetNode = get().getNodeByPath(targetPath);
            if (!targetNode || targetNode.type !== 'directory') return;
            
            // Check if the target is a subdirectory of the source
            if (targetNode.path.startsWith(sourceNode.path + '/')) return;
            
            // Remove from source
            const sourceParts = sourcePath.split('/').filter(Boolean);
            const nodeName = sourceParts.pop() || '';
            const sourceParentPath = sourceParts.length === 0 ? '/' : `/${sourceParts.join('/')}`;
            
            const sourceParent = get().getNodeByPath(sourceParentPath);
            if (!sourceParent || !sourceParent.children) return;
            
            // Create a copy of the node to move
            const nodeToMove = JSON.parse(JSON.stringify(sourceNode));
            
            // Remove from source parent
            sourceParent.children = sourceParent.children.filter(child => child.name !== nodeName);
            sourceParent.modifiedAt = Date.now();
            
            // Update the path for the node to move and all its children
            const newPath = `${targetPath === '/' ? '' : targetPath}/${nodeToMove.name}`;
            
            const updatePaths = (node: FileNode, oldBasePath: string, newBasePath: string) => {
              node.path = node.path.replace(oldBasePath, newBasePath);
              
              if (node.children) {
                for (const child of node.children) {
                  updatePaths(child, oldBasePath, newBasePath);
                }
              }
            };
            
            updatePaths(nodeToMove, sourcePath, newPath);
            
            // Add to target
            if (!targetNode.children) targetNode.children = [];
            targetNode.children.push(nodeToMove);
            targetNode.modifiedAt = Date.now();
            
            // Update the draft state
            const removeFromSource = (node: FileNode, parentPath: string, nodeName: string): boolean => {
              if (node.path === parentPath) {
                if (node.children) {
                  node.children = node.children.filter(child => child.name !== nodeName);
                  node.modifiedAt = Date.now();
                }
                return true;
              }
              
              if (node.children) {
                for (const child of node.children) {
                  if (removeFromSource(child, parentPath, nodeName)) return true;
                }
              }
              
              return false;
            };
            
            const addToTarget = (node: FileNode, targetPath: string, nodeToAdd: FileNode): boolean => {
              if (node.path === targetPath) {
                if (!node.children) node.children = [];
                node.children.push(nodeToAdd);
                node.modifiedAt = Date.now();
                return true;
              }
              
              if (node.children) {
                for (const child of node.children) {
                  if (addToTarget(child, targetPath, nodeToAdd)) return true;
                }
              }
              
              return false;
            };
            
            removeFromSource(draft.state.root, sourceParentPath, nodeName);
            addToTarget(draft.state.root, targetPath, nodeToMove);
            
            // Update selection if the moved node was selected
            if (draft.state.selectedNode?.path === sourcePath) {
              draft.state.selectedNode = nodeToMove;
            }
          })
        );
      },
      
      selectNode: (node: FileNode | null) => {
        set(
          produce((draft) => {
            draft.state.selectedNode = node;
          })
        );
      },
      
      copyToClipboard: (node: FileNode, operation: 'copy' | 'cut') => {
        set(
          produce((draft) => {
            draft.state.clipboard = {
              node: JSON.parse(JSON.stringify(node)), // Deep clone to avoid references
              operation,
            };
          })
        );
      },
      
      paste: (targetPath: string) => {
        set(
          produce((draft) => {
            const { node, operation } = draft.state.clipboard;
            if (!node) return;
            
            const targetNode = get().getNodeByPath(targetPath);
            if (!targetNode || targetNode.type !== 'directory') return;
            
            // Create a copy of the node
            const nodeCopy = JSON.parse(JSON.stringify(node));
            
            // Update paths
            const newPath = `${targetPath === '/' ? '' : targetPath}/${nodeCopy.name}`;
            
            const updatePaths = (node: FileNode, oldBasePath: string, newBasePath: string) => {
              node.path = node.path.replace(oldBasePath, newBasePath);
              
              if (node.children) {
                for (const child of node.children) {
                  updatePaths(child, oldBasePath, newBasePath);
                }
              }
            };
            
            updatePaths(nodeCopy, node.path, newPath);
            
            // Add to target
            if (!targetNode.children) targetNode.children = [];
            
            // Check for name conflicts and rename if necessary
            const existingNames = targetNode.children.map(child => child.name);
            if (existingNames.includes(nodeCopy.name)) {
              let counter = 1;
              let newName = nodeCopy.name;
              
              // For files with extensions
              if (nodeCopy.type === 'file' && nodeCopy.extension) {
                const nameParts = nodeCopy.name.split('.');
                const ext = nameParts.pop();
                let baseName = nameParts.join('.');
                
                while (existingNames.includes(newName)) {
                  newName = `${baseName} (${counter}).${ext}`;
                  counter++;
                }
              } else {
                // For directories or files without extensions
                while (existingNames.includes(newName)) {
                  newName = `${nodeCopy.name} (${counter})`;
                  counter++;
                }
              }
              
              nodeCopy.name = newName;
              nodeCopy.path = `${targetPath === '/' ? '' : targetPath}/${newName}`;
              
              // Update paths for children if it's a directory
              if (nodeCopy.type === 'directory' && nodeCopy.children) {
                nodeCopy.children.forEach(child => {
                  updatePaths(child, `${targetPath === '/' ? '' : targetPath}/${node.name}`, nodeCopy.path);
                });
              }
            }
            
            targetNode.children.push(nodeCopy);
            targetNode.modifiedAt = Date.now();
            
            // Delete original if it was a cut operation
            if (operation === 'cut') {
              const sourcePath = node.path;
              const sourceParts = sourcePath.split('/').filter(Boolean);
              const nodeName = sourceParts.pop() || '';
              const sourceParentPath = sourceParts.length === 0 ? '/' : `/${sourceParts.join('/')}`;
              
              // Find and remove from the source parent
              const removeFromSource = (node: FileNode, parentPath: string, nodeName: string): boolean => {
                if (node.path === parentPath) {
                  if (node.children) {
                    node.children = node.children.filter(child => child.name !== nodeName);
                    node.modifiedAt = Date.now();
                  }
                  return true;
                }
                
                if (node.children) {
                  for (const child of node.children) {
                    if (removeFromSource(child, parentPath, nodeName)) return true;
                  }
                }
                
                return false;
              };
              
              removeFromSource(draft.state.root, sourceParentPath, nodeName);
            }
            
            // Clear clipboard after paste if it was a cut operation
            if (operation === 'cut') {
              draft.state.clipboard = { node: null, operation: null };
            }
          })
        );
      },
      
      clearClipboard: () => {
        set(
          produce((draft) => {
            draft.state.clipboard = { node: null, operation: null };
          })
        );
      },

      // Test function to verify file creation
      testCreateFile: () => {
        console.log('Testing file creation...');
        const testFile = {
          id: uuidv4(),
          name: 'test.js',
          type: 'file' as const,
          content: 'console.log("test");',
          extension: 'js',
          path: '/src/test.js',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        };
        
        set(
          produce((draft) => {
            if (!draft.state.root.children) {
              draft.state.root.children = [];
            }
            draft.state.root.children.push(testFile);
            console.log('Test file added to root');
          })
        );
      },

      loadExternalFolder: async (dirHandle: any) => {
        try {
          console.log('Loading external folder:', dirHandle.name);
          
          // Recursive function to read directory contents
          const readDirectory = async (handle: any, parentPath: string): Promise<FileNode[]> => {
            const children: FileNode[] = [];
            
            for await (const entry of handle.values()) {
              if (entry.kind === 'file') {
                try {
                  const file = await entry.getFile();
                  const content = await file.text();
                  const extension = entry.name.includes('.') ? entry.name.split('.').pop() || '' : '';
                  
                  children.push({
                    id: uuidv4(),
                    name: entry.name,
                    type: 'file',
                    content,
                    extension,
                    path: `${parentPath}/${entry.name}`,
                    createdAt: Date.now(),
                    modifiedAt: Date.now(),
                  });
                } catch (error) {
                  console.warn(`Could not read file ${entry.name}:`, error);
                }
              } else if (entry.kind === 'directory') {
                try {
                  const subDirHandle = await handle.getDirectoryHandle(entry.name);
                  const subChildren = await readDirectory(subDirHandle, `${parentPath}/${entry.name}`);
                  
                  children.push({
                    id: uuidv4(),
                    name: entry.name,
                    type: 'directory',
                    children: subChildren,
                    path: `${parentPath}/${entry.name}`,
                    createdAt: Date.now(),
                    modifiedAt: Date.now(),
                  });
                } catch (error) {
                  console.warn(`Could not read directory ${entry.name}:`, error);
                }
              }
            }
            
            return children;
          };
          
          // Read the root directory
          const folderChildren = await readDirectory(dirHandle, `/${dirHandle.name}`);
          
          // Create the root folder node
          const externalFolder: FileNode = {
            id: uuidv4(),
            name: dirHandle.name,
            type: 'directory',
            children: folderChildren,
            path: `/${dirHandle.name}`,
            createdAt: Date.now(),
            modifiedAt: Date.now(),
          };
          
          // Replace the current root with the external folder
          set(
            produce((draft) => {
              draft.state.root = externalFolder;
              draft.state.selectedNode = null;
            })
          );
          
          console.log('External folder loaded successfully:', externalFolder);
          
        } catch (error) {
          console.error('Error loading external folder:', error);
          throw error;
        }
      },
    }),
    {
      name: 'file-system-storage',
      partialize: (state) => ({ state: { root: state.state.root, selectedNode: state.state.selectedNode, clipboard: state.state.clipboard } } as any),
    }
  )
);