import { useEffect } from 'react';
import { Dog } from './DogCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface MatchModalProps {
  dog: Dog;
  onClose: () => void;
  onClearFavorites: () => void;
}

/**
 * NOTE: In a real-world application, we would abstract this into a generic reusable Modal component
 * with proper accessibility, keyboard traps, and focus management.
 * For the purposes of this take-home, this modal is simplified to support click-outside-to-close
 * and clean user flow for matchmaking.
 */

export const MatchModal = ({
  dog,
  onClose,
  onClearFavorites,
}: MatchModalProps) => {
  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('match-modal');
      if (modal && !modal.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div
        id='match-modal'
        className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative'
      >
        <h2 className='text-2xl font-bold text-orange-600 mb-2 text-center'>
          Your Match Made in Dog Heaven
        </h2>

        <img
          src={dog.img}
          alt={dog.name}
          className='w-full h-64 object-contain rounded mb-4'
        />

        <div className='text-center space-y-1'>
          <h3 className='text-xl font-semibold text-gray-800'>{dog.name}</h3>
          <p className='text-gray-600'>{dog.breed}</p>
          <p className='text-gray-600'>Age: {dog.age}</p>
          <p className='text-gray-600'>Zip Code: {dog.zip_code}</p>
        </div>

        <div className='mt-6 flex flex-col sm:flex-row gap-3 justify-center'>
          <button
            onClick={() =>
              alert('In a real app, this would start the adoption process!')
            }
            className='w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold'
          >
            Adopt Me
          </button>

          <button
            onClick={onClearFavorites}
            className='w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold'
          >
            Clear Favorites
          </button>
        </div>

        <button
          onClick={onClose}
          className='absolute top-2 right-3 text-gray-400 hover:text-black text-xl'
          aria-label='Close modal'
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};
