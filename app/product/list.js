import {
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import {
    useDispatch,
    useSelector
} from 'react-redux';

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

function ProductCard({ product, onPress }) {

    const [imageError, setImageError] = useState(false);

    return <Pressable
        style={styles.card}
        onPress={onPress}>

        {imageError ?
            <View style={[styles.image,
            styles.imageError]}>
                <Text>No image</Text>
            </View>
            :
            <Image
                source={{ uri: product.thumbnail }}
                style={styles.image}
                onError={() => setImageError(true)}
            />
        }
        <View style={styles.cardText}>
            <Text style={styles.title}
                numberOfLines={2}>{product.title}
            </Text>
            <Text style={styles.price}>
                RM {product.price.toFixed(2)}
            </Text>
        </View>
    </Pressable>
}

export default function Products() {

    const dispatch = useDispatch();

    const {
        productData:
        products,
        total,
        loading,
        loadingMore,
        error
    } = useSelector((state) =>
        state.productReducer);
    const [searchText, setSearchText] = useState('');

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

        {/* Product List */}
        <FlatList
            data={visibleProducts}
            keyExtractor={({ id }) => String(id)}
            renderItem={({ item }) =>
                <ProductCard
                    product={item}
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
                    <ActivityIndicator
                        style={styles.loader} />
                    : error ?
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
    card: {
        minHeight: 120,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: 'white',
        borderRadius: 14,
        elevation: 2
    },
    image: {
        width: 120,
        height: 120,
        backgroundColor: 'white',
    },
    imageError: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardText: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 15
    },
    title: {
        color: 'black',
        fontSize: 17,
        fontWeight: '600'
    },
    price: {
        color: 'darkgreen',
        fontSize: 18,
        fontWeight: '700'
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
