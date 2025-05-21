import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Trash2, RefreshCcw } from 'lucide-react';
import api from '../../../../api';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/get-all-documents');
      if (response.data.status) {
        setDocuments(response.data.getAllDocuments);
      } else {
        setError('Failed to fetch documents');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('An error occurred while fetching documents');
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  };

  const isPdfFile = (filename) => {
    return getFileExtension(filename) === 'pdf';
  };

  const getFileIcon = (filename) => {
    const extension = getFileExtension(filename);

    switch (extension) {
      case 'pdf':
        return <FileText className="text-red-500" size={24} />;
      case 'doc':
      case 'docx':
        return <FileText className="text-blue-500" size={24} />;
      case 'xls':
      case 'xlsx':
        return <FileText className="text-green-500" size={24} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="text-purple-500" size={24} />;
      default:
        return <FileText className="text-gray-500" size={24} />;
    }
  };

  const getDocumentUrl = (documentName) => {
    return `http://localhost:3032/uploads/members/${documentName}`;
  };

  // Opens the document preview modal
  const openPreview = (document) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  // Closes the document preview modal
  const closePreview = () => {
    setPreviewOpen(false);
    setTimeout(() => setSelectedDocument(null), 300); // Clear after animation
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchDocuments}
              className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full flex items-center space-x-1"
            >
              <RefreshCcw size={14} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Documents Found</h3>
          <p className="text-gray-500 mb-6">There are no documents available at the moment.</p>
          <button
            onClick={fetchDocuments}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2 mx-auto"
          >
            <RefreshCcw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
        <button
          onClick={fetchDocuments}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition flex items-center space-x-2"
        >
          <RefreshCcw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {getFileIcon(doc.document)}
                <span className="font-medium text-gray-700 truncate max-w-[150px]">
                  Document #{doc.id}
                </span>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                Family ID: {doc.familyHeadId}
              </span>
            </div>

            {/* Document preview area */}
            <div className="h-40 bg-gray-100 relative overflow-hidden flex items-center justify-center">
              {isPdfFile(doc.document) ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-24 bg-red-50 border border-red-100 rounded shadow-sm flex flex-col items-center justify-center">
                    <span className="text-red-500 font-bold">PDF</span>
                    <FileText size={32} className="text-red-500 mt-2" />
                  </div>
                </div>
              ) : (
                <img
                  src={getDocumentUrl(doc.document)}
                  alt={`Document ${doc.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = `
                      <div class="flex flex-col items-center justify-center h-full">
                        <div class="w-16 h-20 bg-gray-200 flex items-center justify-center rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>
                        <p class="text-sm text-gray-500 mt-2">Preview not available</p>
                      </div>
                    `;
                  }}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/50 to-transparent p-3 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openPreview(doc)}
                    className="flex items-center space-x-1 bg-white hover:bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm shadow transition-colors"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                  <a
                    href={getDocumentUrl(doc.document)}
                    download={doc.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 bg-white hover:bg-green-50 text-green-600 px-3 py-1 rounded-md text-sm shadow transition-colors"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Document info */}
            <div className="p-4">
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Document ID:</span>
                  <span className="font-medium text-gray-700">{doc.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Family Head ID:</span>
                  <span className="font-medium text-gray-700">{doc.familyHeadId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">File Type:</span>
                  <span className="font-medium text-gray-700 uppercase">{getFileExtension(doc.document)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-medium">Document Preview</h3>
              <button
                onClick={closePreview}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                {isPdfFile(selectedDocument.document) ? (
                  <iframe
                    src={`${getDocumentUrl(selectedDocument.document)}#toolbar=0`}
                    className="w-full h-full"
                    title={`Document ${selectedDocument.id}`}
                  ></iframe>
                ) : (
                  <img
                    src={getDocumentUrl(selectedDocument.document)}
                    alt={`Document ${selectedDocument.id}`}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Document Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Document ID</p>
                    <p className="font-medium">{selectedDocument.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Family Head ID</p>
                    <p className="font-medium">{selectedDocument.familyHeadId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">File Name</p>
                    <p className="font-medium truncate">{selectedDocument.document}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">File Type</p>
                    <p className="font-medium uppercase">{getFileExtension(selectedDocument.document)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <a
                  href={getDocumentUrl(selectedDocument.document)}
                  download={selectedDocument.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Documents;