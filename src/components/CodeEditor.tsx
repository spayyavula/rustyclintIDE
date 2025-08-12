import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import LiveCursors from './LiveCursors';
import { convertDartStringInterpolation } from '../utils/stringUtils';
import { getCachedData, setCache, CACHE_EXPIRATION, createCacheKey } from '../utils/cacheUtils';

interface CodeEditorProps {
  content: string;
  onChange: (content: string) => void;
  language: string;
  fileName: string;
  collaborators?: Array<{
    userId: string;
    userName: string;
    line: number;
    column: number;
    color: string;
  }>;
  onCursorChange?: (line: number, column: number) => void;
}

// Memoize the component to prevent unnecessary re-renders
const CodeEditor: React.FC<CodeEditorProps> = memo(({ 
  content, 
  onChange, 
  language, 
  fileName, 
  collaborators = [],
  onCursorChange 
}) => {
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [highlightedContent, setHighlightedContent] = useState<string>('');

  useEffect(() => {
    const lines = (content || '').split('\n').length;
    setLineNumbers(Array.from({ length: Math.max(lines, 20) }, (_, i) => i + 1));
  }, [content]);
  
  // Use cached syntax highlighting to improve performance
  useEffect(() => {
    const getHighlightedContent = async () => {
      if (!content || content.length === 0) {
        setHighlightedContent('');
        return;
      }
      
      // Use a hash of the content instead of the full content to avoid long keys
      const contentHash = String(content.length) + '-' + 
        (content.length > 100 ? content.substring(0, 50) + content.substring(content.length - 50) : content);
      
      const cacheKey = createCacheKey('syntax-highlight', language, contentHash);
      
      try {
        const highlighted = await getCachedData<string>(
          cacheKey,
          async () => syntaxHighlight(content),
          CACHE_EXPIRATION.LONG
        );
        
        setHighlightedContent(highlighted);
      } catch (error) {
        // Fallback to direct highlighting if caching fails
        setHighlightedContent(syntaxHighlight(content));
        console.warn('Syntax highlight cache failed, using direct highlighting');
      }
    };
    
    getHighlightedContent();
  }, [content, language]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!e.currentTarget) {
      return;
    }
    
    // Throttle scroll events to reduce performance impact
    if (e.currentTarget.dataset.scrolling === 'true') return;
    e.currentTarget.dataset.scrolling = 'true';
    const lineNumbersEl = document.querySelector('.line-numbers');
    if (lineNumbersEl) {
      try {
        lineNumbersEl.scrollTop = e.currentTarget.scrollTop;
      } catch (error) {
        console.warn('Error syncing line numbers scroll:', error);
      }
    }
    if (highlightRef.current) {
      try {
        highlightRef.current.scrollTop = e.currentTarget.scrollTop;
        highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
      } catch (error) {
        console.warn('Error syncing highlight scroll:', error);
      }
    }
    
    // Reset scrolling flag after a short delay
    setTimeout(() => {
      if (e.currentTarget) e.currentTarget.dataset.scrolling = 'false';
    }, 50);
  };

  const handleCursorMove = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    try {
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n') || [''];
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      setCursorPosition({ line, column });
      onCursorChange?.(line, column);
    } catch (error) {
      console.warn('Error tracking cursor position:', error);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newContent = e.target.value || '';

    // If this is a Dart file, automatically fix string interpolation issues
    if (language === 'dart' || fileName.endsWith('.dart')) {
      newContent = convertDartStringInterpolation(newContent);
    }
    
    onChange(newContent);
    handleCursorMove(e);
  };
  
  // Memoize the syntax highlighting function
  const syntaxHighlight = useCallback((code: string) => {
    if (!code || code.length === 0) return '';

    if (language === 'rust') {
      return code
        // Comments first (VS Code: #6A9955)
        .replace(/(\/\/.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Keywords (VS Code: #569CD6)
        .replace(/\b(fn|let|mut|pub|struct|impl|enum|match|if|else|while|for|loop|break|continue|return|use|mod|crate|super|self|const|static|unsafe|async|await|move|ref|dyn|where|type|trait)\b/g, '<span style="color: #569CD6; font-weight: 500;">$1</span>')
        // Types (VS Code: #4EC9B0)
        .replace(/\b(String|Vec|Option|Result|Box|Rc|Arc|HashMap|BTreeMap|i32|i64|u32|u64|f32|f64|bool|char|str|usize|isize)\b/g, '<span style="color: #4EC9B0;">$1</span>')
        // Macros (VS Code: #DCDCAA)
        .replace(/\b(println!|print!|dbg!|panic!|todo!|unimplemented!|unreachable!)\b/g, '<span style="color: #DCDCAA;">$1</span>')
        // Strings (VS Code: #CE9178)
        .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color: #CE9178;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #B5CEA8;">$1</span>')
        // Function names (VS Code: #DCDCAA)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
    }
    
    if (language === 'dart') {
      return code
        // Comments (VS Code: #6A9955)
        .replace(/(\/\/.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Keywords (VS Code: #569CD6)
        .replace(/\b(class|extends|implements|with|abstract|static|final|const|var|dynamic|void|int|double|String|bool|List|Map|Set|Future|Stream|async|await|yield|import|export|library|part|show|hide|as|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|rethrow|assert)\b/g, '<span style="color: #569CD6; font-weight: 500;">$1</span>')
        // Flutter/Dart types (VS Code: #4EC9B0)
        .replace(/\b(Widget|StatelessWidget|StatefulWidget|State|BuildContext|MaterialApp|Scaffold|AppBar|Container|Column|Row|Text|Button|FloatingActionButton)\b/g, '<span style="color: #4EC9B0;">$1</span>')
        // Annotations (VS Code: #9CDCFE)
        .replace(/(@override|@required|@deprecated)/g, '<span style="color: #9CDCFE;">$1</span>')
        // Strings (VS Code: #CE9178)
        .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span style="color: #CE9178;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #B5CEA8;">$1</span>')
        // Function names (VS Code: #DCDCAA)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
    }
    
    if (language === 'kotlin') {
      return code
        // Comments (VS Code: #6A9955)
        .replace(/(\/\/.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Keywords (VS Code: #569CD6)
        .replace(/\b(class|interface|object|enum|data|sealed|abstract|open|final|override|private|protected|public|internal|fun|val|var|const|lateinit|lazy|by|delegate|if|else|when|for|while|do|try|catch|finally|throw|return|break|continue|import|package)\b/g, '<span style="color: #569CD6; font-weight: 500;">$1</span>')
        // Types (VS Code: #4EC9B0)
        .replace(/\b(String|Int|Long|Float|Double|Boolean|Char|Byte|Short|Any|Unit|Nothing|List|MutableList|Set|MutableSet|Map|MutableMap|Array|IntArray)\b/g, '<span style="color: #4EC9B0;">$1</span>')
        // Annotations (VS Code: #9CDCFE)
        .replace(/(@\w+)/g, '<span style="color: #9CDCFE;">$1</span>')
        // Strings (VS Code: #CE9178)
        .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color: #CE9178;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #B5CEA8;">$1</span>')
        // Function names (VS Code: #DCDCAA)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
    }
    
    if (language === 'typescript' || language === 'javascript') {
      return code
        // Comments (VS Code: #6A9955)
        .replace(/(\/\/.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Keywords (VS Code: #569CD6)
        .replace(/\b(import|export|from|default|const|let|var|function|class|interface|type|enum|namespace|async|await|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static|readonly|abstract)\b/g, '<span style="color: #569CD6; font-weight: 500;">$1</span>')
        // Types and React (VS Code: #4EC9B0)
        .replace(/\b(string|number|boolean|object|undefined|null|void|any|unknown|never|Array|Promise|React|Component|useState|useEffect|useCallback|useMemo|StyleSheet|View|Text|TouchableOpacity|SafeAreaView|ScrollView)\b/g, '<span style="color: #4EC9B0;">$1</span>')
        // Decorators (VS Code: #9CDCFE)
        .replace(/(@\w+)/g, '<span style="color: #9CDCFE;">$1</span>')
        // Strings (VS Code: #CE9178)
        .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color: #CE9178;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #B5CEA8;">$1</span>')
        // Function names (VS Code: #DCDCAA)
        .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
    }
    
    if (language === 'java') {
      return code
        // Comments (VS Code: #6A9955)
        .replace(/(\/\/.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Keywords (VS Code: #569CD6)
        .replace(/\b(public|private|protected|static|final|abstract|class|interface|extends|implements|import|package|new|this|super|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|synchronized|volatile|transient|native|strictfp)\b/g, '<span style="color: #569CD6; font-weight: 500;">$1</span>')
        // Types (VS Code: #4EC9B0)
        .replace(/\b(String|int|long|float|double|boolean|char|byte|short|void|Object|List|Map|Set|Array|ArrayList|HashMap|HashSet|Intent|Bundle|Activity|Application|Context|View|TextView|Button|LinearLayout|RelativeLayout)\b/g, '<span style="color: #4EC9B0;">$1</span>')
        // Annotations (VS Code: #9CDCFE)
        .replace(/(@\w+)/g, '<span style="color: #9CDCFE;">$1</span>')
        // Strings (VS Code: #CE9178)
        .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color: #CE9178;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #B5CEA8;">$1</span>')
        // Function names (VS Code: #DCDCAA)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
    }
    
    if (language === 'objective-c') {
      return code
        // Comments (VS Code: #6A9955)
        .replace(/(\/\/.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Keywords (VS Code: #569CD6)
        // Comments (VS Code: #6A9955)
        .replace(/(\/\/.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Keywords (VS Code: #569CD6)
        .replace(/\b(@interface|@implementation|@end|@property|@synthesize|@dynamic|@protocol|@optional|@required|@class|@import|#import|#include|if|else|for|while|do|switch|case|break|continue|return|static|const|extern|typedef|struct|enum|union)\b/g, '<span style="color: #569CD6; font-weight: 500;">$1</span>')
        // Types (VS Code: #4EC9B0)
        .replace(/\b(NSString|NSArray|NSDictionary|NSNumber|NSObject|UIView|UIViewController|UIApplication|UIWindow|BOOL|NSInteger|CGFloat|CGRect|CGPoint|CGSize|id|void|int|float|double|char|long|short)\b/g, '<span style="color: #4EC9B0;">$1</span>')
        // Strings (VS Code: #CE9178)
        .replace(/(@"(?:[^"\\]|\\.)*")/g, '<span style="color: #CE9178;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #B5CEA8;">$1</span>')
        // Function names (VS Code: #DCDCAA)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
    }
    
    if (language === 'toml') {
      return code
        // Comments (VS Code: #6A9955)
        .replace(/(#.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Section headers (VS Code: #569CD6)
        .replace(/(\[.*\])/g, '<span style="color: #569CD6; font-weight: 500;">$1</span>')
        // Keys (VS Code: #9CDCFE)
        .replace(/^(\w+)\s*=/gm, '<span style="color: #9CDCFE;">$1</span>=')
        // Strings (VS Code: #CE9178)
        .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color: #CE9178;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #B5CEA8;">$1</span>');
    }
    
    if (language === 'xml') {
      return code
        // Comments (VS Code: #6A9955)
        .replace(/(<!--[\s\S]*?-->)/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Tags (VS Code: #569CD6)
        .replace(/(<\/?[a-zA-Z][^>]*>)/g, '<span style="color: #569CD6;">$1</span>')
        // Attributes (VS Code: #9CDCFE)
        .replace(/(\w+)=/g, '<span style="color: #9CDCFE;">$1</span>=')
        // Attribute values (VS Code: #CE9178)
        .replace(/="([^"]*)"/g, '="<span style="color: #CE9178;">$1</span>"');
    }
    
    if (language === 'json') {
      return code
        // Strings (VS Code: #CE9178)
        .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span style="color: #9CDCFE;">$1</span>:')
        .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span style="color: #CE9178;">$1</span>')
        // Types (VS Code: #4EC9B0)
        // Numbers (VS Code: #B5CEA8)
        // Strings (VS Code: #CE9178)
        .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color: #B5CEA8;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #B5CEA8;">$1</span>')
        // Function names (VS Code: #DCDCAA)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
    }
    
    if (language === 'python') {
      return code
        // Comments (VS Code: #6A9955)
        .replace(/(#.*$)/gm, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        .replace(/("""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\')/g, '<span style="color: #6A9955; font-style: italic;">$1</span>')
        // Keywords (VS Code: #569CD6)
        .replace(/\b(def|class|import|from|as|if|elif|else|for|while|try|except|finally|with|lambda|return|yield|break|continue|pass|raise|assert|del|global|nonlocal|and|or|not|in|is|True|False|None)\b/g, '<span style="color: #569CD6; font-weight: 500;">$1</span>')
        // Built-in functions and types (VS Code: #4EC9B0)
        .replace(/\b(print|len|range|enumerate|zip|map|filter|sum|max|min|abs|round|sorted|reversed|list|dict|set|tuple|str|int|float|bool|type|isinstance|hasattr|getattr|setattr|super|property|staticmethod|classmethod)\b/g, '<span style="color: #4EC9B0;">$1</span>')
        // Decorators (VS Code: #9CDCFE)
        .replace(/(@\w+)/g, '<span style="color: #9CDCFE;">$1</span>')
        // Strings (VS Code: #CE9178)
        .replace(/(f?"(?:[^"\\]|\\.)*"|f?'(?:[^'\\]|\\.)*'|f?"""[\s\S]*?"""|f?\'\'\'[\s\S]*?\'\'\')/g, '<span style="color: #CE9178;">$1</span>')
        // Numbers (VS Code: #B5CEA8)
        .replace(/\b(\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g, '<span style="color: #B5CEA8;">$1</span>')
        // Function definitions (VS Code: #DCDCAA)
        .replace(/\b(def\s+)([a-zA-Z_][a-zA-Z0-9_]*)/g, '$1<span style="color: #DCDCAA;">$2</span>')
        // Class definitions (VS Code: #4EC9B0)
        .replace(/\b(class\s+)([a-zA-Z_][a-zA-Z0-9_]*)/g, '$1<span style="color: #4EC9B0;">$2</span>')
        // Function calls (VS Code: #DCDCAA)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span style="color: #DCDCAA;">$1</span>');
    }

    return code;
  }, [language]);

  return (
    <div className="flex bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm h-full" role="region" aria-label="Code editor">
      <div 
        className="line-numbers bg-[#1e1e1e] px-4 py-4 text-[#858585] text-right select-none overflow-hidden border-r border-[#3e3e42] min-w-[4rem] flex flex-col"
        aria-hidden="true" 
        data-testid="line-numbers"
      >
        {content ? lineNumbers.map((num) => (
          <div key={num} className="leading-6 h-6">
            {num}
          </div>
        )) : (
          <div className="leading-6 h-6">1</div>
        )}
      </div>
      <div className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm relative">
        {content && collaborators && collaborators.length > 0 && <LiveCursors cursors={collaborators} currentFile={fileName} />}
        
        {/* Syntax highlighted background */}
        <div
          ref={highlightRef}
          className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words font-mono text-sm leading-6 overflow-auto"
          dangerouslySetInnerHTML={{ __html: content ? highlightedContent : '' }}
          style={{ 
            zIndex: 1, 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          aria-hidden="true"
        />
        
        {/* Transparent textarea for editing */}
        <textarea
          ref={textareaRef}
          className="absolute inset-0 w-full h-full p-4 bg-transparent resize-none outline-none font-mono text-sm leading-6 text-transparent caret-white selection:bg-[#264f78] overflow-auto"
          value={content}
          onChange={handleContentChange} 
          onInput={handleContentChange}
          onSelect={handleCursorMove}
          onScroll={content ? handleScroll : undefined}
          spellCheck={false}
          placeholder={fileName ? `Start coding in ${fileName}...` : 'Select a file to start coding...'}
          aria-label={`Code editor for ${fileName}`}
          style={{
            tabSize: 4,
            zIndex: 2
          }}
        />
      </div>
    </div>
  );
});

// Add display name for debugging
CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;