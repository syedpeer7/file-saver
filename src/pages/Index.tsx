
import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Search, Download, Eye, FileText, Image, Trash2 } from 'lucide-react';
import CertificationCard from '@/components/CertificationCard';
import CertificationPreview from '@/components/CertificationPreview';

interface Certification {
  id: string;
  name: string;
  file: File;
  type: 'image' | 'pdf';
  uploadDate: string;
  size: string;
  preview?: string;
}

const Index = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
      const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
      
      const newCert: Certification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name.replace(/\.[^/.]+$/, ""),
        file: file,
        type: fileType,
        uploadDate: new Date().toLocaleDateString(),
        size: fileSize,
      };

      // Create preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          newCert.preview = e.target?.result as string;
          setCertifications(prev => [...prev, newCert]);
        };
        reader.readAsDataURL(file);
      } else {
        setCertifications(prev => [...prev, newCert]);
      }
    });

    toast({
      title: "Upload Successful",
      description: `${files.length} certification(s) uploaded successfully.`,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (cert: Certification) => {
    const url = URL.createObjectURL(cert.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.name}.${cert.type === 'image' ? 'jpg' : 'pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Downloading ${cert.name}...`,
    });
  };

  const handlePreview = (cert: Certification) => {
    setSelectedCert(cert);
    setPreviewOpen(true);
  };

  const handleDelete = (certId: string) => {
    setCertifications(prev => prev.filter(cert => cert.id !== certId));
    toast({
      title: "Deleted",
      description: "Certification removed successfully.",
    });
  };

  const filteredCertifications = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = certifications.reduce((acc, cert) => {
    return acc + parseFloat(cert.size.replace(' MB', ''));
  }, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Certification Manager</h1>
              <p className="text-gray-600 mt-1">Store, preview, and download your certifications</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {certifications.length} files • {totalSize} MB
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <Card className="p-8 mb-8 bg-white shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Upload Your Certifications</h2>
            <p className="text-gray-600 mb-6">Drag and drop files or click to browse</p>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              Choose Files
            </Button>
            
            <p className="text-sm text-gray-500 mt-3">
              Supported formats: JPG, PNG, PDF (Max 10MB per file)
            </p>
          </div>
        </Card>

        {/* Search and Filter */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Certifications Grid */}
        {filteredCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCertifications.map((cert) => (
              <CertificationCard
                key={cert.id}
                certification={cert}
                onDownload={() => handleDownload(cert)}
                onPreview={() => handlePreview(cert)}
                onDelete={() => handleDelete(cert.id)}
              />
            ))}
          </div>
        ) : certifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No certifications yet</h3>
            <p className="text-gray-600">Upload your first certification to get started</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <CertificationPreview
        certification={selectedCert}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onDownload={selectedCert ? () => handleDownload(selectedCert) : undefined}
      />
    </div>
  );
};

export default Index;
