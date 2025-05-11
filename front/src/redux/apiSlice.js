import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Products', 'Services', 'Orders', 'Localitys'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData
      })
    }),

    // Product endpoints
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Products']
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product
      }),
      invalidatesTags: ['Products']
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product
      }),
      invalidatesTags: ['Products']
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products']
    }),

    // Service endpoints
    getServices: builder.query({
      query: () => '/services',
      providesTags: ['Services']
    }),
    addService: builder.mutation({
      query: (service) => ({
        url: '/services',
        method: 'POST',
        body: service
      }),
      invalidatesTags: ['Services']
    }),
    updateService: builder.mutation({
      query: ({ id, ...service }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body: service
      }),
      invalidatesTags: ['Services']
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Services']
    }),

    // Order endpoints
    getOrders: builder.query({
      query: () => '/orders/',
      providesTags: ['Orders']
    }),
    getOrdersByUserId: builder.query({
      query: () => "/orders/user/",
      providesTags: ['Orders']
    }),
    addOrder: builder.mutation({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order
      }),
      invalidatesTags: ['Orders']
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, cancel_reason }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status, cancel_reason }
      }),
      invalidatesTags: ['Orders']
    }),

    getLocalitys: builder.query({
      query: () => '/locality',
      providesTags: ['Localitys']
    }),
 
    addLocality: builder.mutation({
      query: (locality) => ({
        url: '/locality',
        method: 'POST',
        body: locality
      }),
      invalidatesTags: ['Localitys']
    }),
    updateLocality: builder.mutation({
      query: ({ id, ...locality }) => ({
        url: `/locality/${id}`,
        method: 'PUT',
        body: locality
      }),
      invalidatesTags: ['Localitys']
    }),
    deleteLocality: builder.mutation({
      query: (id) => ({
        url: `/locality/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Localitys']
    }),
  

  })
  
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetServicesQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetOrdersQuery,
  useGetOrdersByUserIdQuery,
  useAddOrderMutation,
  useUpdateOrderStatusMutation,
  useGetLocalitysQuery,
  useAddLocalityMutation,
  useUpdateLocalityMutation,
  useDeleteLocalityMutation
} = apiSlice;
