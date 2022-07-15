import {
  useReducer,
  useCallback
} from 'react';

function httpReducer(state, action) {
  if (action.type === 'SEND') {
    return {
      data: null,
      error: null,
      status: 'pending',
    };
  }

  if (action.type === 'SUCCESS') {
    return {
      data: action.responseData,
      error: null,
      status: 'completed',
    };
  }

  if (action.type === 'ERROR') {
    return {
      data: null,
      error: action.errorMessage,
      status: 'completed',
    };
  }

  return state;
}

function useHttp(requestFunction, startWithPending = false) {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? 'pending' : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async function (requestData) {
        dispatch({
          type: 'SEND'
        });
        try {
          const responseData = await requestFunction(requestData);
          dispatch({
            type: 'SUCCESS',
            responseData
          });
        } catch (error) {
          dispatch({
            type: 'ERROR',
            errorMessage: error.message || 'Something went wrong!',
          });
        }
      },
      [requestFunction]
  );

  return {
    sendRequest,
    ...httpState,
  };
}

export const getCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();

  if (!response.ok) {
    throw new Error('something went wrong');
  }
  return data;
}

export const getCountry = async (name) => {
  const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('something went wrong');
  }
  return data;
}

export default useHttp;