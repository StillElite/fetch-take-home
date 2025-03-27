import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  currentPage: number;
  prevPage: string | null;
  nextPage: string | null;
  onPrevious: () => void;
  onNext: () => void;
  favoriteCount: number;
  onMatch: () => void;
  onClearFavorites: () => void;
  matchedDog: boolean;
}

export const PaginationSection = ({
  currentPage,
  prevPage,
  nextPage,
  onPrevious,
  onNext,
  favoriteCount,
  onMatch,
  onClearFavorites,
  matchedDog,
}: Props) => {
  return (
    <section className='mt-12 bg-gray-100 p-6 rounded-lg shadow flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center'>
      {/* Pagination */}
      <div className='flex items-center gap-3 justify-center'>
        <button
          onClick={onPrevious}
          disabled={!prevPage}
          aria-label='Previous page'
          className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md border border-blue-900/20 ${
            prevPage
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <span className='font-semibold text-gray-700'>Page {currentPage}</span>

        <button
          onClick={onNext}
          disabled={!nextPage}
          aria-label='Next page'
          className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md border border-blue-900/20 ${
            nextPage
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Match + Clear */}
      <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
        {favoriteCount > 0 && !matchedDog && (
          <button
            onClick={onMatch}
            className='px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold w-full sm:w-auto text-center'
          >
            Find My Match ({favoriteCount})
          </button>
        )}

        {favoriteCount > 0 && !matchedDog && (
          <button
            onClick={onClearFavorites}
            className='text-sm text-blue-600 underline w-full sm:w-auto text-center'
          >
            Clear Favorites
          </button>
        )}
      </div>
    </section>
  );
};
