import * as types from './productActions';

const initialState = {
    // Product list
    productData: [],
    total: 0,
    limit: 0,
    loading: false,
    loadingMore: false,
    error: null,
    // Product detail 
    selectedProduct: null,
    detailLoading: false,
    detailError: null,
};

export default function productReducer(state = initialState, action) {

    switch (action.type) {
        // Product list
        case types.GET_PRODUCT_LIST_BEGIN:
            return {
                ...state,
                // If skip = 0 = loading products, loading = true
                loading: action.payload.skip === 0,
                // If skip > 0 = loading more products, loadingMore = true
                loadingMore: action.payload.skip > 0,
                error: null,
            };
        case types.GET_PRODUCT_LIST_SUCCESS: {
            // If skip > 0 and refresh = false, add new products to existing productData
            const shouldAppend = action.payload.skip > 0 && !action.payload.refresh;
            const productData = shouldAppend
                ? [
                    ...state.productData,
                    // Filter out any duplicate products by id
                    ...action.payload.products.filter((product) =>
                        // by checking product id not in productData
                        !state.productData.some((item) => item.id === product.id))]
                :
                action.payload.products;

            let item = {
                ...state,
                productData,
                total: action.payload.total,
                limit: action.payload.limit,
                loading: false,
                loadingMore: false,
            }

            return item;
        }
        case types.GET_PRODUCT_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                loadingMore: false,
                error: action.payload.error,
            };

        // Get Product detail
        case types.GET_PRODUCT_DETAIL_BEGIN:
            return {
                ...state,
                detailLoading: true,
                detailError: null,
                selectedProduct: null
            };

        case types.GET_PRODUCT_DETAIL_SUCCESS:
            return {
                ...state,
                detailLoading: false,
                selectedProduct: action.payload
            };

        case types.GET_PRODUCT_DETAIL_FAILURE:
            return {
                ...state,
                detailLoading: false,
                detailError: action.payload.error
            };

        default:
            return state;
    }
}
