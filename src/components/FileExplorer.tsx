import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { getCachedData, setCache, CACHE_EXPIRATION, createCacheKey } from '../utils/cacheUtils';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

interface FileExplorerProps {
  onFileSelect: (filePath: string) => void;
  selectedFile: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect, selectedFile }) => {
  const initialFileTree: FileNode[] = [
    {
      name: 'mobile-rust-app',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            { name: 'main.rs', type: 'file' },
            { name: 'lib.rs', type: 'file' },
            { name: 'mobile_utils.rs', type: 'file' },
            { name: 'ui.rs', type: 'file' },
            { name: 'platform.rs', type: 'file' },
          ],
        },
        {
          name: 'platforms',
          type: 'folder',
          isOpen: true,
          children: [
            {
              name: 'android',
              type: 'folder',
              isOpen: false,
              children: [
                { name: 'MainActivity.kt', type: 'file' },
                { name: 'AndroidManifest.xml', type: 'file' },
                { name: 'build.gradle', type: 'file' },
              ],
            },
            {
              name: 'ios',
              type: 'folder',
              isOpen: false,
              children: [
                { name: 'AppDelegate.swift', type: 'file' },
                { name: 'ViewController.swift', type: 'file' },
                { name: 'Info.plist', type: 'file' },
              ],
            },
            {
              name: 'flutter',
              type: 'folder',
              isOpen: false,
              children: [
                { name: 'main.dart', type: 'file' },
                { name: 'pubspec.yaml', type: 'file' },
                { name: 'bridge.rs', type: 'file' },
              ],
            },
          ],
        },
        {
          name: 'tests',
          type: 'folder',
          isOpen: false,
          children: [
            { name: 'integration_test.rs', type: 'file' },
            { name: 'ui_test.rs', type: 'file' },
          ],
        },
        {
          name: 'assets',
          type: 'folder',
          isOpen: false,
          children: [
            { name: 'icons', type: 'folder' },
            { name: 'images', type: 'folder' },
            { name: 'fonts', type: 'folder' },
          ],
        },
        { name: 'Cargo.toml', type: 'file' },
        { name: 'Cargo.lock', type: 'file' },
        { name: 'flutter_rust_bridge.yaml', type: 'file' },
        { name: 'README.md', type: 'file' },
      ],
    },
  ];
  
  const [fileTree, setFileTree] = useState<FileNode[]>(initialFileTree);

  // Load file tree from cache on mount
  useEffect(() => {
    const loadFileTree = async () => {
      const cacheKey = createCacheKey('file-explorer', 'tree', 'v2');
      try {
        const cachedTree = await getCachedData<FileNode[]>(
          cacheKey,
          async () => initialFileTree,
          CACHE_EXPIRATION.VERY_LONG
        );
        
        if (cachedTree && Array.isArray(cachedTree)) {
          setFileTree(cachedTree);
        } else {
          console.warn('Invalid file tree data in cache, using initial tree');
          setFileTree(initialFileTree);
        }
      } catch (error) {
        console.error('Error loading file tree:', error);
        setFileTree(initialFileTree);
      }
    };
    
    loadFileTree();
  }, []);
  
  // Save file tree to cache when it changes
  useEffect(() => {
    const saveFileTree = async () => {
      const cacheKey = createCacheKey('file-explorer', 'tree', 'v2');
      try {
        await setCache(cacheKey, fileTree, CACHE_EXPIRATION.VERY_LONG);
      } catch (error) {
        console.error('Error saving file tree:', error);
      }
    };
    
    saveFileTree();
  }, [fileTree]);

  const toggleFolder = (path: number[]) => {
    const updateNode = (nodes: FileNode[], currentPath: number[]): FileNode[] => {
      return [...nodes].map((node, index) => {
        if (index === currentPath[0]) {
          if (currentPath.length === 1) {
            return { ...node, isOpen: !node.isOpen };
          } else if (node.children) {
            return {
              ...node,
              children: updateNode(node.children, currentPath.slice(1)),
            };
          }
        }
        return node;
      });
    };
    setFileTree(updateNode(JSON.parse(JSON.stringify(fileTree)), path));
  };

  const renderNode = (node: FileNode, path: number[] = [], depth = 0) => {
    const fullPath = [...path.map(String), node.name].join('/');
    const isSelected = selectedFile === fullPath;
    const nodeId = `node-${fullPath.replace(/[^a-zA-Z0-9]/g, '-')}`;

    return (
      <div key={fullPath} role={node.type === 'folder' ? 'treeitem' : 'none'} aria-expanded={node.type === 'folder' ? node.isOpen : undefined}>
        <div
          className={`flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm ${
            isSelected ? 'bg-blue-600/30 text-blue-300' : 'text-gray-300'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(path);
            } else {
              onFileSelect(fullPath);
            }
          }}
          id={nodeId}
          role={node.type === 'file' ? 'treeitem' : undefined}
          aria-selected={node.type === 'file' ? isSelected : undefined}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (node.type === 'folder') {
                toggleFolder(path);
              } else {
                onFileSelect(fullPath);
              }
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="w-4 h-4 mr-1" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" aria-hidden="true" />
              )}
              {node.isOpen ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-400" aria-hidden="true" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-blue-400" aria-hidden="true" />
              )}
            </>
          ) : (
            <>
              <div className="w-4 mr-1" />
              <File className="w-4 h-4 mr-2 text-orange-400" aria-hidden="true" />
            </>
          )}
          <span>{node.name}</span>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div role="group">
            {node.children.map((child, index) =>
              renderNode(child, [...path, index], depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Add this function inside your FileExplorer component (not at the bottom)
  const handleImportRepo = async () => {
    // Prompt for repo details (replace with your own UI as needed)
    const owner = prompt('GitHub owner/org (e.g. facebook):');
    const repo = prompt('Repo name (e.g. react):');
    const branch = prompt('Branch (default: main):') || 'main';
    const workspaceDir = '/absolute/path/to/workspace'; // Replace with your actual workspace path

    if (!owner || !repo) return;

    const res = await fetch('/api/download-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner, repo, branch, workspaceDir }),
    });
    if (!res.ok) {
      return;
    }
    // Refresh file tree after import
    refreshFileTree();
  };

  // Handle file/folder upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    // TODO: Implement upload logic here, e.g., send files to backend or update fileTree state
    alert(`${files.length} file(s) selected for upload (upload logic not implemented).`);
    // Optionally, refresh file tree after upload
    // refreshFileTree();
  };

  // Smarter refreshFileTree: reload file tree from cache or backend
  const refreshFileTree = async () => {
    const cacheKey = createCacheKey('file-explorer', 'tree', 'v2');
    try {
      const cachedTree = await getCachedData<FileNode[]>(
        cacheKey,
        async () => initialFileTree,
        CACHE_EXPIRATION.VERY_LONG
      );
      if (cachedTree && Array.isArray(cachedTree)) {
        setFileTree(cachedTree);
      } else {
        setFileTree(initialFileTree);
      }
    } catch (error) {
      setFileTree(initialFileTree);
    }
  };

  return (
    <div className="w-64 bg-[#23272e] border-r border-[#222] h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#222]">
        <span className="text-xs font-semibold text-[#d4d4d4]">EXPLORER</span>
        <button
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          onClick={handleImportRepo}
          title="Import GitHub Repo"
        >
          Import Repo
        </button>
      </div>
      <div className="px-3 py-2 border-b border-[#222]">
        <label className="block cursor-pointer text-xs text-blue-400 hover:underline">
          Upload Files/Folders
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
            ref={input => {
              if (input) {
                (input as any).webkitdirectory = true;
                (input as any).directory = true;
              }
            }}
          />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {fileTree.map((node, index) => renderNode(node, [index]))}
      </div>
    </div>
  );
};

// Refactored: Use backend API for repo download
export async function downloadAndExtractRepo(owner: string, repo: string, branch: string, workspaceDir: string) {
  const response = await fetch('/api/download-repo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo, branch, workspaceDir })
  });
  if (!response.ok) {
    throw new Error('Failed to download and extract repo');
  }
  return response.json();
}

export default FileExplorer;