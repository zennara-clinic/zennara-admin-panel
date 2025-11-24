import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Users, MessageCircle, Building2 } from 'lucide-react';
import chatService from '../services/chatService';
import api from '../config/api';

const branchColors = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-cyan-600',
  'from-purple-500 to-pink-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
];

const BranchSelector = ({ onSelectBranch }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBranchesAndStats();
  }, []);

  const fetchBranchesAndStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all branches
      const branchesResponse = await api.get('/branches');
      const allBranches = branchesResponse.data.data || [];

      // Fetch chat statistics
      const statsResponse = await chatService.getChatStats();
      const branchStats = statsResponse.data.byBranch || [];

      // Merge branch data with statistics
      const branchesWithStats = allBranches
        .filter(branch => branch.isActive)
        .map((branch, index) => {
          const stats = branchStats.find(
            s => s.branchId === branch._id
          ) || { activeChats: 0, totalUnread: 0 };

          return {
            id: branch._id,
            name: branch.name,
            address: branch.address?.line1 || 'Hyderabad',
            activeChats: stats.activeChats || 0,
            unreadMessages: stats.totalUnread || 0,
            color: branchColors[index % branchColors.length],
          };
        });

      setBranches(branchesWithStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching branches and stats:', err);
      setError('Failed to load branches. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-zennara-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading branches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={fetchBranchesAndStats}
            className="px-6 py-2 bg-zennara-green text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-zennara-green to-emerald-600 mb-6 shadow-lg shadow-zennara-green/30">
            <MessageCircle size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Connect to Branch Chat
          </h1>
          <p className="text-lg text-gray-600">
            Select a clinic branch to view and manage patient conversations
          </p>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              onClick={() => onSelectBranch(branch)}
              className="group relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-zennara-green cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Unread Badge */}
              {branch.unreadMessages > 0 && (
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 z-10">
                  <span className="text-white font-bold text-sm">
                    {branch.unreadMessages}
                  </span>
                </div>
              )}

              {/* Branch Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${branch.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Building2 size={28} className="text-white" strokeWidth={2} />
                </div>
                <ArrowRight 
                  size={24} 
                  className="text-gray-400 group-hover:text-zennara-green group-hover:translate-x-1 transition-all duration-300" 
                />
              </div>

              {/* Branch Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {branch.name}
              </h3>
              <div className="flex items-start space-x-2 mb-4">
                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 line-clamp-2">
                  {branch.address}
                </p>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <MessageCircle size={16} className="text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-600">Active Chats</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {branch.activeChats}
                  </span>
                </div>

                {branch.unreadMessages > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                        <MessageCircle size={16} className="text-red-600" />
                      </div>
                      <span className="text-sm text-gray-600">Unread</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      {branch.unreadMessages}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-zennara-green/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Active Chats</p>
                <p className="text-xl font-bold text-gray-900">
                  {branches.reduce((sum, b) => sum + b.activeChats, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-xl font-bold text-gray-900">
                  {branches.reduce((sum, b) => sum + b.unreadMessages, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Branches</p>
                <p className="text-xl font-bold text-gray-900">{branches.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Click on any branch to connect and start managing patient conversations
          </p>
        </div>
      </div>
    </div>
  );
};

export default BranchSelector;
