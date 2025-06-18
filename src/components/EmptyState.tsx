
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

const EmptyState = ({ onUploadClick }: EmptyStateProps) => {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8">
        <FileText className="h-16 w-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-700 mb-4">📂 No certifications yet</h3>
      <p className="text-gray-500 text-lg mb-8">Upload your first certification to get started</p>
      <Button
        onClick={onUploadClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Upload className="mr-2 h-5 w-5" />
        Upload Now
      </Button>
    </div>
  );
};

export default EmptyState;
