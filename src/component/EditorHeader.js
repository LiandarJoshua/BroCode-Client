import React from 'react';
import { File, Terminal } from 'lucide-react';

const EditorHeader = ({ 
  isCompileWindowOpen, 
  setIsCompileWindowOpen,
  isDocumentOpen,
  setIsDocumentOpen,
  selectedLanguage,
  onLanguageChange,
  supportedLanguages
}) => {
  return (
    <div className="bg-gray-800 p-3 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <select 
          className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1.5"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        
        {/* Toggle Buttons */}
        <button 
          onClick={() => setIsCompileWindowOpen(!isCompileWindowOpen)}
          className={`flex items-center px-4 py-1.5 rounded-md transition-colors ${
            isCompileWindowOpen 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Terminal className="w-4 h-4 mr-2" />
          {isCompileWindowOpen ? 'Hide Compiler' : 'Show Compiler'}
        </button>
        
        <button 
          onClick={() => setIsDocumentOpen(!isDocumentOpen)}
          className={`flex items-center px-4 py-1.5 rounded-md transition-colors ${
            isDocumentOpen 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <File className="w-4 h-4 mr-2" />
          {isDocumentOpen ? 'Hide Document' : 'Show Document'}
        </button>
      </div>
    </div>
  );
};

export default EditorHeader;