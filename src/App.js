import { useEffect, useState } from 'react';
import './App.css';
import sunIcon from './assets/icon-sun.svg';
import moonIcon from './assets/icon-moon.svg';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import useThemeDetector from './hooks/useThemeDetector';
import CountryDetailPage from './pages/CountryDetailPage';
import useHttp, { getCountries } from './hooks/use-http';

function App() {
   const [theme, setTheme] = useState(useThemeDetector() ? 'dark' : 'light');

   const { sendRequest, status, data, error } = useHttp(getCountries, true);

   useEffect(() => {
      sendRequest();
   }, [sendRequest]);

   let code;
   if (status === 'completed') {
      code = {};
      data.forEach((element) => {
         code[element.cca3] = element.name.common;
      });
   }

   return (
      <div className="app" id={theme}>
         <header>
            <div className="container">
               <h1>Where in the world?</h1>
               <button
                  onClick={() =>
                     setTheme((state) => (state === 'light' ? 'dark' : 'light'))
                  }
               >
                  <img src={theme === 'light' ? moonIcon : sunIcon} alt="" />
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
               </button>
            </div>
         </header>
         <main className="container">
            <Routes>
               <Route
                  path="/"
                  element={<Homepage countries={{ status, data, error }} />}
               />
               <Route
                  path="/:country"
                  element={<CountryDetailPage code={code} />}
               />
            </Routes>
         </main>
      </div>
   );
}

export default App;
