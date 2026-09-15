import { Image, Pressable, StyleSheet, Text, View } from "react-native";


export default function ProductCard({ product, onPress, imageError, setImageError }) {

    return <Pressable
        style={styles.card}
        onPress={onPress}>

        {imageError ?
            <View style={[
                styles.image,
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

const styles = StyleSheet.create({

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
    }
});
