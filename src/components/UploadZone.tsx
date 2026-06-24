'use client';

import { useRef, useState, DragEvent } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; preview: string } | null>(null);

  const handleFile = (file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Please upload a JPG or PNG image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile({
        name: file.name,
        size: formatBytes(file.size),
        preview: e.target?.result as string,
      });
      onFileSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <section className="pb-12" id="how">
      <div className="max-w-[640px] mx-auto px-6">
        <div
          className={`border-2 border-dashed rounded-[20px] py-12 px-6 text-center cursor-pointer transition-all bg-white ${
            isDragOver
              ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
              : 'border-gray-200 hover:border-emerald-600 hover:bg-emerald-50'
          } ${uploadedFile ? 'border-solid border-gray-200 p-4' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="sr-only"
            accept="image/jpeg,image/png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {uploadedFile ? (
            <div className="flex items-center gap-4">
              <img
                src={uploadedFile.preview}
                alt="Uploaded"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{uploadedFile.name}</p>
                <p className="text-xs text-gray-400">{uploadedFile.size}</p>
                <p className="text-[13px] text-emerald-600 font-medium mt-0.5">Click to change photo</p>
              </div>
            </div>
          ) : (
            <>
              {/* 上传前引导说明 */}
              <div className="mb-6">
                <p className="font-bold text-lg mb-3">Upload Your Photo</p>
                <div className="flex flex-wrap justify-center gap-3 text-[13px] text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>Clear front-facing photo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>White background recommended</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>No sunglasses or hats</span>
                  </div>
                </div>
              </div>

              <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center transition-all group-hover:bg-emerald-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="font-semibold text-[15px] mb-1">Drop your photo here or click to browse</p>
              <p className="text-xs text-gray-400 mt-3">Supports JPG, PNG — Max 10MB</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
