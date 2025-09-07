// src/components/ProfessorList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfessorList = () => {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    // Add state for date filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // We will now move the fetching logic into a function we can call anytime
    const fetchProfessors = async () => {
        setLoading(true);
        let url = 'http://127.0.0.1:8000/api/professors/';
        
        // If both dates are set, add them as query parameters
        if (startDate && endDate) {
            url += `?start_date=${startDate}&end_date=${endDate}`;
        }

        try {
            const response = await axios.get(url);
            setProfessors(response.data);
        } catch (error) {
            console.error("There was an error fetching the professors!", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchProfessors();
    }, []);

    const handleFilterSubmit = (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        fetchProfessors(); // Re-fetch data with the new filters
    };
    
    // ... (the return JSX is below)
    return (
        <div>
            <h1>Professor Dashboard</h1>
            
            <form onSubmit={handleFilterSubmit}>
                <h3>Filter by Publication Date</h3>
                <label>Start Date: </label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <label style={{ marginLeft: '10px' }}>End Date: </label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                <button type="submit" style={{ marginLeft: '10px' }}>Apply Filter</button>
            </form>

            <hr />

            {loading ? <p>Loading...</p> : (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    {/* ... The table structure remains exactly the same ... */}
                </table>
            )}
        </div>
    );
};

export default ProfessorList;