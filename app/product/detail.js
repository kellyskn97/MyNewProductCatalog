import {
    router,
    useLocalSearchParams
} from 'expo-router';
import {
    useEffect
} from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    useDispatch,
    useSelector
} from 'react-redux';

import { getProductDetail } from '../../stores/product/productActions';

export default function ProductDetail() {
    const dispatch = useDispatch();

    // Get product id from url params
    const { id } = useLocalSearchParams();

    console.log(id)

    // extracting one string from the id param, which can be a string / array of strings
    const productId = Array.isArray(id) ? id[0] : id;

    const {
        selectedProduct: product,
        detailLoading: loading,
        detailError: error
    } = useSelector((state) =>
        state.productReducer
    );

    const load = () => dispatch(getProductDetail(productId));

    useEffect(() => {
        if (productId) {
            load();
        }
    }, [dispatch, productId]);

    if (loading || !product) {
        return (
            <View style={styles.state}>
                {error ?
                    <>
                        <Text style={styles.stateTitle}>
                            Couldn't load this product</Text>
                        <Pressable style={styles.button} onPress={load}>
                            <Text style={styles.buttonText}>Retry</Text>
                        </Pressable>
                    </>
                    :
                    <>
                        {/* indicate loading */}
                        <ActivityIndicator size="large" />
                        <Text>Loading product…</Text>
                    </>
                }
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
        >
            <Pressable
                onPress={router.back}>
                <Text style={styles.back}>
                    {`< `} Back to Products
                </Text>
            </Pressable>

            {/* main product image */}
            <Image
                source={{ uri: product.thumbnail }}
                style={styles.hero}
            />
            <Text style={styles.title}>
                {product.title}
            </Text>
            {/* Price */}
            <Text style={styles.price}>
                RM {product.price.toFixed(2)}
            </Text>
            {/* Rating */}
            <Text style={styles.rating}>
                * {product.rating.toFixed(1)} / 5
            </Text>
            {/* Description */}
            <Text style={styles.heading}>
                Description
            </Text>
            <Text style={styles.description}>
                {product.description}
            </Text>

            {/* Other Images */}
            <Text style={styles.heading}>
                Product Other Images
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.images}
            >
                {product.images.map((uri) =>
                    <Image key={uri}
                        source={{ uri }}
                        style={styles.galleryImage}
                    />)}
            </ScrollView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        padding: 20,
        paddingBottom: 40,
        marginTop: 60
    },
    state: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14
    },
    back: {
        color: 'green',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 18
    },
    hero: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: '#e8efeb'
    },
    title: {
        color: 'black',
        fontSize: 28,
        fontWeight: '700',
        marginTop: 20
    },
    price: {
        color: 'green',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 8
    },
    rating: {
        alignSelf: 'flex-start',
        backgroundColor: '#e3f3e9',
        color: 'darkgreen',
        borderRadius: 12,
        padding: 8,
        marginTop: 12,
        fontWeight: '700'
    },
    heading: {
        color: 'black',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 8
    },
    description: {
        color: 'gray',
        fontSize: 16,
        lineHeight: 24
    },
    images: {
        gap: 12
    },
    galleryImage: {
        width: 190,
        height: 190,
        borderRadius: 12,
        backgroundColor: '#e8efeb'
    },
    stateTitle: {
        color: 'darkgreen',
        fontSize: 20,
        fontWeight: '700'
    },
    button: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 12,
        paddingHorizontal: 22
    },
    buttonText: {
        color: 'white',
        fontWeight: '700'
    },
});
