import { useState } from 'react';
import AdminChat from '../components/AdminChat';
import BranchSelector from '../components/BranchSelector';
import { ArrowLeft } from 'lucide-react';

export default function Chat() {
  const [selectedBranch, setSelectedBranch] = useState(() => {
    // Load selected branch from localStorage on mount
    const savedBranch = localStorage.getItem('selectedChatBranch');
    return savedBranch ? JSON.parse(savedBranch) : null;
  });

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    // Save to localStorage
    localStorage.setItem('selectedChatBranch', JSON.stringify(branch));
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    // Clear from localStorage
    localStorage.removeItem('selectedChatBranch');
    localStorage.removeItem('selectedChatId');
  };

  if (!selectedBranch) {
    return (
      <div className="p-6">
        <BranchSelector onSelectBranch={handleBranchSelect} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={handleBackToBranches}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-zennara-green transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={18} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Back to Branches</span>
        </button>
      </div>
      <AdminChat selectedBranch={selectedBranch} />
    </div>
  );
}
