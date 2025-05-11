import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export default combineReducers({
  auth: authReducer,
  cart: cartReducer,
});