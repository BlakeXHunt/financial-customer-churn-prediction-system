import React, { useState } from 'react';

const colors = {
  primary: '#001845',
  secondary: '#023E7D',
  accent: '#0466C8',
  muted: '#5C677D',
  white: '#ffffff',
  lightBg: '#f8fafc',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
};

const ModelControl = () => {
  const [training, setTraining] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelStatus, setModelStatus] = useState({
    version: 'v2.4.1',
    lastTrained: '2024-02-15 03:00',
    accuracy: '94.2%',
    totalSamples: '15,234',
    status: 'active'
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleRetrain = () => {
    setTraining(true);
    // Simulate training
    setTimeout(() => {
      setTraining(false);
      setModelStatus({
        ...modelStatus,
        lastTrained: new Date().toLocaleString(),
        version: 'v2.4.2',
        accuracy: '94.5%'
      });
    }, 3000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Model Control Center</h2>
          <p style={styles.subtitle}>
            Manage and monitor your churn prediction model
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div style={styles.statusGrid}>
        <div style={styles.statusCard}>
          <div style={styles.statusHeader}>
            <span style={styles.statusIcon}>🤖</span>
            <span style={styles.statusBadge(colors)}>Active</span>
          </div>
          <p style={styles.statusLabel}>Model Version</p>
          <p style={styles.statusValue}>{modelStatus.version}</p>
        </div>
        <div style={styles.statusCard}>
          <div style={styles.statusHeader}>
            <span style={styles.statusIcon}>📅</span>
          </div>
          <p style={styles.statusLabel}>Last Trained</p>
          <p style={styles.statusValue}>{modelStatus.lastTrained}</p>
        </div>
        <div style={styles.statusCard}>
          <div style={styles.statusHeader}>
            <span style={styles.statusIcon}>🎯</span>
          </div>
          <p style={styles.statusLabel}>Accuracy</p>
          <p style={styles.statusValue}>{modelStatus.accuracy}</p>
        </div>
        <div style={styles.statusCard}>
          <div style={styles.statusHeader}>
            <span style={styles.statusIcon}>📊</span>
          </div>
          <p style={styles.statusLabel}>Training Samples</p>
          <p style={styles.statusValue}>{modelStatus.totalSamples}</p>
        </div>
      </div>

      {/* Main Actions */}
      <div style={styles.actionsGrid}>
        {/* Retrain Model Card */}
        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>Retrain Model</h3>
          <p style={styles.actionDesc}>
            Update the model with the latest data to improve accuracy
          </p>
          <button
            onClick={handleRetrain}
            disabled={training}
            style={{
              ...styles.primaryButton,
              ...(training ? styles.buttonDisabled : {}),
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`
            }}
          >
            {training ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner}></span>
                Training in progress...
              </span>
            ) : (
              'Start Training'
            )}
          </button>
        </div>

        {/* Upload Dataset Card */}
        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>Upload Dataset</h3>
          <p style={styles.actionDesc}>
            Add new training data to improve model performance
          </p>
          <div style={styles.uploadArea}>
            <input
              type="file"
              id="file-upload"
              accept=".csv,.json"
              onChange={handleFileUpload}
              style={styles.fileInput}
            />
            <label htmlFor="file-upload" style={styles.fileLabel}>
              <span style={styles.uploadIcon}>📁</span>
              {selectedFile ? selectedFile.name : 'Choose CSV or JSON file'}
            </label>
          </div>
          {selectedFile && (
            <button
              style={styles.secondaryButton}
              onClick={() => alert('Upload started')}
            >
              Upload File
            </button>
          )}
        </div>
      </div>

      {/* Model Metrics */}
      <div style={styles.metricsCard}>
        <h3 style={styles.metricsTitle}>Performance Metrics</h3>
        <div style={styles.metricsGrid}>
          <div style={styles.metricItem}>
            <p style={styles.metricLabel}>Precision</p>
            <p style={styles.metricValue}>0.93</p>
            <div style={styles.metricBar}>
              <div style={{...styles.metricFill, width: '93%'}} />
            </div>
          </div>
          <div style={styles.metricItem}>
            <p style={styles.metricLabel}>Recall</p>
            <p style={styles.metricValue}>0.89</p>
            <div style={styles.metricBar}>
              <div style={{...styles.metricFill, width: '89%'}} />
            </div>
          </div>
          <div style={styles.metricItem}>
            <p style={styles.metricLabel}>F1 Score</p>
            <p style={styles.metricValue}>0.91</p>
            <div style={styles.metricBar}>
              <div style={{...styles.metricFill, width: '91%'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: colors.primary,
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: colors.muted,
    margin: 0
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statusCard: {
    background: colors.white,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: `1px solid ${colors.border}`
  },
  statusHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  statusIcon: {
    fontSize: '24px'
  },
  statusBadge: (colors) => ({
    padding: '4px 8px',
    background: colors.success + '20',
    color: colors.success,
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  }),
  statusLabel: {
    fontSize: '14px',
    color: colors.muted,
    margin: '0 0 4px 0'
  },
  statusValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.primary,
    margin: 0
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  actionCard: {
    background: colors.white,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: `1px solid ${colors.border}`
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.primary,
    margin: '0 0 8px 0'
  },
  actionDesc: {
    fontSize: '14px',
    color: colors.muted,
    margin: '0 0 20px 0',
    lineHeight: '1.5'
  },
  primaryButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    color: colors.white,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: '0.2s'
  },
  secondaryButton: {
    padding: '10px 20px',
    background: colors.white,
    border: `1px solid ${colors.accent}`,
    borderRadius: '8px',
    color: colors.accent,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '12px',
    transition: '0.2s',
    ':hover': {
      background: colors.accent + '10'
    }
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: colors.white,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  uploadArea: {
    marginBottom: '12px'
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: colors.lightBg,
    border: `2px dashed ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.muted,
    cursor: 'pointer',
    transition: '0.2s',
    ':hover': {
      borderColor: colors.accent
    }
  },
  uploadIcon: {
    fontSize: '20px'
  },
  metricsCard: {
    background: colors.white,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: `1px solid ${colors.border}`
  },
  metricsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.primary,
    margin: '0 0 20px 0'
  },
  metricsGrid: {
    display: 'grid',
    gap: '20px'
  },
  metricItem: {
    marginBottom: '16px'
  },
  metricLabel: {
    fontSize: '14px',
    color: colors.muted,
    margin: '0 0 4px 0'
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.primary,
    margin: '0 0 8px 0'
  },
  metricBar: {
    height: '8px',
    background: colors.border,
    borderRadius: '4px',
    overflow: 'hidden'
  },
  metricFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${colors.accent}, ${colors.primary})`,
    borderRadius: '4px'
  }
};

// Add global animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default ModelControl;