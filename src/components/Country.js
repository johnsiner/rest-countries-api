import React from 'react';
import classes from './Country.module.css';
import { useNavigate } from 'react-router-dom';

export default function Country(props) {
   const { data } = props;
   const navigate = useNavigate();
   return (
      <div
         className={`${classes.country} card`}
         onClick={() => navigate(`/${data.name.common}`)}
      >
         <div className={classes.flag}>
            <img src={data.flags.png} alt="flag" />
         </div>
         <div className={classes.details}>
            <h3>{data.name.common}</h3>
            <p>
               <span>Population:</span> {data.population.toLocaleString()}
            </p>
            <p>
               <span>Region:</span> {data.region}
            </p>
            <p>
               <span>Capital:</span> {data.capital}
            </p>
         </div>
      </div>
   );
}
