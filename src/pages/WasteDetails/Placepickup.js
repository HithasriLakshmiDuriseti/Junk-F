import { useAppContext } from '../../AppContext';
import { useEffect, useState } from 'react';
import { useConfirmContext } from '../../ConfirmContext';
import { useAuth } from '../../authentication/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { init, send } from 'emailjs-com';
import 'react-toastify/dist/ReactToastify.css';

const Placepickup = () => {
  const { plasticData, paperData, clothesData, ewasteData, woodData } = useAppContext();
  const [pickupConfirmed, setPickupConfirmed] = useState(false);
  const { wasteData, setWasteData, totalCoins, updateTotalCoins } = useConfirmContext();
  const {user} = useAuth();
  
  const getCoinsPerKg = (wasteType) => {
    switch (wasteType) {
      case 'Plastic':
        return 14;
      case 'Paper':
        return 10;
      case 'Ewaste':
        return 30;
      case 'Clothes':
        return 14;
      case 'Wood':
        return 10;
      default:
        return 0;
    }
  };

  const getCoins = (weight, costPerKg) => {
    return Math.round(weight * costPerKg);
  };

  const renderCategory = (data, category, costPerKg) => {
    if (data && data.items && data.weight) {
      const items = data.items.split(',').map(item => item.trim());
      const categoryText = (
        <>
          <strong>{category}:</strong> {items.join(', ')}
        </>
      );
      const weightText = `Weight(in Kg): ${data.weight}`;
      const coinsText = `Coins: ${getCoins(data.weight, costPerKg)}`;

      return (
        <div key={category}>
          <p>{categoryText}</p>
          <p>{weightText}</p>
          <p>{coinsText}</p>
        </div>
      );
    } else {
      return null; // Render nothing if data is missing or incomplete
    }
  };

  const handleConfirmPickup = () => {
    const data = {
      category: '',
      weight: 0,
    };
    const categories = [
      { data: plasticData, type: 'Plastic', costPerKg: 14 },
      { data: paperData, type: 'Paper', costPerKg: 10 },
      { data: clothesData, type: 'Clothes', costPerKg: 14 },
      { data: ewasteData, type: 'Ewaste', costPerKg: 30 },
      { data: woodData, type: 'Wood', costPerKg: 10 },
    ];

    categories.forEach((categoryInfo) => {
      const categoryData = categoryInfo.data;
      const categoryType = categoryInfo.type;

      if (categoryData && categoryData.items && categoryData.weight) {
        const items = (categoryData.items || '').split(',').map(item => item.trim());
        const categoryText = `${categoryType}:`;

        data.category += categoryText;
        if (items.length > 0) {
          items.forEach((item, index) => {
            if (index > 0) {
              data.category += `,${item}`;
            } else {
              data.category += `${item}`;
            }
          });
        }
        data.category += ' ';
        data.weight += parseFloat(categoryData.weight);
        const coinsPerKg = getCoinsPerKg(categoryType); 
        // Assuming you have a function to get coinsPerKg
        updateTotalCoins(categoryData.weight, coinsPerKg);
      }
    });

    toast.success('Pickup confirmed successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    init('4FbP1-VjPRwd8OwcJ'); // Replace 'YOUR_USER_ID' with your actual user ID (if needed)

    const templateParams = {
      user_email: user.email,
      category: data.category,
      weight: data.weight,
    };
    console.log('Template Params After:', templateParams);

    send('service_s8u69pl', 'template_fxrs5m7', templateParams)
      .then((response) => {
        console.log( response.text);
        toast.success('Email sent successfully!');
      })
      .catch((error) => {
        console.error( error.text);
        toast.error('Failed to send email. Please try again later.');
      });

    setWasteData(data);
    setPickupConfirmed(true);

  };


  useEffect(() => {
    if (pickupConfirmed) {
      fetch('http://localhost:8081/WasteDetails/pickup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email, 
          category: wasteData.category,
          weight: wasteData.weight,
          coins: totalCoins,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', wasteData);
          // Handle success response if needed
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle error if needed
        });
    }
  }, [pickupConfirmed, wasteData, totalCoins, user]);



  return (

    <div className="border border-dark rounded p-4 mb-4">
      <h2 className="mb-3">Pickup Details</h2>

      {renderCategory(plasticData, 'Plastic', 14)}
      {renderCategory(paperData, 'Paper', 10)}
      {renderCategory(clothesData, 'Clothes', 14)}
      {renderCategory(ewasteData, 'Ewaste', 30)}
      {renderCategory(woodData, 'Wood', 10)}
      {pickupConfirmed && (
        <p className="success-message mb-4">Pickup confirmed successfully!</p>
      )}
      <button className="btn btn-primary confirmpickup " id="pp" onClick={handleConfirmPickup}>
        Confirm Pickup
      </button>
      <ToastContainer/>
    </div>
  );

};
export default Placepickup;