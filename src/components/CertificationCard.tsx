
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText, Image, Trash2 } from 'lucide-react';

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
}

const CertificationCard = ({ certification, onDownload, onPreview, onDelete }: CertificationCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
      {/* Preview Area */}
      <div className="aspect-video bg-gray-50 flex items-center justify-center relative group cursor-pointer" onClick={onPreview}>
        {certification.type === 'image' && certification.preview ? (
          <img
            src={certification.preview}
            alt={certification.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center">
            {certification.type === 'image' ? (
              <Image className="h-12 w-12 text-gray-400 mb-2" />
            ) : (
              <FileText className="h-12 w-12 text-gray-400 mb-2" />
            )}
            <span className="text-sm text-gray-500">
              {certification.type === 'image' ? 'Image' : 'PDF'}
            </span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Eye className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 truncate pr-2" title={certification.name}>
            {certification.name}
          </h3>
          <Badge variant={certification.type === 'image' ? 'default' : 'secondary'} className="text-xs shrink-0">
            {certification.type.toUpperCase()}
          </Badge>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          <div>Uploaded: {certification.uploadDate}</div>
          <div>Size: {certification.size}</div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CertificationCard;
