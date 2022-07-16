import React, { Fragment, useEffect, useState } from 'react';
import Country from '../components/Country';
import './Homepage.css';

const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export default function Homepage(props) {
   const [isDropdown, setIsDropdown] = useState(false);
   const [filter, setFilter] = useState(null);
   const [search, setSearch] = useState('');
   const [scrollUpIsVisible, setScrollUpisVisible] = useState(false);
   const { status, data, error } = props.countries;

   // Effect to make the scroll up div appear on down scroll
   useEffect(() => {
      const listenToScroll = () => {
         let heightToShowFrom = 800;
         const winScroll =
            document.body.scrollTop || document.documentElement.scrollTop;

         if (winScroll > heightToShowFrom) {
            setScrollUpisVisible(true);
         } else {
            scrollUpIsVisible && // to limit setting state only the first time
               setScrollUpisVisible(false);
         }
      };
      window.addEventListener('scroll', listenToScroll);
      return () => window.removeEventListener('scroll', listenToScroll);
   }, [setScrollUpisVisible, scrollUpIsVisible]);

   let filteredList;
   if (filter) {
      filteredList = data.filter((country) => country.region === filter);
   }

   let searchList;
   if (search) {
      searchList = data.filter(
         (country) =>
            country.name.common
               .toLowerCase()
               .includes(search.trim().toLowerCase()) ||
            country.name.official
               .toLowerCase()
               .includes(search.trim().toLowerCase())
      );
   }

   if (status === 'pending') {
      return <p className="centered">Loading...</p>;
   }

   if (error) {
      return <p className="centered">{error}</p>;
   }

   return (
      <Fragment>
         {scrollUpIsVisible && (
            <div
               onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
               }}
               className="scroll-up card"
            >
               <i className="fa-solid fa-arrow-up"></i>
            </div>
         )}

         <div className="filter">
            <form className="card" onSubmit={(e) => e.preventDefault()}>
               <i className="fa-solid fa-magnifying-glass"></i>
               <input
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  placeholder="Search for a country..."
               />
            </form>
            <div className={`dropdown card ${isDropdown ? 'active' : ''}`}>
               <div
                  className="sub-dropdown"
                  onClick={() => {
                     setIsDropdown((state) => !state);
                  }}
               >
                  {filter ? filter : 'Filter by Region'}
                  <div>
                     <i className="fa-solid fa-angle-up"></i>
                  </div>
               </div>
               <ul className="dropdown-content card">
                  {regions.map((region) => (
                     <li key={region} onClick={() => setFilter(region)}>
                        {region}
                     </li>
                  ))}
               </ul>
               {filter && (
                  <button onClick={() => setFilter(null)}>Reset</button>
               )}
            </div>
         </div>
         <div className="countries">
            {!filter &&
               !search &&
               data.map((country) => (
                  <Country data={country} key={country.name.official} />
               ))}
            {filter &&
               !search &&
               filteredList.map((country) => (
                  <Country data={country} key={country.name.official} />
               ))}
            {search &&
               searchList.map((country) => (
                  <Country data={country} key={country.name.official} />
               ))}
         </div>
      </Fragment>
   );
}
