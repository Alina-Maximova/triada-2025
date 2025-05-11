// src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
function calculateTotalCount(items, services) {
  const itemsCount = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  const servicesCount = Array.isArray(services) ? services.reduce((sum, service) => sum + (service.quantity || 0), 0) : 0;
  console.log(itemsCount+""+servicesCount)
  return itemsCount + servicesCount;
}
const initialState = {
  items: [],
  services: [],
  locality_id: null,
  count: 0
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.count = state.items.reduce((sum, service) => sum + (service.quantity || 0),0);


    },
    removeFromCartItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.count = state.items.reduce((sum, service) => sum + (service.quantity || 0),0);
    },
    updateQuantityItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.count = state.items.reduce((sum, service) => sum + (service.quantity || 0),0);
    },
    addToCartServ: (state, action) => {
      console.log(action.payload.id)
     const services= state.services = Array.isArray(state.services) ? state.services : [];
      const existingItem = services.find(service => service.id === action.payload.id);
      if (!existingItem) {
        state.services.push(action.payload);

      } 

    },
    removeFromCartServ: (state, action) => {
      state.services = state.services.filter(service => service.id !== action.payload);
      if(state.services.length==0){
      state.locality_id = null;

      }

    },
    addToCartLoc: (state, action) => {
    state.locality_id = action.payload.locality_id;
    },

    clearCart: (state) => {
      state.items = [];
      state.services = [];
      state.locality_id = null;
      state.count = 0;
    }
  }
});

export const { addToCartItem, removeFromCartItem, updateQuantityItem, clearCart, addToCartServ, removeFromCartServ, addToCartLoc } = cartSlice.actions;
export default cartSlice.reducer;
