import axios from 'axios';

axios.interceptors.response.use(
  response => {
    // Se la risposta è ok, la restituiamo direttamente
    return response;
  },
  error => {
    // Se l'errore è ECONNABORTED, lo gestiamo
    if (error.code === 'ECONNABORTED') {
      console.log('Request aborted');
    } else {
      // Se l'errore è diverso, lo rilanciamo
      return Promise.reject(error);
    }
  }
);

export default axios;