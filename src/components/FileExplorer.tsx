import React from 'react';
import { Folder, File, ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface FileExplorerProps {
  onFileSelect: (fileName: string) => void;
}

const demoFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'App.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' },
      { name: 'styles.css', type: 'file' },
    ],
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'index.html', type: 'file' },
      { name: 'favicon.ico', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];

const FileTreeNode: React.FC<{ node: FileNode; level: number; onFileSelect: (fileName: string) => void }> = ({
  node,
  level,
  onFileSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.name);
    }
  };

  return (
    <div style={{ marginLeft: `${level * 12}px` }}>
      <div
        className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer rounded group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="mr-1">
          {node.type === 'folder' ? (
            isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : null}
        </span>
        {node.type === 'folder' ? (
          <Folder size={16} className="mr-2 text-blue-400" />
        ) : (
          <File size={16} className="mr-2 text-gray-400" />
        )}
        <span className="text-sm flex-1">{node.name}</span>
        {isHovered && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 hover:bg-gray-600 rounded">
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        )}
      </div>
      {node.type === 'folder' && isOpen && node.children?.map((child, index) => (
        <FileTreeNode
          key={index}
          node={child}
          level={level + 1}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  return (
    <div className="h-full bg-gray-800 text-gray-300 p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-sm font-semibold">Explorateur</span>
        <button className="p-1 hover:bg-gray-700 rounded">
          <Plus size={16} />
        </button>
      </div>
      {demoFiles.map((node, index) => (
        <FileTreeNode
          key={index}
          node={node}
          level={0}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};
