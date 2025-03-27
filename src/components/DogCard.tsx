import { useFavorites } from '../store/favorites';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface Props {
  dog: Dog;
}

export const DogCard = ({ dog }: Props) => {
  const { favoriteIds, toggleFavorite } = useFavorites();

  const isFavorited = favoriteIds.includes(dog.id);

  return (
    <div className='border p-4 rounded shadow bg-white relative'>
      <button
        onClick={() => toggleFavorite(dog.id)}
        className='absolute top-2 right-2 text-2xl w-10 h-10 flex items-center justify-center rounded-full shadow-sm border bg-white'
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <FontAwesomeIcon
          icon={isFavorited ? solidHeart : regularHeart}
          className={isFavorited ? 'text-red-500' : 'text-gray-400'}
        />
      </button>

      <img
        src={dog.img}
        alt={dog.name}
        className='w-full h-48 object-contain bg-gray-100 rounded'
      />
      <h2 className='text-xl font-bold text-orange-700 mt-2'>{dog.name}</h2>
      <p className='text-gray-700 font-medium'>{dog.breed}</p>
      <p className='text-gray-600'>Age: {dog.age}</p>
      <p className='text-gray-600'>Zip Code: {dog.zip_code}</p>
    </div>
  );
};
