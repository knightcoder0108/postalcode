import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [pincode, setPincode] = useState('');
  const [postOffices, setPostOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPincodeDetails = async () => {
    if (pincode.length !== 6) {
      setError('Postal code must be exactly 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setPostOffices([]);
    setFilteredOffices([]);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === 'Error' || !data[0].PostOffice) {
        setError('Invalid postal code or no data available');
      } else {
        setPostOffices(data[0].PostOffice);
        setFilteredOffices(data[0].PostOffice);
      }
    } catch (err) {
      setError('Error fetching postal data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value.toLowerCase();
    setFilterInput(filterValue);

    const filtered = postOffices.filter((office) =>
      office.Name.toLowerCase().includes(filterValue)
    );

    setFilteredOffices(filtered);
  };

  return (
    <div className="pincode-lookup-container">
      <h1>Enter Pincode</h1>
      <div className="form-group">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Pincode"
        />
        <button onClick={fetchPincodeDetails}>Lookup</button>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          {postOffices.length > 0 && (
            <>
              <h2>Pincode: {pincode}</h2>
              <p>Message: Number of pincode(s) found: {filteredOffices.length}</p>
              <div className="filter-group">
                <input
                  type="text"
                  value={filterInput}
                  onChange={handleFilter}
                  placeholder="Filter by Post Office Name"
                />
              </div>
              {filteredOffices.length === 0 && (
                <p>Couldn't find the postal data you're looking for…</p>
              )}
              <div className="results">
                {filteredOffices.map((office) => (
                  <div key={office.Name} className="office-details">
                    <p><strong>Name:</strong> {office.Name}</p>
                    <p><strong>Branch Type:</strong> {office.BranchType}</p>
                    <p><strong>Delivery Status:</strong> {office.DeliveryStatus}</p>
                    <p><strong>District:</strong> {office.District}</p>
                    <p><strong>Division:</strong> {office.Division}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
