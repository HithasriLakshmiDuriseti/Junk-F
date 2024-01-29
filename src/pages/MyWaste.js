import { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext'; 
import './MyWaste.css';
import {Container, Card} from 'react-bootstrap';

const MyWaste = () => {
  const { user } = useAuth();
  const [wasteData, setWasteData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.email) {
      fetch(`http://localhost:8081/api/getMyWaste?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setWasteData(data.data);
            setShowData(true);
            setError('');
          } else {
            setError(`Error fetching waste data: ${data.message}`);
          }
        })
        .catch(error => {
          setError(`Error: ${error.message}`);
        });
    }
  }, [user]);

  return (
    <div>
    <h2>MyWaste Page</h2>
    <Container>
      

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showData && (
        <div className="waste-card-container">
          {wasteData.map((row, index) => (
            <Card key={index} className="waste-card">
              <Card.Body>
                <Card.Title>{row.category}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Weight: {row.weight}</Card.Subtitle>
                <Card.Text>Coins: {row.coins}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
    </div>
  );
};

export default MyWaste;
