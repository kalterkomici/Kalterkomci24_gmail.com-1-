import React, { useState, useEffect } from 'react';

const RiskMatrix = () => {
  const [matrices, setMatrices] = useState([]);
  const [selectedMatrix, setSelectedMatrix] = useState(null);
  const [matrixName, setMatrixName] = useState('');
  const [selectedDimensions, setSelectedDimensions] = useState('3x3');

  const fetchMatrices = async () => {
    setMatrices([]);
  };

  useEffect(() => {
    fetchMatrices();
  }, []);

  const handleCreateMatrix = () => {
    const [rows, cols] = selectedDimensions.split('x').map(Number);
    const dimension = { '3x3': 1, '4x4': 2, '5x5': 3 }[selectedDimensions];
    const newMatrix = {
      id: Date.now(),
      name: matrixName,
      dimension,
      severities: Array(cols).fill(''),
      likelihoods: Array(rows).fill(''),
      risk_values: Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ label: '', color: '#ffffff' }))
      ),
    };
    setMatrices(prev => [...prev, newMatrix]);
    setMatrixName('');
    setSelectedDimensions('3x3');
  };

  const handleMatrixSelect = index => {
    setSelectedMatrix(matrices[index]);
  };

  const handleMatrixDelete = index => {
    setMatrices(prev => prev.filter((_, i) => i !== index));
    setSelectedMatrix(null);
  };

  const updateMatrixState = updater => {
    setSelectedMatrix(prev => updater({ ...prev }));
  };

  const handleRiskValueChange = (lIndex, sIndex, type, value) => {
    updateMatrixState(matrix => {
      matrix.risk_values[lIndex][sIndex][type] = value;
      return matrix;
    });
  };

  const handleSeverityChange = (sIndex, value) => {
    updateMatrixState(matrix => {
      matrix.severities[sIndex] = value;
      return matrix;
    });
  };

  const handleLikelihoodChange = (lIndex, value) => {
    updateMatrixState(matrix => {
      matrix.likelihoods[lIndex] = value;
      return matrix;
    });
  };

  const handleSaveMatrix = () => {
    setMatrices(prev =>
      prev.map(matrix =>
        matrix.id === selectedMatrix.id ? selectedMatrix : matrix
      )
    );
    alert('Matrix saved locally!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3 style={styles.title}>Create New Matrix</h3>
        <input
          type='text'
          placeholder='Matrix name'
          value={matrixName}
          onChange={e => setMatrixName(e.target.value)}
          style={styles.inputField}
        />
        <select
          value={selectedDimensions}
          onChange={e => setSelectedDimensions(e.target.value)}
          style={styles.dropdown}
        >
          <option value='3x3'>3x3</option>
          <option value='4x4'>4x4</option>
          <option value='5x5'>5x5</option>
        </select>
        <button onClick={handleCreateMatrix} style={styles.button}>
          Create
        </button>
        <h3 style={styles.title}>Matrices</h3>
        <ul style={styles.matrixList}>
          {matrices.map((matrix, index) => (
            <li
              key={matrix.id}
              style={styles.matrixItem}
              onClick={() => handleMatrixSelect(index)}
            >
              {matrix.name}
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleMatrixDelete(index);
                }}
                style={styles.deleteButton}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.main}>
        {selectedMatrix ? (
          <>
            <h2 style={styles.matrixTitle}>{selectedMatrix.name}</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Likelihood / Severity</th>
                  {selectedMatrix.severities.map((severity, sIndex) => (
                    <th key={sIndex} style={styles.tableHeader}>
                      <input
                        type='text'
                        value={severity}
                        onChange={e =>
                          handleSeverityChange(sIndex, e.target.value)
                        }
                        style={styles.inputField}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedMatrix.likelihoods.map((likelihood, lIndex) => (
                  <tr key={lIndex}>
                    <td style={styles.tableCell}>
                      <input
                        type='text'
                        value={likelihood}
                        onChange={e =>
                          handleLikelihoodChange(lIndex, e.target.value)
                        }
                        style={styles.inputField}
                      />
                    </td>
                    {selectedMatrix.severities.map((_, sIndex) => {
                      const riskValue = selectedMatrix.risk_values[lIndex]?.[
                        sIndex
                      ] || { label: '', color: '#ffffff' };
                      return (
                        <td key={sIndex} style={styles.tableCell}>
                          <input
                            type='text'
                            value={riskValue.label}
                            onChange={e =>
                              handleRiskValueChange(
                                lIndex,
                                sIndex,
                                'label',
                                e.target.value
                              )
                            }
                            style={{
                              ...styles.inputField,
                              backgroundColor: riskValue.color,
                            }}
                          />
                          <input
                            type='color'
                            value={riskValue.color}
                            onChange={e =>
                              handleRiskValueChange(
                                lIndex,
                                sIndex,
                                'color',
                                e.target.value
                              )
                            }
                            style={styles.colorPicker}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleSaveMatrix} style={styles.button}>
              Save
            </button>
          </>
        ) : (
          <p>Select a matrix to view</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  inputField: {
    width: '80%',
    padding: '8px',
    marginBottom: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  dropdown: {
    width: '100%',
    padding: '8px',
    marginBottom: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  matrixList: {
    listStyle: 'none',
    padding: '0',
    marginTop: '20px',
  },
  matrixItem: {
    padding: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '4px 8px',
    fontSize: '12px',
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  matrixTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  tableHeader: {
    padding: '12px',
    backgroundColor: '#717171',
    border: '1px solid #ddd',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'center',
  },
  colorPicker: {
    marginTop: '5px',
  },
};

export default RiskMatrix;
