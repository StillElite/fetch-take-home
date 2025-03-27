import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog } from '@fortawesome/free-solid-svg-icons';

export const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(name, email);
    if (success) {
      navigate('/search');
    } else {
      setError('Login failed. Please check your info.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-5'
      >
        <h1 className='text-2xl font-bold text-orange-600 text-center flex items-center justify-center gap-2'>
          <FontAwesomeIcon icon={faDog} className='text-blue-500' />
          Find-A-Friend
        </h1>

        <p className='text-center text-gray-500 text-sm'>
          Log in to start your search!
        </p>

        <div>
          <label htmlFor='name' className='sr-only'>
            Name
          </label>
          <input
            id='name'
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400'
            required
          />
        </div>

        <div>
          <label htmlFor='email' className='sr-only'>
            Email
          </label>
          <input
            id='email'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400'
            required
          />
        </div>

        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

        <button
          type='submit'
          className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        >
          Login
        </button>
      </form>
    </div>
  );
};
