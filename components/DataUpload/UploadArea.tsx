import React, { useState, useRef } from 'react';
import { themeColors } from '@/lib/Theme/Colors';

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  onFileUpload,
  acceptedFileTypes = '.csv,.xlsx,.xls',
  maxFileSizeMB = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Проверка типа файла
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !acceptedFileTypes.includes(`.${fileExtension}`)) {
      setError(`Неподдерживаемый тип файла. Пожалуйста, загрузите ${acceptedFileTypes.replace(/,/g, ', ')} файл.`);
      return false;
    }

    // Проверка размера файла
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      setError(`Размер файла превышает ${maxFileSizeMB} МБ. Пожалуйста, загрузите файл меньшего размера.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mb-6">
      <div
        className={`border-2 border-dashed ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        } rounded-lg p-8 text-center transition-colors ${
          error ? 'border-red-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
      >
        <svg
          className={`mx-auto h-12 w-12 ${error ? 'text-red-400' : 'text-gray-400'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          <button
            type="button"
            className="font-medium hover:text-gray-700"
            style={{ color: themeColors.teal }}
            onClick={handleButtonClick}
          >
            Нажмите для выбора файла
          </button>{" "}
          или перетащите файл в эту область
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Поддерживаемые форматы: CSV, Excel (XLS, XLSX)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleFileInput}
        />
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadArea;