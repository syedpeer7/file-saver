import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Search, FileText, Filter, Grid, List } from 'lucide-react';
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'pdf'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (files: FileList) => {
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
      title: "🎉 Upload Successful",
      description: `${files.length} certification(s) uploaded successfully.`,
    });
  };

  const handleInputUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    handleFileUpload(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
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
      title: "📥 Download Started",
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
      title: "🗑️ Deleted",
      description: "Certification removed successfully.",
    });
  };

  const handleNameUpdate = (certId: string, newName: string) => {
    setCertifications(prev => 
      prev.map(cert => 
        cert.id === certId ? { ...cert, name: newName } : cert
      )
    );
    toast({
      title: "✏️ Name Updated",
      description: "Certification name updated successfully.",
    });
  };

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || cert.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSize = certifications.reduce((acc, cert) => {
    return acc + parseFloat(cert.size.replace(' MB', ''));
  }, 0).toFixed(2);

  const imageCount = certifications.filter(cert => cert.type === 'image').length;
  const pdfCount = certifications.filter(cert => cert.type === 'pdf').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Header */}
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
                  📁 {certifications.length} files
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Upload Section */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-white to-blue-50/50 shadow-xl border-0 hover:shadow-2xl transition-all duration-500 animate-scale-in">
          <div 
            className={`text-center transition-all duration-300 ${
              isDragOver 
                ? 'transform scale-105 bg-blue-50 border-2 border-dashed border-blue-400 rounded-xl p-4' 
                : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
              onChange={handleInputUpload}
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

        {/* Enhanced Controls */}
        {certifications.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <Card className="p-6 bg-white/70 backdrop-blur-sm shadow-lg border-0">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="🔍 Search certifications by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilterType('all')}
                      className="rounded-lg"
                    >
                      All
                    </Button>
                    <Button
                      variant={filterType === 'image' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilterType('image')}
                      className="rounded-lg"
                    >
                      🖼️ Images
                    </Button>
                    <Button
                      variant={filterType === 'pdf' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilterType('pdf')}
                      className="rounded-lg"
                    >
                      📄 PDFs
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-lg"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-lg"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Enhanced Certifications Display */}
        {filteredCertifications.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          } animate-fade-in`}>
            {filteredCertifications.map((cert, index) => (
              <div
                key={cert.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CertificationCard
                  certification={cert}
                  onDownload={() => handleDownload(cert)}
                  onPreview={() => handlePreview(cert)}
                  onDelete={() => handleDelete(cert.id)}
                  onNameUpdate={handleNameUpdate}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        ) : certifications.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8">
              <FileText className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">📂 No certifications yet</h3>
            <p className="text-gray-500 text-lg mb-8">Upload your first certification to get started</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Now
            </Button>
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8">
              <Search className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">🔍 No results found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      {/* Enhanced Preview Modal */}
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
