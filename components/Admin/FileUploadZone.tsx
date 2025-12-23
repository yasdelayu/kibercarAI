
import React, { useState, useRef } from 'react';
import { Upload, FileType } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
        isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleInputChange} 
        className="hidden" 
        accept=".pdf,.txt,.md"
      />
      <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
        <Upload className="w-8 h-8" />
      </div>
      <p className="font-medium text-slate-200 mb-1">Click or drag & drop files here</p>
      <p className="text-xs text-slate-500">Maximum file size 50MB</p>
      
      <div className="mt-6 flex items-center space-x-2">
        <span className="flex items-center space-x-1 px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">
          <FileType className="w-3 h-3" />
          <span>PDF</span>
        </span>
        <span className="flex items-center space-x-1 px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">
          <FileType className="w-3 h-3" />
          <span>TXT</span>
        </span>
        <span className="flex items-center space-x-1 px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">
          <FileType className="w-3 h-3" />
          <span>MD</span>
        </span>
      </div>
    </div>
  );
};

export default FileUploadZone;
