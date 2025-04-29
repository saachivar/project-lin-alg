import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImgUrl, setCompressedImgUrl] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(50);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setError('');
      setSelectedFile(file);
      setFileName(file.name);
      setOriginalPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    // Don't run the effect if there's no file selected
    if (!selectedFile) return;
    
    const handleUpload = async () => {
      setIsLoading(true);
      setError('');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('k', compressionLevel);
      try {
        const res = await fetch('http://127.0.0.1:5000/compress', {
          mode: 'cors',
          method: 'POST',
          // Removing Content-Type header as it's automatically set with FormData
          credentials: 'include',  
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const blob = await res.blob();
        setCompressedImgUrl(URL.createObjectURL(blob)); 
      } catch (error) {
        console.error(error);
        setError('Failed to compress image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    handleUpload();
  }, [selectedFile, compressionLevel]);

  const handleCompressClick = () => {
    if (selectedFile) {
      // This will trigger the useEffect by causing a re-render with the current file
      setSelectedFile({...selectedFile});
    } else {
      setError('Please select an image first');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Image Compression Tool</h1>
        
        <div className="upload-container">
          <div className="file-drop-area">
            <label className="upload-content">
              <div className="upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-small text-gray">
                <span className="text-blue">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray">PNG, JPG or GIF</p>
              {fileName && <p className="file-name">{fileName}</p>}
              <input 
                type="file" 
                className="file-input" 
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>
          {error && <p className="text-error text-center">{error}</p>}
        </div>

        <div className="slider-container">
          <div className="slider-header">
            <span className="text-small">Compression Level</span>
            <span className="text-small text-blue">{compressionLevel}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            <span className="text-xs text-gray">More Compression</span>
            <span className="text-xs text-gray">Better Quality</span>
          </div>
        </div>

        <div className="button-container">
          <button 
            onClick={handleCompressClick}
            disabled={!selectedFile || isLoading}
            className="button"
          >
            {isLoading ? 'Compressing...' : 'Compress Image'}
          </button>
        </div>
        
        {(originalPreview || compressedImgUrl) && (
          <div className="image-grid">
            {originalPreview && (
              <div className="image-container">
                <h2 className="subtitle">Original</h2>
                <div className="image-frame">
                  <img 
                    src={originalPreview} 
                    alt="Original" 
                    className="image" 
                  />
                </div>
              </div>
            )}
            
            {compressedImgUrl && (
              <div className="image-container">
                <h2 className="subtitle">Compressed</h2>
                <div className="image-frame">
                  <img 
                    src={compressedImgUrl} 
                    alt="Compressed" 
                    className="image" 
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="#6b7280"/>
              <path d="M21 15L16 10L5 21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>Image Compression Tool © 2025</span>
        </div>
      </footer>
    </div>
  );
}