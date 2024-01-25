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

export const deleteAccount = async (userId) => {
  try {
    console.log('1delete')
    const response = await axios.delete(`/api/users/${userId}`);
    console.log('2delete')
    return response.data;
  } catch (error) {
    console.error(error);
  }
  console.log('3delete')
};

export async function changePassword(userId, newPassword) {
  try {
    const response = await axios.put(`/api/users/${userId}/password`, { password: newPassword });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}