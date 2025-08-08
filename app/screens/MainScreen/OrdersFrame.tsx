import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc';
import { Order } from '../../models/Order';
import { useTypedNavigator } from '../../utils/helpers';
import XButton from '../../components/common/XButton';
import XModal from '../../components/common/XModal';
import { useOrders } from '../../services/repository/useOrders';
import { useCart } from '../../services/repository/useCart';

export default function OrdersFrame() {
    const { orders } = useOrders();
    const { returnToCartMutation } = useCart();
    const navigator = useTypedNavigator();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [targetId, setTargetId] = useState<number>(0);

    const renderOrder = ({ index, item: order }: { index: number, item: Order }) => {
        return (
            <View key={order.id ?? index} style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>Order # {order.id}</Text>
                    <Text style={styles.dateTime}>{order.created_at?.toString()} </Text>
                </View>
                <View style={styles.customerInfo}>
                    <Text style={styles.text}>
                        Customer: {' '}
                        {order.details?.first_name?.toLocaleUpperCase()}{' '}
                        {order.details?.last_name?.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.itemsContainer}>
                    <Text style={styles.sectionTitle}>Items:</Text>
                    {order.items?.map((item, index) => {
                        return (
                            <View key={index} style={styles.itemContainer}>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemText}>
                                        {item.product?.title || `Product ID: ${item.product.id}`}
                                    </Text>
                                    <View
                                        style={[
                                            styles.itemDetails,
                                            tw`flex flex-row justify-between`,
                                        ]}>
                                        <Text style={styles.itemText}>
                                            Quantity: {item.quantity}
                                        </Text>
                                        <Text style={styles.itemText}>
                                            Unit Price: {item.unit_price}
                                        </Text>
                                        <Text style={styles.itemText}>
                                            Item Total: {((item.unit_price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.footer}>
                    <Text style={[styles.text, tw`text-left`]}>Total: {(order.total_price ?? 0).toFixed(2)}</Text>
                </View>
                <View style={styles.actions}>
                    <XButton 
                        onClick={() => {
                            if(order.status === 'completed') {
                                setIsModalVisible(true);
                                setTargetId(order.id ?? 0);
                            }
                        }} 
                        backgroundColor={order.status === 'completed' ? '#4CAF50' : '#ccc'}
                        disabled={order.status !== 'pending'}
                        style={tw`flex-1 mr-2`}
                    >
                        <Text style={tw`text-white font-bold`}>Return to Cart</Text>
                    </XButton>
                </View>
            </View>
        );
    };

    if (!orders || orders.length === 0) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-gray-500 text-lg`}>No orders found</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <FlatList
                data={orders}
                renderItem={renderOrder}
                showsVerticalScrollIndicator={false}
                keyExtractor={(order, index) => order.id?.toString() ?? index.toString()}
            />
            <XModal
                visible={isModalVisible}
                onConfirm={async () => {
                    try {
                        returnToCartMutation(targetId);
                        setIsModalVisible(false);
                    } catch (error) {
                        console.error('Failed to return to cart:', error);
                    }
                }}
                onDismiss={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                title="Return to Cart?"
                bodyText="Are you sure you want to return this order to your cart?"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f5f5f5',
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dateTime: {
        fontSize: 12,
        color: '#666',
    },
    customerInfo: {
        marginBottom: 8,
    },
    itemsContainer: {
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 8,
        marginVertical: 2,
        borderRadius: 4,
    },
    itemInfo: {
        flex: 1,
    },
    itemDetails: {
        marginTop: 4,
    },
    itemText: {
        fontSize: 12,
        color: '#555',
    },
    text: {
        fontSize: 14,
        color: '#333',
    },
    footer: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 12,
    },
});
