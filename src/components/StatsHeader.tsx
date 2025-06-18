
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface StatsHeaderProps {
  totalFiles: number;
  totalSize: string;
  imageCount: number;
  pdfCount: number;
}

const StatsHeader = ({ totalFiles, totalSize, imageCount, pdfCount }: StatsHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Certification Manager
                </h1>
                <p className="text-gray-600 mt-1">Store, preview, and download your certifications</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                📁 {totalFiles} files
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                💾 {totalSize} MB
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                🖼️ {imageCount} images
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                📄 {pdfCount} PDFs
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
