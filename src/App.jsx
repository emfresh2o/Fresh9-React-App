import { useState, useEffect } from 'react';
import CardScanner from './CardScanner';
import baseballLogo from './assets/Fresh9Logo.png';

export default function App() {
  // Load initial cards from LocalStorage
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('fresh9_cards');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save cards to LocalStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('fresh9_cards', JSON.stringify(cards));
  }, [cards]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    player: '',
    year: '',
    manufacturer: '',
    cardNumber: '',
    team: '',
    condition: 'Near Mint',
    value: '',
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Adding a Card
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.player.trim()) return;

    const newCard = {
      id: Date.now(),
      ...formData,
      value: parseFloat(formData.value) || 0,
    };

    setCards((prev) => [newCard, ...prev]);

    // Reset Form & Close Modal
    setFormData({
      player: '',
      year: '',
      manufacturer: '',
      cardNumber: '',
      team: '',
      condition: 'Near Mint',
      value: '',
    });
    setIsModalOpen(false);
  };

  // Calculate Total Value
  const totalValue = cards.reduce((sum, card) => sum + (card.value || 0), 0);

  return (
    <div className='min-h-screen bg-slate-900 text-slate-100 font-sans pb-12'>
      {/* Header */}
      <header className='bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10 shadow-md'>
        <div className='max-w-md mx-auto flex justify-between items-center'>
          {/* Freshwater Wave Logo & Title */}
          <div className='flex items-center gap-2.5'>
            {/* White Circle Badge containing your new AI Logo */}
            <div className='relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md overflow-hidden border-2 border-slate-200'>
              <img
                src={baseballLogo}
                alt='Fresh9 Baseball Logo'
                className='w-full h-full object-cover'
              />
            </div>

            <div>
              <h1 className='text-xl font-bold text-white tracking-tight'>
                {' '}
                Fresh9{' '}
              </h1>
              <p className='text-[11px] text-slate-400 leading-tight'>
                {' '}
                Freshwater Baseball Vault{' '}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className='max-w-md mx-auto p-4 space-y-4'>
        {/* Quick Stats Bar */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-slate-800 p-3 rounded-xl border border-slate-700'>
            <p className='text-xs text-slate-400'>Total Cards</p>
            <p className='text-2xl font-extrabold text-white'>{cards.length}</p>
          </div>
          <div className='bg-slate-800 p-3 rounded-xl border border-slate-700'>
            <p className='text-xs text-slate-400'>Est. Vault Value</p>
            <p className='text-2xl font-extrabold text-emerald-400'>
              ${totalValue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Empty Collection View */}
        {cards.length === 0 ? (
          <div className='bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-8 text-center space-y-3 mt-6'>
            <div className='text-4xl'>⚾</div>
            <h3 className='text-base font-semibold text-slate-200'>
              No cards in your vault yet
            </h3>
            <p className='text-xs text-slate-400 max-w-xs mx-auto'>
              Ready to digitize those shoe boxes? Tap below to log your first
              baseball card.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className='bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm shadow transition inline-block'
            >
              Add Your First Card
            </button>
          </div>
        ) : (
          /* Cards Grid / List View */
          <div className='space-y-3'>
            <h2 className='text-sm font-semibold text-slate-400 uppercase tracking-wider'>
              Vault Inventory
            </h2>
            {cards.map((card) => (
              <div
                key={card.id}
                className='bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center shadow-sm'
              >
                <div>
                  <h3 className='font-bold text-slate-100'>{card.player}</h3>
                  <p className='text-xs text-slate-400'>
                    {card.year} {card.manufacturer}{' '}
                    {card.cardNumber && `#${card.cardNumber}`} • {card.team}
                  </p>
                  <span className='inline-block mt-1 text-[10px] bg-slate-700 text-amber-300 px-2 py-0.5 rounded'>
                    {card.condition}
                  </span>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-bold text-emerald-400'>
                    ${card.value.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Card Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4'>
          <div className='bg-slate-800 border border-slate-700 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center border-b border-slate-700 pb-3'>
              <h2 className='text-lg font-bold text-amber-400'>
                Log New Baseball Card
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-slate-400 hover:text-white text-xl font-bold px-2'
              >
                ✕
              </button>
            </div>

            {/* Card Scanner */}
            <CardScanner
              onScanSuccess={(scannedDetails) => {
                setFormData({
                  player: scannedDetails.playerName,
                  year: scannedDetails.year,
                  manufacturer: `${scannedDetails.manufacturer} ${scannedDetails.setName}`,
                  cardNumber: scannedDetails.cardNumber,
                  team: 'Mariners',
                  condition: 'Near Mint',
                  value: '',
                });
              }}
            />

            <form onSubmit={handleSubmit} className='space-y-3'>
              <div>
                <label className='block text-xs text-slate-300 mb-1'>
                  Player Name *
                </label>
                <input
                  type='text'
                  name='player'
                  required
                  value={formData.player}
                  onChange={handleChange}
                  placeholder='e.g. Adley Rutschman'
                  className='w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500'
                />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs text-slate-300 mb-1'>
                    Year
                  </label>
                  <input
                    type='text'
                    name='year'
                    value={formData.year}
                    onChange={handleChange}
                    placeholder='e.g. 2023'
                    className='w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500'
                  />
                </div>
                <div>
                  <label className='block text-xs text-slate-300 mb-1'>
                    Brand / Set
                  </label>
                  <input
                    type='text'
                    name='manufacturer'
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder='e.g. Topps Chrome'
                    className='w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs text-slate-300 mb-1'>
                    Card Number
                  </label>
                  <input
                    type='text'
                    name='cardNumber'
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder='e.g. 250'
                    className='w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500'
                  />
                </div>
                <div>
                  <label className='block text-xs text-slate-300 mb-1'>
                    Team
                  </label>
                  <input
                    type='text'
                    name='team'
                    value={formData.team}
                    onChange={handleChange}
                    placeholder='e.g. Orioles'
                    className='w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs text-slate-300 mb-1'>
                    Condition
                  </label>
                  <select
                    name='condition'
                    value={formData.condition}
                    onChange={handleChange}
                    className='w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500'
                  >
                    <option value='Mint'>Mint</option>
                    <option value='Near Mint'>Near Mint</option>
                    <option value='Excellent'>Excellent</option>
                    <option value='Very Good'>Very Good</option>
                    <option value='Poor'>Poor</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs text-slate-300 mb-1'>
                    Est. Value ($)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    name='value'
                    value={formData.value}
                    onChange={handleChange}
                    placeholder='0.00'
                    className='w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500'
                  />
                </div>
              </div>

              <div className='pt-2 flex gap-3'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='w-1/2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg font-semibold text-sm transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='w-1/2 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-semibold text-sm transition shadow'
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
