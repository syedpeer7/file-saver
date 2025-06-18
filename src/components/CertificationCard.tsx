
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText, Image, Trash2, Calendar, HardDrive } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  file: File;
  type: 'image' | 'pdf';
  uploadDate: string;
  size: string;
  preview?: string;
}

interface CertificationCardProps {
  certification: Certification;
  onDownload: () => void;
  onPreview: () => void;
  onDelete: () => void;
  viewMode?: 'grid' | 'list';
}

const CertificationCard = ({ 
  certification, 
  onDownload, 
  onPreview, 
  onDelete, 
  viewMode = 'grid' 
}: CertificationCardProps) => {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02] group">
        <div className="p-4 flex items-center space-x-4">
          {/* Preview Thumbnail */}
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 cursor-pointer" onClick={onPreview}>
            {certification.type === 'image' && certification.preview ? (
              <img
                src={certification.preview}
                alt={certification.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="text-center">
                {certification.type === 'image' ? (
                  <Image className="h-8 w-8 text-gray-500" />
                ) : (
                  <FileText className="h-8 w-8 text-red-500" />
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate" title={certification.name}>
                {certification.name}
              </h3>
              <Badge 
                variant={certification.type === 'image' ? 'default' : 'secondary'} 
                className={`text-xs ${
                  certification.type === 'image' 
                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}
              >
                {certification.type === 'image' ? '🖼️ IMG' : '📄 PDF'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{certification.uploadDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <HardDrive className="h-3 w-3" />
                <span>{certification.size}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105 group animate-fade-in">
      {/* Enhanced Preview Area */}
      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative group cursor-pointer overflow-hidden" onClick={onPreview}>
        {certification.type === 'image' && certification.preview ? (
          <img
            src={certification.preview}
            alt={certification.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center transition-all duration-300 group-hover:scale-110">
            {certification.type === 'image' ? (
              <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-3">
                <Image className="h-12 w-12 text-blue-600" />
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-3">
                <FileText className="h-12 w-12 text-red-600" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-600">
              {certification.type === 'image' ? '🖼️ Image File' : '📄 PDF Document'}
            </span>
          </div>
        )}
        
        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={certification.type === 'image' ? 'default' : 'secondary'} 
            className={`${
              certification.type === 'image' 
                ? 'bg-blue-500/90 text-white border-0' 
                : 'bg-red-500/90 text-white border-0'
            } backdrop-blur-sm`}
          >
            {certification.type === 'image' ? '🖼️' : '📄'}
          </Badge>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 truncate pr-2 text-lg group-hover:text-blue-600 transition-colors duration-300" title={certification.name}>
            {certification.name}
          </h3>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>{certification.uploadDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <HardDrive className="h-4 w-4 mr-2 text-green-500" />
            <span>{certification.size}</span>
          </div>
        </div>

        {/* Enhanced Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-105"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-300 hover:scale-105"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-300 hover:scale-105"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CertificationCard;
