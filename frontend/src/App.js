import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/image-updates')
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (error) return <div style={{ fontFamily: 'Inter, sans-serif', color: '#d32f2f', textAlign: 'center', marginTop: 80 }}>Error: {error.message}</div>;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Inter, sans-serif',
      padding: 0,
      margin: 0,
    }}>
      <div style={{
        margin: '0 auto',
        padding: '48px 16px 0 16px',
      }}>
        <h1 style={{
          fontWeight: 600,
          fontSize: 36,
          color: '#22223b',
          marginBottom: 8,
          letterSpacing: -1,
        }}>
          Docker Image Updater
        </h1>
        <p style={{ color: '#4a4e69', marginBottom: 32, fontSize: 18 }}>
          View running containers and check if their images have updates available.
        </p>
        <div style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px rgba(34,34,59,0.08)',
          padding: 32,
          overflowX: 'auto',
        }}>
          <table style={{
            minWidth: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            fontSize: 17,
          }}>
            <thead>
              <tr>
                <th style={thStyle}>Container Name</th>
                <th style={thStyle}>Current Image</th>
                <th style={thStyle}>Current Tag</th>
                <th style={thStyle}>Latest Tag</th>
                <th style={thStyle}>Update Available</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.containerName} style={{ background: item.updateAvailable ? '#ffe5ec' : 'white', transition: 'background 0.3s' }}>
                  <td style={tdStyle}>{item.containerName}</td>
                  <td style={tdStyle}>{item.image}</td>
                  <td style={tdStyle}>{item.currentTag}</td>
                  <td style={tdStyle}>{item.latestTag || '-'}</td>
                  <td style={{ ...tdStyle, color: item.updateAvailable ? '#d7263d' : '#4a4e69', fontWeight: 600 }}>
                    {item.updateAvailable ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer style={{ textAlign: 'center', color: '#9a8c98', marginTop: 40, fontSize: 15 }}>
          &copy; {new Date().getFullYear()} Docker Image Updater
        </footer>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '14px 10px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#22223b',
  borderBottom: '2px solid #c9ada7',
  fontSize: 16,
};

const tdStyle = {
  padding: '12px 10px',
  borderBottom: '1px solid #e0e0e0',
  color: '#22223b',
  fontSize: 16,
};

export default App;
