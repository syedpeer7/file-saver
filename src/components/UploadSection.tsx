
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadSectionProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadSection = ({ 
  isDragOver, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onFileUpload 
}: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="p-8 mb-8 bg-gradient-to-br from-white to-blue-50/50 shadow-xl border-0 hover:shadow-2xl transition-all duration-500 animate-scale-in">
      <div 
        className={`text-center transition-all duration-300 ${
          isDragOver 
            ? 'transform scale-105 bg-blue-50 border-2 border-dashed border-blue-400 rounded-xl p-4' 
            : ''
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <Upload className="h-10 w-10 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Upload Your Certifications
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          {isDragOver ? '🎯 Drop your files here!' : '📁 Drag and drop files or click to browse'}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={onFileUpload}
          className="hidden"
        />
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Upload className="mr-3 h-6 w-6" />
          Choose Files
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          📋 Supported formats: JPG, PNG, PDF (Max 10MB per file)
        </p>
      </div>
    </Card>
  );
};

export default UploadSection;
