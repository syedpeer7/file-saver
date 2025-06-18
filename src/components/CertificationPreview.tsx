
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, X } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  file: File;
  type: 'image' | 'pdf';
  uploadDate: string;
  size: string;
  preview?: string;
}

interface CertificationPreviewProps {
  certification: Certification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: () => void;
}

const CertificationPreview = ({ certification, open, onOpenChange, onDownload }: CertificationPreviewProps) => {
  if (!certification) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <DialogTitle className="text-xl font-semibold truncate">
              {certification.name}
            </DialogTitle>
            <Badge variant={certification.type === 'image' ? 'default' : 'secondary'}>
              {certification.type.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>

        {/* File Info */}
        <div className="text-sm text-gray-600 mb-4 flex space-x-4">
          <span>Uploaded: {certification.uploadDate}</span>
          <span>Size: {certification.size}</span>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-50 rounded-lg p-4">
          {certification.type === 'image' && certification.preview ? (
            <div className="flex justify-center">
              <img
                src={certification.preview}
                alt={certification.name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : certification.type === 'pdf' ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Preview</h3>
              <p className="text-gray-600 text-center mb-4">
                PDF files cannot be previewed in the browser.<br />
                Download the file to view its contents.
              </p>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h3>
              <p className="text-gray-600 text-center">
                This file type cannot be previewed in the browser.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificationPreview;
