import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useTerminalStore } from '@/store/terminalStore';

// Import xterm styles
import 'xterm/css/xterm.css';

const Terminal: React.FC = () => {
  const { executeCommand, executeCode } = useTerminalStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Initialize xterm
  useEffect(() => {
    if (terminalRef.current) {
      // Create terminal
      const term = new XTerm({
        cursorBlink: true,
        cursorStyle: 'block',
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#1E1E1E',
          foreground: '#D4D4D4',
          cursor: '#FFFFFF'
        }
      });
      
      // Create fit addon
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      
      // Open terminal
      term.open(terminalRef.current);
      fitAddon.fit();
      
      // Set references
      xtermRef.current = term;
      fitAddonRef.current = fitAddon;
      
      // Print welcome message
      term.writeln('\x1b[1;32mWelcome to VS Code Web Terminal\x1b[0m');
      term.writeln('Type "help" for available commands');
      term.writeln('Use "run <language> <code>" to execute code directly');
      term.write('\r\n$ ');
      
      // Handle key events
      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
        
        if (domEvent.keyCode === 13) { // Enter key
          // Execute command
          const trimmedInput = input.trim();
          if (trimmedInput) {
            term.writeln('');
            
            // Check if it's a run command
            if (trimmedInput.startsWith('run ')) {
              const parts = trimmedInput.split(' ');
              if (parts.length >= 3) {
                const language = parts[1];
                const code = parts.slice(2).join(' ');
                
                term.writeln(`\x1b[1;36mExecuting ${language} code...\x1b[0m`);
                executeCode(code, language).then(output => {
                  if (output) {
                    term.writeln(`\x1b[1;33mOutput:\x1b[0m`);
                    term.writeln(output);
                  }
                  term.write('\r\n$ ');
                }).catch(error => {
                  term.writeln(`\x1b[1;31mError: ${error}\x1b[0m`);
                  term.write('\r\n$ ');
                });
              } else {
                term.writeln('\x1b[1;31mUsage: run <language> <code>\x1b[0m');
                term.write('\r\n$ ');
              }
            } else {
              // Regular command execution
              executeCommand(trimmedInput).then(output => {
                if (output) {
                  term.writeln(output);
                }
                term.write('\r\n$ ');
                
                // Add to history
                setCommandHistory(prev => [trimmedInput, ...prev]);
                setHistoryIndex(-1);
              });
            }
            setInput('');
            setCursorPosition(0);
          } else {
            term.writeln('');
            term.write('\r\n$ ');
          }
        } else if (domEvent.keyCode === 8) { // Backspace key
          // Handle backspace
          if (cursorPosition > 0) {
            setInput(prev => prev.substring(0, cursorPosition - 1) + prev.substring(cursorPosition));
            setCursorPosition(prev => prev - 1);
            term.write('\b \b');
          }
        } else if (domEvent.keyCode === 38) { // Up arrow
          // Navigate history
          if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
            // Clear current input
            for (let i = 0; i < input.length; i++) {
              term.write('\b \b');
            }
            
            const newIndex = historyIndex + 1;
            const historyItem = commandHistory[newIndex];
            
            setHistoryIndex(newIndex);
            setInput(historyItem);
            setCursorPosition(historyItem.length);
            term.write(historyItem);
          }
        } else if (domEvent.keyCode === 40) { // Down arrow
          // Navigate history downward
          if (historyIndex > 0) {
            // Clear current input
            for (let i = 0; i < input.length; i++) {
              term.write('\b \b');
            }
            
            const newIndex = historyIndex - 1;
            const historyItem = commandHistory[newIndex];
            
            setHistoryIndex(newIndex);
            setInput(historyItem);
            setCursorPosition(historyItem.length);
            term.write(historyItem);
          } else if (historyIndex === 0) {
            // Clear current input
            for (let i = 0; i < input.length; i++) {
              term.write('\b \b');
            }
            
            setHistoryIndex(-1);
            setInput('');
            setCursorPosition(0);
          }
        } else if (printable) {
          // Print character
          setInput(prev => prev + key);
          setCursorPosition(prev => prev + 1);
          term.write(key);
        }
      });
      
      // Handle resize
      const handleResize = () => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      };
      
      // Handle custom terminal write events
      const handleTerminalWrite = (event: CustomEvent) => {
        const { command, output, error } = event.detail;
        
        // Write the command
        term.writeln('');
        term.writeln(`\x1b[1;36m$ ${command}\x1b[0m`);
        
        if (error) {
          // Write error
          term.writeln(`\x1b[1;31mError: ${error}\x1b[0m`);
        } else if (output) {
          // Write output with proper formatting
          term.writeln(`\x1b[1;33mOutput:\x1b[0m`);
          // Split output by lines and write each line
          const lines = output.split('\n');
          lines.forEach(line => {
            term.writeln(line);
          });
        }
        
        // Add new prompt
        term.write('\r\n$ ');
      };
      
      // Add event listener for terminal writes
      term.element?.addEventListener('terminal-write', handleTerminalWrite as EventListener);
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        term.element?.removeEventListener('terminal-write', handleTerminalWrite as EventListener);
        term.dispose();
      };
    }
  }, [executeCommand, executeCode]);

  // Auto-resize terminal when its container size changes
  useEffect(() => {
    if (fitAddonRef.current) {
      setTimeout(() => {
        fitAddonRef.current?.fit();
      }, 100);
    }
  }, []);

  return (
    <div className="vscode-terminal">
      <div ref={terminalRef} className="h-full" />
    </div>
  );
};

export default Terminal;