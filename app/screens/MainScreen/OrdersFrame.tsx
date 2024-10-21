import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import tw from 'twrnc';
import {AppDispatch} from '../../services/store/store';
import {fetchOrders} from '../../services/store/slices/CartSlice';
import {Order} from '../../models/Order';
import { useTypedSelector } from '../../utils/helpers';

export default function OrdersFrame() {
    const dispatch = useDispatch<AppDispatch>();
    const orders = useTypedSelector(state => state.cart.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    },[dispatch]);

    const renderOrder = ({index, item: order}: {index: number, item: Order} ) => {
        console.log(order.total_price);
        
        return (
            <View key={order.id} style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>Order # {order.id}</Text>
                    <Text style={styles.dateTime}>{order.created_at} </Text>
                </View>
                <View style={styles.customerInfo}>
                    <Text style={styles.phone}>
                        Phone: {order.order_details?.phone}
                    </Text>
                    <Text style={styles.text}>
                        Customer:{' '}
                        {order.order_details?.first_name.toLocaleUpperCase()}{' '}
                        {order.order_details?.last_name.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.text}>
                    <Text style={[styles.text, tw`text-left`]}>Items:</Text>
                    {order.order_items?.map((item, index) => {
                        return (
                            <View
                                style={tw`flex-row border-b py-2 border-slate-500`}>
                                
                                <Text style={[styles.text, tw`flex-2 text-white text-left`]}>
                                    {item.product.title}
                                </Text>
                                <Text style={[styles.text, tw`flex-1 text-white`]}>
                                    {item.batch_size}
                                </Text>
                                <Text style={[styles.text, tw`flex-1 text-white`]}>{item.quantity}</Text>
                                <Text style={[styles.text, tw`flex-1 text-white`]}>
                                    {item.quantity * item.unit_price}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.text}>
                    <Text style={[styles.text, tw`text-left`]}>Total: {order.total_price}</Text>
                    
                </View>
            </View>
        );
    };

    return (<View style={styles.container}>
        <Text style={[styles.title, tw`text-black text-left`]}>Orders</Text>
        <FlatList
        data={orders}
        renderItem={renderOrder}
        contentContainerStyle={{paddingVertical: 16}}
        keyExtractor={order => order.id.toString()}
        />
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
       
    },
    card: {
        backgroundColor: 'black',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'right',
        color: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dateTime: {
        fontSize: 14,
        color: 'white',
    },
    phone: {
        fontSize: 14,
        color: 'white',
    },
    customerInfo: {
        marginBottom: 16,
        color: 'white',
    },
    text: {
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'right',
        color: 'white',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'right',
        color: 'white',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 8,
        color: 'white',
    },
    tableHeaderCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    tableRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        color: 'white',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        color: 'white',
    },
    boldText: {
        fontWeight: 'bold',
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: 'white',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 4,
        color: 'white',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    notFoundText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
    },
});
