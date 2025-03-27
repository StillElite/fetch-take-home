import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dog, DogCard } from '../components/DogCard';
import { useFavorites } from '../store/favorites';
import { useAuth } from '../store/auth';
import { PaginationSection } from '../components/PaginationSection';
import { MatchModal } from '../components/MatchModal';

export const Search = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [paginationQuery, setPaginationQuery] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  const { favoriteIds, clearFavorites } = useFavorites();

  // Fetch list of dog breeds on initial render.
  // This populates the breed filter dropdown.
  // We define an async function inside useEffect since useEffect cannot be async.
  // fetchBreeds is defined and immediately called inside useEffect.

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await axios.get<string[]>(
          'https://frontend-take-home-service.fetch.com/dogs/breeds',
          { withCredentials: true }
        );
        setBreeds(res.data);
      } catch (err) {
        console.error('Failed to fetch breeds:', err);
      }
    };

    fetchBreeds();
  }, []);

  // Fetch dogs on filter/sort/pagination change
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        // Reset pagination for fresh search
        if (!paginationQuery) {
          setCurrentPage(1);
          setNextPage(null);
          setPrevPage(null);
        }

        const searchUrl = paginationQuery
          ? `https://frontend-take-home-service.fetch.com${paginationQuery}`
          : 'https://frontend-take-home-service.fetch.com/dogs/search';

        const searchRes = await axios.get(searchUrl, {
          params: paginationQuery
            ? undefined
            : {
                breeds: selectedBreed ? [selectedBreed] : undefined,
                sort: `breed:${sort}`,
                size: 20,
              },
          withCredentials: true,
        });

        const { resultIds, next, prev } = searchRes.data;

        setNextPage(next || null);
        setPrevPage(prev || null);

        if (!resultIds?.length) {
          setDogs([]);
          return;
        }

        const dogsRes = await axios.post<Dog[]>(
          'https://frontend-take-home-service.fetch.com/dogs',
          resultIds,
          { withCredentials: true }
        );

        const sortedDogs = resultIds
          .map((id: string) => dogsRes.data.find((dog) => dog.id === id))
          .filter((dog: Dog): dog is Dog => !!dog);

        setDogs(sortedDogs);
      } catch (err) {
        console.error('Failed to fetch dogs:', err);
      }
    };

    fetchDogs();
  }, [selectedBreed, sort, paginationQuery]);

  // Matchmaking logic
  const handleGenerateMatch = async () => {
    try {
      const matchRes = await axios.post<{ match: string }>(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        favoriteIds,
        { withCredentials: true }
      );

      const matchedId = matchRes.data.match;

      const dogRes = await axios.post<Dog[]>(
        'https://frontend-take-home-service.fetch.com/dogs',
        [matchedId],
        { withCredentials: true }
      );

      setMatchedDog(dogRes.data[0]);
    } catch (err) {
      console.error('Failed to fetch match:', err);
    }
  };

  return (
    <>
      <header className='bg-blue-500 text-white py-4 px-6 mb-6 shadow-md flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Find-A-Friend</h1>
        <button
          onClick={() => {
            useAuth.getState().logout();
            window.location.href = '/';
          }}
          className='text-sm underline hover:text-gray-200 transition'
        >
          Logout
        </button>
      </header>
      <main className='p-8 space-y-6'>
        {/* Filter & Sort */}
        <div className='flex gap-4 items-center'>
          <select
            value={selectedBreed}
            onChange={(e) => {
              setSelectedBreed(e.target.value);
              setPaginationQuery(null);
            }}
            className='p-2 border rounded'
          >
            <option value=''>All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (!selectedBreed) {
                setSort(sort === 'asc' ? 'desc' : 'asc');
              }
            }}
            disabled={selectedBreed !== ''}
            title={
              selectedBreed
                ? 'Sorting disabled when filtering by a single breed'
                : ''
            }
            className={`px-4 py-2 rounded text-white font-semibold transition ${
              selectedBreed
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            <span className='hidden xs:inline'>Sort Breeds: </span>
            {sort.toUpperCase()}
          </button>
        </div>

        {/* Dog Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
          {dogs.length === 0 && paginationQuery === null && (
            <p>No dogs found for selected filters.</p>
          )}
        </div>

        <PaginationSection
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          onPrevious={() => {
            if (prevPage) {
              setPaginationQuery(prevPage);
              setCurrentPage((p) => Math.max(1, p - 1));
            }
          }}
          onNext={() => {
            if (nextPage) {
              setPaginationQuery(nextPage);
              setCurrentPage((p) => p + 1);
            }
          }}
          favoriteCount={favoriteIds.length}
          matchedDog={!!matchedDog}
          onMatch={handleGenerateMatch}
          onClearFavorites={clearFavorites}
        />

        {/* Match Modal */}
        {matchedDog && (
          <MatchModal
            dog={matchedDog}
            onClose={() => setMatchedDog(null)}
            onClearFavorites={() => {
              clearFavorites();
              setMatchedDog(null);
            }}
          />
        )}
      </main>
    </>
  );
};
