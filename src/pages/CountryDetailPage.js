import React, { useEffect } from 'react';
import './CountryDetailPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import useHttp, { getCountry } from '../hooks/use-http';

export default function CountryDetailPage(props) {
   const params = useParams();
   const { country } = params;
   const navigate = useNavigate();

   const { sendRequest, status, data, error } = useHttp(getCountry, true);

   useEffect(() => {
      sendRequest(country);
   }, [sendRequest, country]);

   if (status === 'pending') {
      return <p className="centered">loading...</p>;
   }

   if (error) {
      return <p className="centered">{error}</p>;
   }

   let nativeName;
   let currenciesKeys;
   let languageKeys;
   let bordersList = [];
   if (status === 'completed') {
      const nativeNameKey = Object.keys(data[0].name.nativeName)[0];
      nativeName = data[0].name.nativeName[nativeNameKey].common;

      currenciesKeys = Object.keys(data[0].currencies);
      languageKeys = Object.keys(data[0].languages);

      props.code &&
         data[0].borders &&
         data[0].borders.map((border) => bordersList.push(props.code[border]));
   }

   return (
      <div className="country-detail-page">
         <div className="card back" onClick={() => navigate('/')}>
            <i className="fa-solid fa-arrow-left-long"></i>
            <p>Back</p>
         </div>
         <div className="country-main">
            <div className="left-side">
               <img src={data[0].flags.svg} alt="flag" />
            </div>
            <div className="right-side">
               <h1>{data[0].name.common}</h1>
               <div className="country-details">
                  <div className="left-details">
                     <p>
                        Native Name: <span>{nativeName}</span>
                     </p>
                     <p>
                        Population:{' '}
                        <span>{data[0].population.toLocaleString()}</span>
                     </p>
                     <p>
                        Region: <span>{data[0].region}</span>
                     </p>
                     <p>
                        Sub Region: <span>{data[0].subregion}</span>
                     </p>
                     <p>
                        Capital: <span>{data[0].capital}</span>
                     </p>
                  </div>
                  <div className="right-details">
                     <p>
                        Top Level Domain: <span>{data[0].tld[0]}</span>
                     </p>
                     <p>
                        {currenciesKeys.length > 1
                           ? 'Currencies: '
                           : 'Currency: '}
                        <span>
                           {currenciesKeys.map((key, i) => (
                              <span key={key}>
                                 {data[0].currencies[key].name}
                                 {i + 1 < currenciesKeys.length && ', '}
                              </span>
                           ))}
                        </span>
                     </p>
                     <p>
                        {languageKeys.length > 1 ? 'Languages: ' : 'Language: '}
                        <span>
                           {languageKeys.map((key, i) => (
                              <span key={key}>
                                 {data[0].languages[key]}
                                 {i + 1 < languageKeys.length && ', '}
                              </span>
                           ))}
                        </span>
                     </p>
                  </div>
               </div>
               {props.code && data[0].borders ? (
                  <div className="border">
                     <p>
                        Border{' '}
                        {bordersList.length > 1 ? 'Countries: ' : 'Country: '}
                     </p>
                     {bordersList.map((i) => (
                        <p
                           key={i}
                           className="card"
                           onClick={() => navigate(`/${i}`)}
                        >
                           {i}
                        </p>
                     ))}
                  </div>
               ) : (
                  <p>No Border Countries</p>
               )}
            </div>
         </div>
      </div>
   );
}
