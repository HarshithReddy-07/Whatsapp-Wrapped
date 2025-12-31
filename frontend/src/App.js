import React, { useState } from 'react';
import axios from 'axios';
import Upload from './components/Upload';
import Results from './components/Results';
import './App.css';

function App() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || window.__API_BASE__ || (window.location.origin.includes('localhost') ? 'http://localhost:8000' : window.location.origin);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    // Quick health check to ensure backend is reachable (useful when using tunnels)
    try {
      await axios.get(`${API_BASE}/api/health`, { timeout: 5000 });
    } catch (err) {
      setError(`Backend unreachable at ${API_BASE}. Check your tunnel/port-forward and ensure backend is running.`);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 0 // allow large uploads; rely on server/tunnel limits
      });
      setAnalytics(response.data.data);
    } catch (err) {
      // Prefer server-provided details, otherwise show network error
      const serverDetail = err.response?.data?.detail || err.response?.data?.message;
      if (serverDetail) setError(serverDetail);
      else if (err.code === 'ECONNABORTED') setError('Upload timed out. Try again or check your connection.');
      else if (err.message) setError(err.message);
      else setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {!analytics ? (
        <Upload onUpload={handleFileUpload} loading={loading} error={error} />
      ) : (
        <Results data={analytics} onReset={() => setAnalytics(null)} />
      )}
    </div>
  );
}

export default App;
