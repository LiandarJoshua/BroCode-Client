import React, { useState, useCallback, useEffect, useRef } from 'react';
import { File, Code } from 'lucide-react';
import Quill from 'quill';
import "quill/dist/quill.snow.css";

const COLORS = [
  "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
  "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
  "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
  "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"
];

const EditorTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => onTabChange('code')}
            className={`flex items-center px-4 py-2 rounded-t-lg ${
              activeTab === 'code'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Code className="w-4 h-4 mr-2" />
            Code Editor
          </button>
          <button
            onClick={() => onTabChange('document')}
            className={`flex items-center px-4 py-2 rounded-t-lg ${
              activeTab === 'document'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <File className="w-4 h-4 mr-2" />
            Document
          </button>
        </div>
      </div>
    </div>
  );
};

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: COLORS }, { background: COLORS }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const SAVE_INTERVAL_MS = 2000;

const DocumentEditor = ({ socketRef, roomId, editorRef }) => {
  const [quill, setQuill] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeEditor, setActiveEditor] = useState('document');
  const [users, setUsers] = useState([]);
  const documentContentRef = useRef(null);
  const lastSavedDocumentContent = useRef(null);
  
  // Handle tab change with content preservation
  const handleTabChange = (newTab) => {
    if (quill && activeEditor === 'document') {
      // Save document content to ref before switching from document
      lastSavedDocumentContent.current = quill.getContents();
    }
    setActiveEditor(newTab);
  };

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return;
    
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    
    const q = new Quill(editor, {
      theme: "snow",
      modules: { 
        toolbar: {
          container: TOOLBAR_OPTIONS,
          handlers: {
            color: function(value) {
              q.format('color', value);
            },
            background: function(value) {
              q.format('background', value);
            }
          }
        }
      },
    });
    
    // Add custom CSS
    const style = document.createElement('style');
    style.innerHTML = `
      .ql-color .ql-picker-options,
      .ql-background .ql-picker-options {
        display: none !important;
        padding: 3px 5px;
        width: 152px;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 5px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 1000;
      }
      
      .ql-color .ql-picker-label:hover + .ql-picker-options,
      .ql-background .ql-picker-label:hover + .ql-picker-options,
      .ql-picker-options:hover {
        display: grid !important;
      }
      
      .ql-color .ql-picker-item,
      .ql-background .ql-picker-item {
        width: 20px !important;
        height: 20px !important;
        border-radius: 3px;
        cursor: pointer;
        transition: transform 0.1s ease;
      }

      .ql-color .ql-picker-item:hover,
      .ql-background .ql-picker-item:hover {
        transform: scale(1.2);
      }

      .ql-picker-label {
        padding: 2px 4px;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
      }

      .ql-picker-label:hover {
        background-color: #f5f5f5;
      }

      .ql-toolbar.ql-snow {
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        background-color: white;
        padding: 8px;
      }

      .ql-toolbar.ql-snow + .ql-container.ql-snow {
        border-top: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    `;
    document.head.appendChild(style);
    
    q.setText("Loading...");
    setQuill(q);
  }, []);

  // Load document when first initialized or when switching back to document tab
  useEffect(() => {
    if (quill && activeEditor === 'document') {
      if (lastSavedDocumentContent.current) {
        // Restore content from ref if available
        quill.setContents(lastSavedDocumentContent.current);
      } else if (documentContentRef.current) {
        // Use document content from the initial load
        quill.setContents(documentContentRef.current);
      }
    }
  }, [activeEditor, quill]);

  // Initial document loading from socket
  useEffect(() => {
    if (socketRef.current == null || quill == null || isLoaded) return;

    socketRef.current.once("load-document", document => {
      const documentContent = document || { ops: [] };
      quill.setContents(documentContent);
      documentContentRef.current = documentContent;
      lastSavedDocumentContent.current = documentContent;
      quill.enable();
      setIsLoaded(true);
    });

    socketRef.current.emit("get-document", roomId);
  }, [socketRef, quill, roomId]);

  // Periodically save document to server
  useEffect(() => {
    if (socketRef.current == null || quill == null || !isLoaded || activeEditor !== 'document') return;

    const interval = setInterval(() => {
      const currentContent = quill.getContents();
      socketRef.current.emit("save-document", currentContent);
      // Update the saved content reference
      lastSavedDocumentContent.current = currentContent;
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socketRef, quill, isLoaded, activeEditor]);

  // Handle receiving changes from other users
  useEffect(() => {
    if (socketRef.current == null || quill == null || !isLoaded) return;

    const handler = delta => {
      if (activeEditor === 'document') {
        quill.updateContents(delta);
      } else {
        // If we're on code editor, update the saved content ref without applying changes to editor
        if (lastSavedDocumentContent.current) {
          // Apply delta to stored content (simplified)
          // This is a simplified approach - for full correctness, you'd need to
          // properly apply the delta to the stored document
          socketRef.current.once("load-document", document => {
            lastSavedDocumentContent.current = document;
          });
          socketRef.current.emit("get-document", roomId);
        }
      }
    };

    socketRef.current.on("receive-changes", handler);
    return () => socketRef.current.off("receive-changes", handler);
  }, [socketRef, quill, isLoaded, activeEditor, roomId]);

  // Send changes to server when user edits document
  useEffect(() => {
    if (socketRef.current == null || quill == null || !isLoaded || activeEditor !== 'document') return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socketRef.current.emit("send-changes", delta);
      // Update our local saved copy
      lastSavedDocumentContent.current = quill.getContents();
    };

    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [socketRef, quill, isLoaded, activeEditor]);

  return (
    <div className="flex flex-col h-full">
      <EditorTabs
        activeTab={activeEditor}
        onTabChange={handleTabChange}
      />
      <div className="flex-1">
        {activeEditor === 'document' ? (
          <div className={`${activeEditor === 'document' ? 'block' : 'hidden'} fixed inset-0 bg-white`}>
            <div className="h-full" ref={wrapperRef}></div>
          </div>
        ) : (
          <div className={`h-full ${activeEditor === 'code' ? 'block' : 'hidden'}`} ref={editorRef}></div>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;