import React, { useEffect, useState } from 'react';
import Head from 'next/head';

export default function DemoTopics() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Topics Demo - WMCA Blog</title>
        {/* Set window.topics via a script tag - this is what gets injected from Umbraco or _document.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.topics = [
                "Research and insights",
                "Inclusive growth",
                "Skills, education and careers",
                "Life in the West Midlands",
                "People of the West Midlands"
              ];
            `,
          }}
        />
      </Head>

      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.heading}>🎯 WMCA Blog Topics Demo</h1>
          <p style={styles.subtitle}>
            Demonstrating how to set and access topics via window.topics in Next.js
          </p>

          {/* Info Box */}
          <div style={styles.infoBox}>
            <strong>ℹ️ How it works:</strong>
            <p>
              A script tag in the page Head sets <code style={styles.code}>window.topics</code> with an array of 
              available blog topics. React components can access this globally without re-rendering.
            </p>
          </div>

          {/* Topics Display */}
          <h2 style={styles.subheading}>Available Topics</h2>
          {isMounted && (
            <>
              {typeof window !== 'undefined' && window.topics ? (
                <div style={styles.topicsGrid}>
                  {window.topics.map((topic, index) => (
                    <div key={index} style={styles.topicCard}>
                      <p>{topic}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.error}>Topics not found in window object</p>
              )}
            </>
          )}

          {/* Code Example */}
          <h2 style={styles.subheading}>Code Example</h2>
          <div style={styles.codeBlock}>
            <pre>{`// In pages/_document.js or your Next.js page:
<script
  dangerouslySetInnerHTML={{
    __html: \`
      window.topics = [
        "Research and insights",
        "Inclusive growth",
        "Skills, education and careers",
        "Life in the West Midlands",
        "People of the West Midlands"
      ];
    \`,
  }}
/>`}</pre>
          </div>

          {/* Access from Components */}
          <h2 style={styles.subheading}>Access from React Components</h2>
          <div style={styles.codeBlock}>
            <pre>{`// In your BlogFilter component:
const topicOptions = useMemo(() => {
  const allowedTopics = typeof window !== 'undefined' && window.topics 
    ? window.topics 
    : blogCategories;
  
  return blogCategories
    .filter((category) => allowedTopics.includes(category))
    .map((category) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      value: category
    }));
}, [blogCategories]);`}</pre>
          </div>

          {/* Umbraco Integration */}
          <h2 style={styles.subheading}>Umbraco CMS Integration</h2>
          <div style={styles.infoBox}>
            <strong>In your Umbraco Razor template:</strong>
            <div style={styles.codeBlock}>
              <pre>{`@{
  var topics = Model.Topics; // Get from your Umbraco model
}

<script>
  window.topics = @Html.Raw(Json.Encode(topics));
</script>

<div id="app"></div>`}</pre>
            </div>
          </div>

          {/* Test Section */}
          <h2 style={styles.subheading}>Test It</h2>
          <div style={styles.buttonGroup}>
            <button 
              style={styles.button}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  console.log('window.topics:', window.topics);
                  alert('Check console for window.topics output');
                }
              }}
            >
              Log Topics to Console
            </button>
            <button 
              style={styles.button}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  alert(`Total topics: ${window.topics?.length || 0}`);
                }
              }}
            >
              Count Topics
            </button>
          </div>

          {/* Live Preview */}
          <h2 style={styles.subheading}>Live Preview</h2>
          {isMounted && typeof window !== 'undefined' && (
            <div style={styles.outputBox}>
              <p><strong>window.topics exists:</strong> {window.topics ? '✓ Yes' : '✗ No'}</p>
              <p><strong>Topic count:</strong> {window.topics?.length || 0}</p>
              <p><strong>First topic:</strong> {window.topics?.[0] || 'N/A'}</p>
              <p><strong>Last topic:</strong> {window.topics?.[window.topics.length - 1] || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#c05701',
    marginBottom: '10px',
    fontSize: '32px',
  },
  subheading: {
    color: '#333',
    marginTop: '30px',
    marginBottom: '15px',
    fontSize: '20px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    fontSize: '14px',
  },
  infoBox: {
    background: '#f0f4f8',
    borderLeft: '4px solid #c05701',
    padding: '15px',
    margin: '20px 0',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
  },
  code: {
    background: 'white',
    padding: '2px 6px',
    borderRadius: '3px',
    fontFamily: "'Courier New', monospace",
    color: '#c05701',
  },
  codeBlock: {
    background: '#1e1e1e',
    color: '#d4d4d4',
    padding: '15px',
    borderRadius: '4px',
    overflow: 'auto',
    marginBottom: '20px',
  },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  topicCard: {
    background: 'linear-gradient(135deg, #c05701 0%, #863d01 100%)',
    color: 'white',
    padding: '20px',
    borderRadius: '6px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, boxShadow 0.3s ease',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    marginBottom: '20px',
  },
  button: {
    background: '#c05701',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.3s ease',
  },
  outputBox: {
    background: '#f0f4f8',
    border: '1px solid #d0d8e0',
    padding: '15px',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
  },
  error: {
    color: '#d32f2f',
    fontSize: '14px',
  },
};
