import { useState, useEffect } from 'react';
import { TrashIcon, UploadIcon, XIcon, SearchIcon, ImageIcon, VideoIcon, DownloadIcon, EyeIcon, CopyIcon, CheckCircleIcon } from '../components/Icons';
import { API_BASE_URL } from '../config/api';

export default function MediaUploads() {
  const [media, setMedia] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'video'
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    fetchMedia();
    fetchStats();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      
      // Fetch images
      const imageResponse = await fetch(`${API_BASE_URL}/api/upload/media/all?resourceType=image`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const imageData = await imageResponse.json();

      // Fetch videos
      const videoResponse = await fetch(`${API_BASE_URL}/api/upload/media/all?resourceType=video`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const videoData = await videoResponse.json();

      // Combine both
      const allMedia = [
        ...(imageData.success ? imageData.data : []),
        ...(videoData.success ? videoData.data : [])
      ];

      setMedia(allMedia);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('media', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/upload/media`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        fetchMedia();
        fetchStats();
      }
    } catch (err) {
      console.error('Error uploading:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/media/${encodeURIComponent(selectedMedia.publicId)}?resourceType=${selectedMedia.type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        fetchMedia();
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setShowDeleteModal(false);
      setSelectedMedia(null);
    }
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.publicId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Media Library</h1>
          <p className="text-gray-500">Manage all your uploaded Media Files</p>
        </div>

        {/* Storage Stats */}
        {stats && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">Cloudinary Storage</h3>
                  {stats.plan && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">
                      {stats.plan} Plan
                    </span>
                  )}
                </div>
                <p className="text-base text-gray-600">
                  {formatBytes(stats.used)} of {formatBytes(stats.limit)} used
                </p>
                {stats.lastUpdated && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="text-right bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-4xl font-bold bg-gradient-to-r from-zennara-green to-emerald-600 bg-clip-text text-transparent">
                  {stats.percentage}%
                </p>
                <p className="text-sm text-gray-500 font-semibold mt-1">utilized</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-6">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-zennara-green via-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${Math.min(parseFloat(stats.percentage) || 0, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              </div>
              {/* Percentage Label Inside Bar */}
              {parseFloat(stats.percentage) > 10 && (
                <div className="absolute inset-0 flex items-center px-4">
                  <span className="text-white text-xs font-bold drop-shadow-lg">
                    {formatBytes(stats.used)}
                  </span>
                </div>
              )}
            </div>

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Bandwidth Used</p>
                <p className="text-xl font-bold text-gray-900">{formatBytes(stats.bandwidth || 0)}</p>
                {stats.bandwidthLimit > 0 && (
                  <p className="text-xs text-gray-400 mt-1">of {formatBytes(stats.bandwidthLimit)}</p>
                )}
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Transformations</p>
                <p className="text-xl font-bold text-gray-900">{(stats.transformations || 0).toLocaleString()}</p>
                {stats.transformationsLimit > 0 && (
                  <p className="text-xs text-gray-400 mt-1">of {stats.transformationsLimit.toLocaleString()}</p>
                )}
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Resources</p>
                <p className="text-xl font-bold text-gray-900">{(stats.resourcesCount || media.length).toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">Original files</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">API Requests</p>
                <p className="text-xl font-bold text-gray-900">{(stats.totalRequests || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">This month</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media by name..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Type */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-zennara-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('image')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterType === 'image'
                    ? 'bg-zennara-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setFilterType('video')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterType === 'video'
                    ? 'bg-zennara-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Videos
              </button>
            </div>

            {/* Upload Button */}
            <label className="ml-4 cursor-pointer">
              <div className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all inline-flex items-center space-x-2">
                <UploadIcon className="w-5 h-5" />
                <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-zennara-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading media...</p>
            </div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <UploadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No media found</p>
            <label className="cursor-pointer">
              <div className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all inline-flex items-center space-x-2">
                <UploadIcon className="w-5 h-5" />
                <span>Upload First File</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredMedia.map((item) => (
              <div key={item.publicId} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-zennara-green/20 transition-all duration-300 group">
                {/* Media Preview */}
                <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.publicId}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
                      <div className="text-center">
                        <VideoIcon className="w-20 h-20 text-purple-600 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-purple-700 uppercase">Video</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                      item.type === 'image'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    }`}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Format Badge */}
                  {item.format && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-black/60 text-white backdrop-blur-sm">
                        .{item.format}
                      </span>
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center space-x-3">
                      <a
                        href={item.url}
                        download
                        className="p-3 bg-white hover:bg-gray-100 rounded-full transition-all transform hover:scale-110 shadow-lg"
                        title="Download"
                      >
                        <DownloadIcon className="w-5 h-5 text-gray-700" />
                      </a>
                      <button
                        onClick={() => {
                          setSelectedMedia(item);
                          setShowDeleteModal(true);
                        }}
                        className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Media Info */}
                <div className="p-5">
                  <p className="text-sm font-bold text-gray-900 truncate mb-3" title={item.publicId.split('/').pop()}>
                    {item.publicId.split('/').pop()}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500 mb-0.5">Size</p>
                      <p className="text-sm font-bold text-gray-900">{formatBytes(item.bytes)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500 mb-0.5">Dimensions</p>
                      <p className="text-sm font-bold text-gray-900">
                        {item.width && item.height ? `${item.width}×${item.height}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">{formatDate(item.createdAt)}</p>
                    {item.folder && (
                      <p className="text-xs text-gray-400 font-medium truncate max-w-[100px]">
                        📁 {item.folder.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Media?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-bold">"{selectedMedia.publicId.split('/').pop()}"</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMedia(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
