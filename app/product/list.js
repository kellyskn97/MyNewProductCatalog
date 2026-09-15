import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    useDispatch,
    useSelector
} from 'react-redux';

import ProductCard from '../../components/ui/ProductCard';
import {
    getProductList,
    openProductDetail
} from '../../stores/product/productActions';

// delay search input processing
const useDebounce = (value, delay = 300) => {
    const [result, setResult] = useState(value);

    useEffect(() => {
        // timer to update result after delay
        const timer = setTimeout(() => setResult(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return result;
};

// show loading, error, or [] state
function State({ title, message, retry }) {
    return <View style={styles.state}>

        <Text style={styles.stateTitle}>{title}</Text>

        {/* Body */}
        {message &&
            <Text style={styles.message}>{message}</Text>
        }

        {/* Retry Button */}
        {retry &&
            <Pressable
                style={styles.button}
                onPress={retry}
            >
                <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
        }
    </View>;
}

export default function Products() {

    // Redux dispatch and state
    const dispatch = useDispatch();

    // useSelector to select data from result from get product list Redux 
    const {
        productData:
        products,
        total,
        loading,
        loadingMore,
        error
    } = useSelector((state) => state.productReducer);

    const [searchText, setSearchText] = useState('');
    const ProductListRef = useRef(null);
    const [imageError, setImageError] = useState(false);

    const search = useDebounce(searchText.trim().toLowerCase());

    // Filter products by search text, 
    // useMemo to avoid on every render/products change
    const visibleProducts = useMemo(() =>
        products.filter(({ title }) =>
            title.toLowerCase().includes(search)),
        [products, search]
    );

    // Get products from API
    function getProducts(params) {
        dispatch(getProductList(params));
    }

    useEffect(() => {
        getProducts()
    }, []);

    const refresh = () => getProducts({ refresh: true });

    // loading and no products yet
    if (loading && !products.length) {
        return (
            <SafeAreaView style={styles.screen}>
                <State title="Loading products…" />
            </SafeAreaView>
        )
    };

    // If error and no products
    if (error && !products.length) {
        return (
            <SafeAreaView style={styles.screen}>
                <State title="Couldn't load products"
                    message="Check your connection and try again."
                    retry={refresh} />
            </SafeAreaView>
        )
    };

    // Load more products when reaching end of list
    const loadMore = () => {
        if (!loading && !loadingMore && !error && products.length < total) {
            getProducts({ skip: products.length, refresh: false });
        }
    };

    return <SafeAreaView style={styles.screen}>

        {/* Search Bar */}
        <View style={styles.header}>
            <Text style={styles.heading}>Products</Text>
            <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search products"
                style={styles.search}
            />
            <Text
                style={styles.count}>
                {visibleProducts.length} of {total || products.length} products
            </Text>
        </View>

        {/* Button Scroll To Top */}
        <View
            style={{
                position: 'absolute',
                right: 20,
                bottom: 50,
                justifyContent: 'center',
                zIndex: 999
            }}
        >
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 10,
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    borderWidth: 5,
                    borderColor: 'darkgreen',
                    backgroundColor: 'white',
                }}
                onPress={() => {
                    ProductListRef.current.scrollToOffset({ offset: 0, animated: true });
                }}
            >
                <Text style={{ color: 'darkgreen', fontSize: 60 }}>^</Text>
            </TouchableOpacity>
        </View>

        {/* Product List */}
        <FlatList
            data={visibleProducts}
            keyExtractor={({ id }) => String(id)}
            ref={ProductListRef}
            renderItem={({ item }) =>
                <ProductCard
                    product={item}
                    imageError={imageError}
                    setImageError={setImageError}
                    onPress={() =>
                        // Open product detail page
                        dispatch(openProductDetail(item.id))
                    }
                />
            }

            contentContainerStyle={visibleProducts.length ? styles.list : styles.emptyList}
            onEndReached={loadMore}
            // half of the visible length from the end of the list to trigger
            onEndReachedThreshold={0.5}
            refreshControl={
                <RefreshControl
                    //  loading & have products
                    refreshing={loading && !!products.length}
                    onRefresh={refresh} />
            }
            ListEmptyComponent={
                <State
                    title={searchText ? 'No matching products' : 'No products available'}
                    message={searchText ? 'Try another search.' : 'Pull down to refresh.'}
                />
            }
            ListFooterComponent={
                loadingMore ?
                    <ActivityIndicator style={styles.loader} />
                    :
                    error ?
                        <Pressable
                            onPress={() => getProducts({ skip: products.length })}>
                            <Text
                                style={styles.retryMore}>Couldn't load more. Retry
                            </Text>
                        </Pressable>
                        : null

            }
        />
    </SafeAreaView>;
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#eceaea'
    },
    header: {
        padding: 20,
        paddingBottom: 8
    },
    heading: {
        fontSize: 30,
        fontWeight: '700',
        color: 'black',
        marginBottom: 12
    },
    search: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16
    },
    count: {
        color: 'green',
        marginTop: 8
    },
    list: {
        padding: 12,
        gap: 12
    },
    emptyList: {
        flexGrow: 1
    },
    state: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32
    },
    stateTitle: {
        color: 'black',
        fontSize: 19,
        fontWeight: '700'
    },
    message: {
        color: 'gray',
        textAlign: 'center',
        marginTop: 8
    },
    button: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 12,
        paddingHorizontal: 22,
        marginTop: 18
    },
    buttonText: {
        color: 'white',
        fontWeight: '700'
    },
    loader: {
        margin: 18
    },
    retryMore: {
        color: 'green',
        fontWeight: '700',
        textAlign: 'center',
        padding: 18
    },
});
