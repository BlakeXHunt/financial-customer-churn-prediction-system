import React, { useState } from 'react';
import { predictSingleChurn } from '../../services/api';

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

const ChurnPrediction = () => {
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'bulk'

  // Single customer state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tenure: '',
    monthlyCharges: '',
    contract: 'monthly',
    supportCalls: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState('');

  // Bulk upload state
  const [file, setFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState('');

  // Single customer handlers
  const handleSingleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setSingleLoading(true);
    setSingleError('');
    setPrediction(null);
    try {
      const res = await predictSingleChurn({
        tenure: Number(formData.tenure),
        monthlyCharges: Number(formData.monthlyCharges),
        contract: formData.contract === 'monthly' ? 0 : 1,
        supportCalls: Number(formData.supportCalls)
      });
      setPrediction(res.data);
    } catch (err) {
      setSingleError(err.response?.data?.message || 'Failed to get prediction');
    } finally {
      setSingleLoading(false);
    }
  };

  // Bulk upload handlers
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setBulkResult(null);
    setBulkError('');
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setBulkError('Please select a file.');
      return;
    }

    setBulkLoading(true);
    setBulkError('');
    setBulkResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replace with your actual bulk upload endpoint
      const response = await fetch('http://localhost:2005/api/customers/bulk-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      setBulkResult(data);
    } catch (err) {
      setBulkError(err.message);
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Churn Prediction</h2>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'single' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('single')}
        >
          Single Customer
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'bulk' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('bulk')}
        >
          Bulk Upload
        </button>
      </div>

      {/* Single Customer Tab */}
      {activeTab === 'single' && (
        <div style={styles.tabContent}>
          <form onSubmit={handleSingleSubmit} style={styles.form}>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleSingleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleSingleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tenure (months)</label>
                <input
                  type="number"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleSingleChange}
                  min="1"
                  max="72"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Monthly Charges ($)</label>
                <input
                  type="number"
                  name="monthlyCharges"
                  value={formData.monthlyCharges}
                  onChange={handleSingleChange}
                  min="30"
                  max="130"
                  step="0.01"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contract Type</label>
                <select
                  name="contract"
                  value={formData.contract}
                  onChange={handleSingleChange}
                  style={styles.select}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Support Calls (last 30 days)</label>
                <input
                  type="number"
                  name="supportCalls"
                  value={formData.supportCalls}
                  onChange={handleSingleChange}
                  min="0"
                  max="20"
                  required
                  style={styles.input}
                />
              </div>
            </div>
            <button type="submit" disabled={singleLoading} style={styles.submitButton}>
              {singleLoading ? 'Predicting...' : 'Predict Churn'}
            </button>
          </form>

          {singleError && <div style={styles.error}>{singleError}</div>}

          {prediction && (
            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Prediction Result</h3>
              <p style={styles.resultText}>
                <strong>Risk Level:</strong>{' '}
                <span style={{
                  color: prediction.riskLevel === 'High' ? colors.danger :
                         prediction.riskLevel === 'Medium' ? colors.warning :
                         colors.success
                }}>
                  {prediction.riskLevel}
                </span>
              </p>
              <p style={styles.resultText}>
                <strong>Churn Probability:</strong> {(prediction.churnProbability * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bulk Upload Tab */}
      {activeTab === 'bulk' && (
        <div style={styles.tabContent}>
          <form onSubmit={handleBulkSubmit} style={styles.form}>
            <div style={styles.uploadArea}>
              <input
                type="file"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
              <label htmlFor="file-upload" style={styles.fileLabel}>
                <span style={styles.uploadIcon}>📁</span>
                {file ? file.name : 'Choose CSV or Excel file'}
              </label>
              <p style={styles.uploadHint}>
                Supported formats: .csv, .xlsx (max 50MB)
              </p>
            </div>
            <button type="submit" disabled={!file || bulkLoading} style={styles.submitButton}>
              {bulkLoading ? 'Uploading...' : 'Upload & Predict'}
            </button>
          </form>

          {bulkError && <div style={styles.error}>{bulkError}</div>}

          {bulkResult && (
            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Upload Summary</h3>
              <p><strong>Total records:</strong> {bulkResult.total}</p>
              <p><strong>Processed:</strong> {bulkResult.processed}</p>
              <p><strong>Failed:</strong> {bulkResult.failed}</p>
            </div>
          )}

          {/* Remove this note once the backend endpoint is ready */}
          <div style={styles.note}>
            ⚠️ Note: The bulk upload endpoint is not yet implemented. Replace the fetch URL with your actual backend endpoint.
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    background: colors.white,
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: `1px solid ${colors.border}`,
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: colors.primary,
    marginBottom: 24,
  },
  tabContainer: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    borderBottom: `2px solid ${colors.border}`,
    paddingBottom: 8,
  },
  tab: {
    padding: '8px 20px',
    border: 'none',
    background: 'transparent',
    fontSize: '1rem',
    fontWeight: 500,
    color: colors.muted,
    cursor: 'pointer',
    borderRadius: '20px',
    transition: '0.2s',
  },
  activeTab: {
    background: colors.accent + '20',
    color: colors.accent,
  },
  tabContent: {
    marginTop: 16,
  },
  form: {
    marginBottom: 30,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.muted,
    marginBottom: 6,
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    fontSize: '15px',
    outline: 'none',
    transition: '0.2s',
    ':focus': {
      borderColor: colors.accent,
      boxShadow: `0 0 0 3px ${colors.accent}20`,
    },
  },
  select: {
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    fontSize: '15px',
    background: colors.white,
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 24px',
    background: colors.accent,
    color: colors.white,
    border: 'none',
    borderRadius: 8,
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: '0.2s',
    ':hover': {
      background: colors.primary,
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  error: {
    marginTop: 16,
    padding: '12px',
    background: colors.danger + '10',
    color: colors.danger,
    borderRadius: 8,
    border: `1px solid ${colors.danger}30`,
  },
  resultCard: {
    marginTop: 24,
    padding: 20,
    background: colors.lightBg,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
  },
  resultTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: colors.primary,
    marginBottom: 12,
  },
  resultText: {
    fontSize: '1rem',
    margin: '8px 0',
  },
  uploadArea: {
    marginBottom: 20,
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: colors.lightBg,
    border: `2px dashed ${colors.border}`,
    borderRadius: 8,
    fontSize: '15px',
    color: colors.muted,
    cursor: 'pointer',
    transition: '0.2s',
    ':hover': {
      borderColor: colors.accent,
    },
  },
  uploadIcon: {
    fontSize: '20px',
  },
  uploadHint: {
    fontSize: '13px',
    color: colors.muted,
    marginTop: 8,
  },
  note: {
    marginTop: 16,
    padding: '12px',
    background: colors.warning + '10',
    color: colors.warning,
    borderRadius: 8,
    border: `1px solid ${colors.warning}30`,
    fontSize: '14px',
  },
};

export default ChurnPrediction;