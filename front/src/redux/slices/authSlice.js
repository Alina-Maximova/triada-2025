// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null
};
function decodeJWT(token) {
  try {
    // Разбиваем токен на части
    const [header, payload, signature] = token.split('.');

    // Декодируем payload из base64
    const decodedPayload = JSON.parse(atob(payload));

    return decodedPayload;
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return null;
  }
}


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      const decoded = decodeJWT(action.payload.token);
      state.user = decoded;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;