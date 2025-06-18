
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, List } from 'lucide-react';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: 'all' | 'image' | 'pdf';
  onFilterChange: (filter: 'all' | 'image' | 'pdf') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  viewMode,
  onViewModeChange
}: SearchAndFiltersProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <Card className="p-6 bg-white/70 backdrop-blur-sm shadow-lg border-0">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="🔍 Search certifications by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
              <Button
                variant={filterType === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('all')}
                className="rounded-lg"
              >
                All
              </Button>
              <Button
                variant={filterType === 'image' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('image')}
                className="rounded-lg"
              >
                🖼️ Images
              </Button>
              <Button
                variant={filterType === 'pdf' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('pdf')}
                className="rounded-lg"
              >
                📄 PDFs
              </Button>
            </div>
            
            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-lg"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-lg"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchAndFilters;
