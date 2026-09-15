import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userInfo?.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        api.dispatch(logout());
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Product', 'Order', 'User'],
    endpoints: (builder) => ({}),
});
