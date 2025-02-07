import React, { useEffect, useRef } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';

// Configuration du chargement de Monaco avec un CDN plus stable
loader.config({
  paths: {
    vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs'
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'fr'
    }
  }
});

interface EditorProps {
  selectedFile: string | null;
}

const demoContent: Record<string, string> = {
  'App.tsx': `import React from 'react';

function App() {
  return (
    <div>
      <h1>Bonjour le monde!</h1>
    </div>
  );
}

export default App;`,
  'main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/root';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  'styles.css': `body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}`,
  'package.json': `{
  "name": "mon-projet",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`,
  'README.md': `# Mon Projet

Ceci est un exemple de projet créé avec React.`,
  'index.html': `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mon Application</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
};

export const Editor: React.FC<EditorProps> = ({ selectedFile }) => {
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  const getLanguage = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) return 'typescript';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        if (editorRef.current?.layout) {
          editorRef.current.layout();
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const handleEditorWillMount = (monaco: any) => {
    // Configuration TypeScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Ajout des définitions de types React
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module 'react' {
        export = React;
      }
      declare namespace React {
        export interface Element {}
        export interface ReactElement<P = any> extends Element {}
        export function createElement(type: any, props?: any, ...children: any[]): ReactElement;
      }
      `,
      'file:///node_modules/@types/react/index.d.ts'
    );
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Configuration de l'éditeur après le montage
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      wordWrap: 'on',
      automaticLayout: false, // Désactivé pour gérer manuellement le redimensionnement
      tabSize: 2,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      formatOnPaste: true,
      formatOnType: true,
      suggest: {
        showWords: true,
        showSnippets: true,
        showUsers: true,
        preview: true,
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      accessibilitySupport: 'on',
      autoIndent: 'full',
      dragAndDrop: true,
      links: true,
      mouseWheelZoom: true,
    });

    // Force initial layout
    setTimeout(() => {
      editor.layout();
    }, 100);
  };

  return (
    <div ref={containerRef} className="h-full bg-gray-900">
      {selectedFile ? (
        <MonacoEditor
          height="100%"
          language={getLanguage(selectedFile)}
          value={demoContent[selectedFile] || '// Sélectionnez un fichier pour commencer'}
          theme="vs-dark"
          options={{
            readOnly: false,
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
          }}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          loading={
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="animate-pulse">Chargement de l'éditeur...</div>
            </div>
          }
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Sélectionnez un fichier pour commencer l'édition
        </div>
      )}
    </div>
  );
};
