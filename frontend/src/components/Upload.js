import React, { useRef } from 'react';
import '../styles/Upload.css';

function Upload({ onUpload, loading, error }) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.txt') || file.type === 'text/plain')) {
      onUpload(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1>📱 WhatsApp Wrapped</h1>
        <p className="subtitle">Upload your exported group chat to see amazing insights</p>
        
        <div 
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('active');
          }}
          onDragLeave={(e) => e.currentTarget.classList.remove('active')}
        >
          <div className="drop-content">
            <div className="drop-icon">📂</div>
            <p className="drop-text">Drag and drop your WhatsApp chat export here</p>
            <p className="drop-hint">or</p>
            <button 
              className="browse-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Browse Files'}
            </button>
          </div>
        </div>

        <input 
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleChange}
          style={{ display: 'none' }}
          disabled={loading}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="instructions">
          <h3>📝 How to Export Your Chat:</h3>
          <ol>
            <li>Open WhatsApp and go to the group chat</li>
            <li>Tap Menu (three dots) → More → Export chat</li>
            <li>Choose "Without Media"</li>
            <li>Upload the .txt file here</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Upload;
