
import { Search } from 'lucide-react';

const NoResults = () => {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8">
        <Search className="h-16 w-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-700 mb-4">🔍 No results found</h3>
      <p className="text-gray-500 text-lg">Try adjusting your search terms or filters</p>
    </div>
  );
};

export default NoResults;
