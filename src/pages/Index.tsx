import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import CertificationCard from '@/components/CertificationCard';
import CertificationPreview from '@/components/CertificationPreview';
import StatsHeader from '@/components/StatsHeader';
import UploadSection from '@/components/UploadSection';
import SearchAndFilters from '@/components/SearchAndFilters';
import EmptyState from '@/components/EmptyState';
import NoResults from '@/components/NoResults';

interface Certification {
  id: string;
  name: string;
  file: File;
  type: 'image' | 'pdf';
  uploadDate: string;
  size: string;
  preview?: string;
}

// Helper function to convert File to base64 for storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Helper function to convert base64 back to File
const base64ToFile = (base64: string, filename: string, mimeType: string): File => {
  const arr = base64.split(',');
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mimeType });
};

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

  // Load certifications from localStorage on component mount
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const savedCerts = localStorage.getItem('certifications');
        if (savedCerts) {
          const parsedCerts = JSON.parse(savedCerts);
          const restoredCerts = await Promise.all(
            parsedCerts.map(async (cert: any) => {
              const file = base64ToFile(cert.fileData, cert.fileName, cert.fileMimeType);
              return {
                id: cert.id,
                name: cert.name,
                file: file,
                type: cert.type,
                uploadDate: cert.uploadDate,
                size: cert.size,
                preview: cert.preview
              };
            })
          );
          setCertifications(restoredCerts);
        }
      } catch (error) {
        console.error('Error loading certifications from localStorage:', error);
      }
    };

    loadCertifications();
  }, []);

  // Save certifications to localStorage whenever certifications change
  useEffect(() => {
    const saveCertifications = async () => {
      try {
        const certsToSave = await Promise.all(
          certifications.map(async (cert) => {
            const fileData = await fileToBase64(cert.file);
            return {
              id: cert.id,
              name: cert.name,
              fileName: cert.file.name,
              fileMimeType: cert.file.type,
              fileData: fileData,
              type: cert.type,
              uploadDate: cert.uploadDate,
              size: cert.size,
              preview: cert.preview
            };
          })
        );
        localStorage.setItem('certifications', JSON.stringify(certsToSave));
      } catch (error) {
        console.error('Error saving certifications to localStorage:', error);
      }
    };

    if (certifications.length > 0) {
      saveCertifications();
    } else {
      // Clear localStorage if no certifications
      localStorage.removeItem('certifications');
    }
  }, [certifications]);

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
      <StatsHeader
        totalFiles={certifications.length}
        totalSize={totalSize}
        imageCount={imageCount}
        pdfCount={pdfCount}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <UploadSection
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileUpload={handleInputUpload}
        />

        {certifications.length > 0 && (
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterChange={setFilterType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}

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
          <EmptyState onUploadClick={() => fileInputRef.current?.click()} />
        ) : (
          <NoResults />
        )}
      </div>

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
