import React, { useEffect, useState } from 'react';
import { api, HealthCheckResponse } from '../services/api';

const ApiConnectionTest: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.healthCheck();
      setHealth(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  if (loading) {
    return <div>Testing backend connection...</div>;
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        border: '2px solid #f00',
        borderRadius: '8px',
        backgroundColor: '#fee'
      }}>
        <h3 style={{ color: '#c00' }}>❌ Connection Failed</h3>
        <p>{error}</p>
        <button
          onClick={testConnection}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #0a0',
      borderRadius: '8px',
      backgroundColor: '#efe'
    }}>
      <h3 style={{ color: '#080' }}>✅ Laravel Backend Connected</h3>

      {health && (
        <div style={{ marginTop: '15px' }}>
          <p><strong>Application:</strong> {health.app_name}</p>
          <p><strong>Environment:</strong> {health.app_env}</p>
          <p><strong>Status:</strong> {health.status}</p>
          <p><strong>Laravel:</strong> {health.laravel_version}</p>
          <p><strong>PHP:</strong> {health.php_version}</p>
        </div>
      )}

      <button
        onClick={testConnection}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Again
      </button>
    </div>
  );
};

export default ApiConnectionTest;
