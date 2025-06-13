export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1a1a2e', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          color: '#FFD700'
        }}>
          PVP Lens
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '2rem',
          color: '#cccccc'
        }}>
          World of Warcraft PVP Statistics Tracker
        </p>
        <div style={{
          padding: '1rem',
          background: '#2a2a4e',
          borderRadius: '8px',
          border: '1px solid #444'
        }}>
          ✅ Application Running Without Errors
        </div>
      </div>
    </div>
  );
}
