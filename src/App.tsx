import React, { useState } from 'react';
import Split from 'split.js';
import { FileExplorer } from './components/FileExplorer.tsx';
import { Editor } from './components/Editor.tsx';
import { Code2, Play, Settings, Save, Download, Upload, Terminal } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);

  React.useEffect(() => {
    Split(['#sidebar', '#main-content'], {
      sizes: [20, 80],
      minSize: [200, 400],
      gutterSize: 8,
      cursor: 'col-resize',
    });

    if (showTerminal) {
      Split(['#editor-container', '#terminal'], {
        direction: 'vertical',
        sizes: [70, 30],
        minSize: [200, 100],
        gutterSize: 8,
        cursor: 'row-resize',
      });
    }
  }, [showTerminal]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* En-tête */}
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <div className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-blue-400" />
          <span className="font-semibold">WebIDE en ligne</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-3 py-1 hover:bg-gray-700 rounded text-sm">
            <Save className="h-4 w-4 mr-1" />
            <span>Sauvegarder</span>
          </button>
          <button className="flex items-center px-3 py-1 hover:bg-gray-700 rounded text-sm">
            <Play className="h-4 w-4 mr-1" />
            <span>Exécuter</span>
          </button>
          <button className="flex items-center px-3 py-1 hover:bg-gray-700 rounded text-sm">
            <Download className="h-4 w-4 mr-1" />
            <span>Exporter</span>
          </button>
          <button className="flex items-center px-3 py-1 hover:bg-gray-700 rounded text-sm">
            <Upload className="h-4 w-4 mr-1" />
            <span>Importer</span>
          </button>
          <button 
            className="flex items-center px-3 py-1 hover:bg-gray-700 rounded text-sm"
            onClick={() => setShowTerminal(!showTerminal)}
          >
            <Terminal className="h-4 w-4 mr-1" />
            <span>Terminal</span>
          </button>
          <button className="p-2 hover:bg-gray-700 rounded">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Contenu Principal */}
      <div className="flex-1 flex">
        <div id="sidebar" className="h-full">
          <FileExplorer onFileSelect={setSelectedFile} />
        </div>
        <div id="main-content" className="h-full flex flex-col">
          <div id="editor-container" className="flex-1">
            <Editor selectedFile={selectedFile} />
          </div>
          {showTerminal && (
            <div id="terminal" className="h-[30%] bg-black p-2 font-mono text-sm">
              <div className="text-gray-400">Terminal</div>
              <div className="text-green-400">$ _</div>
            </div>
          )}
        </div>
      </div>

      {/* Barre d'état */}
      <footer className="h-6 bg-gray-800 border-t border-gray-700 flex items-center px-4 text-sm text-gray-400">
        <div>{selectedFile || 'Aucun fichier sélectionné'}</div>
        <div className="flex-1" />
        <div>Ligne: 1, Colonne: 1</div>
        <div className="mx-4">|</div>
        <div>UTF-8</div>
        <div className="mx-4">|</div>
        <div>TypeScript</div>
      </footer>
    </div>
  );
}

export default App;
