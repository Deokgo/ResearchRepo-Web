import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayResearchInfo = () => {
    const location = useLocation();
    const { id } = location.state || {}; // Default to an empty object if state is undefined
    const [data, setData] = useState(null); // Start with null to represent no data
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/dataset/fetch_ordered_dataset/${id}`);
                    const fetchedDataset = response.data.dataset || []; // Use empty array if dataset is undefined
                    console.log("Fetched data:", fetchedDataset);
                    setData({ dataset: fetchedDataset });
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setData({ dataset: [] }); // Set an empty dataset on error
                } finally {
                    setLoading(false); // Stop loading regardless of success or failure
                }
            };
            fetchData();
        } else {
            console.warn("ID is undefined or null:", id);
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return <p>Loading research information...</p>;
    }

    return (
        <div>
            {data && data.dataset && data.dataset.length > 0 ? (
                data.dataset.map((item, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        <h3>{item.title}</h3>
                        <p><strong>Research Code:</strong> {item.research_id}</p>
                        <p><strong>College Department:</strong> {item.college_id}</p>
                        <p><strong>Program:</strong> {item.program_name}</p>
                        <p><strong>Authors:</strong> {item.concatenated_authors}</p>
                        <p><strong>Abstract:</strong> {item.abstract}</p>
                        <p><strong>Keywords:</strong> {item.concatenated_keywords}</p>
                        <p><strong>Journal:</strong> {item.journal}</p>
                        <p><strong>Research Type:</strong> {item.research_type}</p>
                        <p><strong>SDG:</strong> {item.sdg}</p>
                        <p><strong>Year:</strong> {item.year}</p>
                        <p><strong>Download Count:</strong> {item.download_count}</p>
                        <p><strong>View Count:</strong> {item.view_count}</p>
                    </div>
                ))
            ) : (
                <div>
                    <p>No research information available.</p>
                </div>
            )}
        </div>
    );
};

export default DisplayResearchInfo;
