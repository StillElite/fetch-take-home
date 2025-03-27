import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Login } from './pages/Login';
import { Search } from './pages/Search';
import { useAuth } from './store/auth';

function App() {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  return (
    <Router>
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
    </Router>
  );
}

export default App;
