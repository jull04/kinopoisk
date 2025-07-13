import './Header.css';
import { Link, useLocation } from 'react-router-dom';

function Header() {

  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className='header__container'>
          <Link 
            to={'/'} 
            className={pathname === '/' ? 'header__films header__active' : 'header__films'}>Все фильмы
          </Link>
          <Link 
            to={'/saved-movies'} 
            className={pathname === '/saved-movies' ? 'header__saved-films header__active' : 'header__saved-films'}>Любимые фильмы
          </Link>
        </div>  
    </header>
  );
}

export default Header;
