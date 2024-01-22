import { useAppContext } from '../../AppContext'; 

const Placepickup = () => {
  const { plasticData, paperData, clothesData, ewasteData, woodData } = useAppContext();

  const renderDetails = () => {
    const renderCategory = (data, category) => {
      if (data && data.items && data.weight) {
        const items = data.items.split(',').map(item => item.trim());
        const categoryText = (
          <>
            <strong>{category}:</strong> {items.join(', ')}
          </>
        );
        const weightText = `Weight(in Kg): ${data.weight}`;

        return (
          <div>
            <p>{categoryText}</p>
            <p>{weightText}</p>
          </div>
        );
      } else {
        return null; // Render nothing if data is missing or incomplete
      }
    };

    return (
      <div className="border border-dark rounded p-4 mb-4">
        <h2 className="mb-3">Pickup Details</h2>
        {renderCategory(plasticData, 'Plastic')}
        {renderCategory(paperData, 'Paper')}
        {renderCategory(clothesData, 'Clothes')}
        {renderCategory(ewasteData, 'Ewaste')}
        {renderCategory(woodData, 'Wood')}
      </div>
    );
  };

  return (
    <div>
      {renderDetails()}
    </div>
  );
};

export default Placepickup;