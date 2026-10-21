import { useState } from 'react';

// Connects directly to App.jsx using the onScanSuccess prop
function CardScanner({ onScanSuccess }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState(null);

  const handleCameraCapture = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 1. Preview the picture locally on the screen
    setImage(URL.createObjectURL(file));
    setLoading(true);
    setCardData(null);

    // 2. Simulate the AI scanning delay (2 seconds)
    setTimeout(() => {
      setLoading(false);

      const mockCard = {
        playerName: 'Ken Griffey Jr.',
        manufacturer: 'Topps',
        year: '1989',
        setName: 'Traded Series',
        cardNumber: '41T',
        standingInfo: 'G: 127 | HR: 16 | RBI: 61 | AVG: .264',
      };

      setCardData(mockCard);

      // This passes the data directly into your App.jsx form inputs!
      if (onScanSuccess) {
        onScanSuccess(mockCard);
      }
    }, 2000);
  };

  return (
    <div className='flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-700 text-white rounded-xl max-w-md mx-auto shadow-inner'>
      <h2 className='text-sm font-bold mb-1 text-slate-200'>
        Scan Baseball Card
      </h2>
      <p className='text-slate-400 text-[11px] text-center mb-4'>
        Snap a photo of the card to auto-extract details.
      </p>

      <label className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow active:scale-95 transition-all text-xs tracking-wide'>
        📷 Snap Photo
        <input
          type='file'
          accept='image/*'
          capture='environment'
          onChange={handleCameraCapture}
          className='hidden'
        />
      </label>

      {image && (
        <div className='mt-4 w-32 h-44 rounded-lg overflow-hidden border border-slate-600 bg-black flex items-center justify-center'>
          <img
            src={image}
            alt='Preview'
            className='w-full h-full object-cover'
          />
        </div>
      )}

      {loading && (
        <div className='mt-3 flex items-center space-x-2 text-amber-400 text-xs animate-pulse'>
          <span>🔍</span>
          <span>Reading card metadata...</span>
        </div>
      )}

      {cardData && (
        <p className='mt-2 text-[11px] text-emerald-400 font-medium'>
          ✓ Scanned data imported below!
        </p>
      )}
    </div>
  );
}

export default CardScanner;
