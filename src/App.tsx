import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Search } from './pages/Search';
import { useAuth } from './store/auth';

export const App = () => {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  return (
    <BrowserRouter basename='/fetch-take-home'>
      <Routes>
        <Route
          path='/'
          element={isLoggedIn ? <Navigate to='/search' /> : <Login />}
        />
        <Route
          path='/search'
          element={isLoggedIn ? <Search /> : <Navigate to='/' />}
        />
      </Routes>
    </BrowserRouter>
  );
};
