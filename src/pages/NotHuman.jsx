import React, { useState } from 'react';

const NotHuman = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    secretCode: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Hackathon context-e tracking ba analytics-er jonno logic ekhane dite paren
    console.log("Form Submitted:", formData);

    // Google Form link (Replace with your actual Google Form URL)
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXX/viewform?usp=sf_link";
    
    // Redirecting the user
    window.location.href = googleFormUrl;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Wanna join Not Human?</h2>
        <p style={styles.subheading}>Fill out your verification details below.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Alien Name / Handle</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="e.g., XÆA-X12"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Interstellar Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="name@galaxy.com"
            />
          </div>

          <button type="submit" style={styles.button}>
            Proceed to Google Form
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple inline styles for hackathon speed (You can convert this to Tailwind or CSS Modules)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0a0c',
    color: '#fff',
    fontFamily: 'sans-serif',
  },
  card: {
    backgroundColor: '#13131a',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #222'
  },
  heading: {
    margin: '0 0 10px 0',
    color: '#00ff88',
    fontSize: '28px',
  },
  subheading: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'left',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #333',
    backgroundColor: '#1c1c24',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    padding: '14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#00ff88',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '10px'
  }
};

export default NotHuman;