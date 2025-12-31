import React, { useState } from 'react';
import axios from 'axios';
import Upload from './components/Upload';
import Results from './components/Results';
import './App.css';

function App() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalytics(response.data.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
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
