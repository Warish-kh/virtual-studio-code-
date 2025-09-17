import React, { useRef, useEffect, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useEditorStore } from '@/store/editorStore';
import { useTerminalStore } from '@/store/terminalStore';
import { useUIStore } from '@/store/uiStore';
import { Play, Terminal } from 'lucide-react';
import { useHistoryStore } from '@/store/historyStore';
import { useUser } from '@clerk/clerk-react';
import { editor as monacoEditor } from 'monaco-editor';

const EditorPane: React.FC = () => {
  const { state: editorState, updateTabContent, updateCursorPosition, saveTab } = useEditorStore();
  const { executeCode } = useTerminalStore();
  const { toggleTerminal } = useUIStore();
  const { addEntry } = useHistoryStore();
  const { user } = useUser();
  const { activeTabId, tabs } = editorState;
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isDOMReady, setIsDOMReady] = useState(false);
  
  // Handle Monaco editor mount
  const handleEditorDidMount = (editor: monacoEditor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Mark editor as ready
    setIsEditorReady(true);
    
    // Add event listeners
    editor.onDidChangeCursorPosition((e) => {
      updateCursorPosition(e.position.lineNumber, e.position.column);
    });
    
    // Handle keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeTabId) {
        saveTab(activeTabId);
        if (activeTab) {
          addEntry({
            userId: user?.id ?? 'anonymous',
            filePath: activeTab.filePath,
            fileName: activeTab.fileName,
            language: activeTab.language,
            content: activeTab.content,
          });
        }
      }
    });

    // Add Run Code shortcut (Ctrl+Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });

    // Enable Emmet for HTML files
    if (activeTab?.language === 'html') {
      // Configure Emmet settings
      monaco.languages.setLanguageConfiguration('html', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: {
          blockComment: ['<!--', '-->']
        },
        brackets: [
          ['<', '>'],
          ['{', '}'],
          ['[', ']']
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '<', close: '>' }
        ],
        surroundingPairs: [
          { open: '<', close: '>' },
          { open: '"', close: '"' },
          { open: "'", close: "'" }
        ]
      });

      // Helper function for Emmet abbreviations
      const handleEmmetAbbreviation = (editor: monacoEditor.IStandaloneCodeEditor, monaco: Monaco) => {
        const position = editor.getPosition();
        if (!position) return false;

        const lineContent = editor.getModel()?.getLineContent(position.lineNumber) || '';
        const beforeCursor = lineContent.substring(0, position.column - 1);
        
        // Check for Emmet abbreviations
        if (beforeCursor.trim() === '!') {
          // HTML5 boilerplate
          const htmlBoilerplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;
          
          // Replace the line with the boilerplate
          const range = new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1);
          editor.executeEdits('emmet', [{
            range: range,
            text: htmlBoilerplate
          }]);
          
          // Position cursor in the body
          editor.setPosition(new monaco.Position(9, 5));
          return true;
        }
        
        // Handle other common Emmet abbreviations
        const emmetPatterns = [
          { pattern: /^div$/, replacement: '<div></div>' },
          { pattern: /^p$/, replacement: '<p></p>' },
          { pattern: /^span$/, replacement: '<span></span>' },
          { pattern: /^ul$/, replacement: '<ul></ul>' },
          { pattern: /^li$/, replacement: '<li></li>' },
          { pattern: /^a$/, replacement: '<a href=""></a>' },
          { pattern: /^img$/, replacement: '<img src="" alt="">' },
          { pattern: /^input$/, replacement: '<input type="text">' },
          { pattern: /^button$/, replacement: '<button></button>' },
          { pattern: /^form$/, replacement: '<form></form>' },
          { pattern: /^table$/, replacement: '<table></table>' },
          { pattern: /^tr$/, replacement: '<tr></tr>' },
          { pattern: /^td$/, replacement: '<td></td>' },
          { pattern: /^th$/, replacement: '<th></th>' },
          { pattern: /^nav$/, replacement: '<nav></nav>' },
          { pattern: /^header$/, replacement: '<header></header>' },
          { pattern: /^footer$/, replacement: '<footer></footer>' },
          { pattern: /^main$/, replacement: '<main></main>' },
          { pattern: /^section$/, replacement: '<section></section>' },
          { pattern: /^article$/, replacement: '<article></article>' },
          { pattern: /^aside$/, replacement: '<aside></aside>' }
        ];
        
        for (const { pattern, replacement } of emmetPatterns) {
          if (pattern.test(beforeCursor.trim())) {
            const range = new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1);
            editor.executeEdits('emmet', [{
              range: range,
              text: replacement
            }]);
            
            // Position cursor inside the tag
            const cursorPos = replacement.indexOf('</') > -1 ? replacement.indexOf('</') : replacement.length;
            editor.setPosition(new monaco.Position(position.lineNumber, cursorPos + 1));
            return true;
          }
        }
        
        return false;
      };

      // Add Emmet abbreviation support for Tab
      editor.addCommand(monaco.KeyCode.Tab, () => {
        const handled = handleEmmetAbbreviation(editor, monaco);
        if (!handled) {
          editor.trigger('keyboard', 'tab', {});
        }
      });
      
      // Add Emmet abbreviation support for Enter
      editor.addCommand(monaco.KeyCode.Enter, () => {
        const handled = handleEmmetAbbreviation(editor, monaco);
        if (!handled) {
          editor.trigger('keyboard', 'enter', {});
        }
      });
    }
    
    // Enable Emmet for CSS files
    if (activeTab?.language === 'css') {
      // Add CSS Emmet abbreviations
      editor.addCommand(monaco.KeyCode.Tab, () => {
        const position = editor.getPosition();
        if (!position) return;

        const lineContent = editor.getModel()?.getLineContent(position.lineNumber) || '';
        const beforeCursor = lineContent.substring(0, position.column - 1);
        
        // CSS Emmet patterns
        const cssEmmetPatterns = [
          { pattern: /^m$/, replacement: 'margin: ;' },
          { pattern: /^p$/, replacement: 'padding: ;' },
          { pattern: /^d$/, replacement: 'display: ;' },
          { pattern: /^pos$/, replacement: 'position: ;' },
          { pattern: /^bg$/, replacement: 'background: ;' },
          { pattern: /^c$/, replacement: 'color: ;' },
          { pattern: /^w$/, replacement: 'width: ;' },
          { pattern: /^h$/, replacement: 'height: ;' },
          { pattern: /^f$/, replacement: 'font: ;' },
          { pattern: /^fs$/, replacement: 'font-size: ;' },
          { pattern: /^fw$/, replacement: 'font-weight: ;' },
          { pattern: /^ff$/, replacement: 'font-family: ;' },
          { pattern: /^b$/, replacement: 'border: ;' },
          { pattern: /^br$/, replacement: 'border-radius: ;' },
          { pattern: /^t$/, replacement: 'top: ;' },
          { pattern: /^r$/, replacement: 'right: ;' },
          { pattern: /^b$/, replacement: 'bottom: ;' },
          { pattern: /^l$/, replacement: 'left: ;' },
          { pattern: /^z$/, replacement: 'z-index: ;' },
          { pattern: /^o$/, replacement: 'opacity: ;' },
          { pattern: /^v$/, replacement: 'visibility: ;' },
          { pattern: /^cur$/, replacement: 'cursor: ;' },
          { pattern: /^out$/, replacement: 'outline: ;' },
          { pattern: /^box$/, replacement: 'box-shadow: ;' },
          { pattern: /^text$/, replacement: 'text-align: ;' },
          { pattern: /^td$/, replacement: 'text-decoration: ;' },
          { pattern: /^tt$/, replacement: 'text-transform: ;' },
          { pattern: /^ls$/, replacement: 'list-style: ;' },
          { pattern: /^fl$/, replacement: 'float: ;' },
          { pattern: /^cl$/, replacement: 'clear: ;' },
          { pattern: /^ov$/, replacement: 'overflow: ;' },
          { pattern: /^wh$/, replacement: 'white-space: ;' },
          { pattern: /^va$/, replacement: 'vertical-align: ;' },
          { pattern: /^ta$/, replacement: 'text-align: ;' },
          { pattern: /^ti$/, replacement: 'text-indent: ;' },
          { pattern: /^lh$/, replacement: 'line-height: ;' },
          { pattern: /^ws$/, replacement: 'word-spacing: ;' },
          { pattern: /^ls$/, replacement: 'letter-spacing: ;' }
        ];
        
        for (const { pattern, replacement } of cssEmmetPatterns) {
          if (pattern.test(beforeCursor.trim())) {
            const range = new monaco.Range(position.lineNumber, 1, position.lineNumber, lineContent.length + 1);
            editor.executeEdits('emmet', [{
              range: range,
              text: replacement
            }]);
            
            // Position cursor before the semicolon
            const cursorPos = replacement.indexOf(';');
            editor.setPosition(new monaco.Position(position.lineNumber, cursorPos));
            return;
          }
        }
        
        // Default tab behavior
        editor.trigger('keyboard', 'tab', {});
      });
    }
    
    // Ensure proper layout after mount with multiple attempts
    const layoutEditor = () => {
      if (editor && containerRef.current) {
        try {
          editor.layout();
        } catch (error) {
          console.warn('Editor layout failed, retrying...', error);
          setTimeout(layoutEditor, 100);
        }
      }
    };
    
    // Try layout immediately and then with delays
    layoutEditor();
    setTimeout(layoutEditor, 50);
    setTimeout(layoutEditor, 200);
  };
  
  // Handle content changes
  const handleEditorChange = (value: string | undefined) => {
    if (activeTabId && value !== undefined) {
      updateTabContent(activeTabId, value);
    }
  };

  // Handle run code
  const handleRunCode = async () => {
    if (!activeTab) return;
    
    // Open terminal if not already open
    toggleTerminal();
    
    // Wait a bit for terminal to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Execute code immediately and display in terminal
    try {
      const result = await executeCode(activeTab.content, activeTab.language);
      addEntry({
        userId: user?.id ?? 'anonymous',
        filePath: activeTab.filePath,
        fileName: activeTab.fileName,
        language: activeTab.language,
        content: activeTab.content,
      });
      
      // Find the terminal element and write to it
      const terminalElement = document.querySelector('.vscode-terminal .xterm');
      if (terminalElement) {
        // Create a custom event to write to terminal
        const writeEvent = new CustomEvent('terminal-write', {
          detail: {
            command: `run ${activeTab.language} ${activeTab.fileName}`,
            output: result,
            error: null
          }
        });
        terminalElement.dispatchEvent(writeEvent);
      } else {
        // Fallback: write to terminal store history
        useTerminalStore.getState().writeToTerminal(`$ run ${activeTab.language} ${activeTab.fileName}`);
        useTerminalStore.getState().writeToTerminal(`Output:`);
        useTerminalStore.getState().writeToTerminal(result);
      }
      
    } catch (error) {
      console.error('Error running code:', error);
      
      // Find the terminal element and write error to it
      const terminalElement = document.querySelector('.vscode-terminal .xterm');
      if (terminalElement) {
        const writeEvent = new CustomEvent('terminal-write', {
          detail: {
            command: `run ${activeTab.language} ${activeTab.fileName}`,
            output: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
        terminalElement.dispatchEvent(writeEvent);
      } else {
        // Fallback: write error to terminal store history
        useTerminalStore.getState().writeToTerminal(`$ run ${activeTab.language} ${activeTab.fileName}`);
        useTerminalStore.getState().writeToTerminal(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  // Handle container resize
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    const handleResize = () => {
      updateContainerSize();
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener('resize', handleResize);

    // Use ResizeObserver for more accurate container size tracking
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateContainerSize();
        if (editorRef.current) {
          editorRef.current.layout();
        }
      });
      resizeObserver.observe(containerRef.current);
    }
    
    // Initial size update
    updateContainerSize();
    
    // Mark DOM as ready after a delay
    const domReadyTimer = setTimeout(() => {
      setIsDOMReady(true);
    }, 200);
    
    // Trigger layout after a short delay to ensure container is ready
    const timer = setTimeout(() => {
      updateContainerSize();
      if (editorRef.current) {
        editorRef.current.layout();
      }
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearTimeout(timer);
      clearTimeout(domReadyTimer);
    };
  }, []);
  
  if (!activeTab) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">No file open</div>;
  }
  
  // Compute language from filename each render to keep in sync with renames
  const computedLanguage = (() => {
    const name = activeTab?.fileName || '';
    const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() : '';
    const map: Record<string, string> = {
      js: 'javascript', jsx: 'javascript',
      ts: 'typescript', tsx: 'typescript',
      html: 'html', css: 'css', json: 'json', md: 'markdown',
      py: 'python', java: 'java', c: 'c', cpp: 'cpp', cs: 'csharp', go: 'go',
      php: 'php', rb: 'ruby', rs: 'rust', sh: 'shell', sql: 'sql', swift: 'swift',
      xml: 'xml', yaml: 'yaml', yml: 'yaml'
    };
    return (ext && map[ext]) ? map[ext] : 'plaintext';
  })();

  return (
    <div className="h-full w-full flex flex-col">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {activeTab.fileName} ({activeTab.language})
          </span>
          {activeTab.isDirty && (
            <span className="text-xs text-orange-500">●</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunCode}
            className="flex items-center space-x-2 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
            title={activeTab.language === 'html' ? 'Open in Browser (Ctrl+Enter)' : 'Run Code (Ctrl+Enter)'}
          >
            <Play className="h-4 w-4" />
            <span>{activeTab.language === 'html' ? 'Open in Browser' : 'Run Code'}</span>
          </button>
          
          <button
            onClick={toggleTerminal}
            className="flex items-center space-x-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
            title="Toggle Terminal"
          >
            <Terminal className="h-4 w-4" />
            <span>Terminal</span>
          </button>
        </div>
      </div>
      
      {/* Monaco Editor */}
      <div ref={containerRef} className="flex-1 relative min-h-0">
        {!isEditorReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="text-sm text-muted-foreground">Loading editor...</div>
          </div>
        )}
        {isDOMReady && containerSize.width > 0 && containerSize.height > 0 && (
          <Editor
            height={containerSize.height}
            width={containerSize.width}
            language={computedLanguage}
            value={activeTab.content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light'}
            options={{
              fontSize: 14,
              wordWrap: 'on',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              scrollbar: {
                verticalScrollbarSize: 12,
                horizontalScrollbarSize: 12,
              },
              // Additional options to prevent rendering issues
              fixedOverflowWidgets: true,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              renderValidationDecorations: 'on',
              // Ensure proper initialization
              ariaLabel: 'Code Editor',
              accessibilitySupport: 'auto'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EditorPane;