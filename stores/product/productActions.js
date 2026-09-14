import axios from 'axios';
import { router } from 'expo-router';

// Get product list 
export const GET_PRODUCT_LIST_BEGIN = 'GET_PRODUCT_LIST_BEGIN';
export const GET_PRODUCT_LIST_SUCCESS = 'GET_PRODUCT_LIST_SUCCESS';
export const GET_PRODUCT_LIST_FAILURE = 'GET_PRODUCT_LIST_FAILURE';
// Get product detail 
export const GET_PRODUCT_DETAIL_BEGIN = 'GET_PRODUCT_DETAIL_BEGIN';
export const GET_PRODUCT_DETAIL_SUCCESS = 'GET_PRODUCT_DETAIL_SUCCESS';
export const GET_PRODUCT_DETAIL_FAILURE = 'GET_PRODUCT_DETAIL_FAILURE';

const api = axios.create({ baseURL: 'https://dummyjson.com' });

// skip: number of products to skip for pagination
// refresh: whether refresh list or add
export function getProductList({ skip = 0, refresh = false } = {}) {

    return async (dispatch) => {

        // Beegin action get product list
        dispatch({
            type: GET_PRODUCT_LIST_BEGIN,
            payload: { skip }
        });

        // Fetch products from API
        try {
            // skip = 0: loading products,
            //  skip > 0: loading more products
            const { data } = await api.get('/products', { params: { skip } });

            // success action get product list
            dispatch({
                type: GET_PRODUCT_LIST_SUCCESS,
                payload: {
                    ...data,
                    skip,
                    refresh
                },
            });

            return data;
        }
        catch (error) {
            dispatch({
                type: GET_PRODUCT_LIST_FAILURE,
                payload: {
                    error: error instanceof Error ? error.message : 'Unable to load products',
                    skip
                }
            });

            return null;
        }
    };
}

// Open product detail page
export function openProductDetail(productId) {
    return () => {
        router.push({ pathname: '/product/detail', params: { id: String(productId) } });
    };
}

// get product detail 
export function getProductDetail(productId) {

    return async (dispatch) => {

        dispatch({ type: GET_PRODUCT_DETAIL_BEGIN });

        try {
            // Fetch product detail 
            const { data } = await api.get(`/products/${productId}`);

            dispatch({
                type: GET_PRODUCT_DETAIL_SUCCESS,
                payload: data
            });
            return data;
        }
        catch (error) {
            dispatch({
                type: GET_PRODUCT_DETAIL_FAILURE,
                payload: {
                    error: error instanceof Error ? error.message : 'Unable to load product'
                }
            });
            return null;
        }
    };
}
