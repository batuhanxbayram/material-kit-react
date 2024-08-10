import axios from 'axios';

const API_URL = 'http://localhost:5224/api';

 const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/Login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export default login;
