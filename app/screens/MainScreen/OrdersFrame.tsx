import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import tw from 'twrnc';
import { AppDispatch } from '../../services/store/store';
import { fetchOrders } from '../../services/store/slices/CartSlice';
import { Order } from '../../models/Order';
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers';
import XButton from '../../components/common/XButton';
import XModal from '../../components/common/XModal';
import { axiosClient } from '../../services/api';

export default function OrdersFrame() {
    const dispatch = useDispatch<AppDispatch>();
    const orders = useTypedSelector(state => state.cart.orders);
    const navigator = useTypedNavigator(); 

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const renderOrder = ({ index, item: order }: { index: number, item: Order }) => {
        console.log(order.total_price);

        return (
            <View key={order.id ?? index} style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>Order # {order.id}</Text>
                    <Text style={styles.dateTime}>{order.created_at} </Text>
                </View>
                <View style={styles.customerInfo}>
                    <Text style={styles.phone}>
                        Phone: 05-53-71-52-04
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
                                <Text style={[styles.text, tw`px-2 text-left text-white`]}>
                                    {item.quantity}
                                </Text>

                                <Text style={[styles.text, tw`flex-2 text-white text-center`]}>
                                    {item.product.title?.slice(0, 25) === item.product.title ? item.product.title : `${item.product.title?.slice(0, 25)}...`}
                                </Text>
                                <Text style={[styles.text, tw`flex-1 text-center text-white`]}>
                                    {item.batch_size}
                                </Text>

                                <Text style={[styles.text, tw`flex-1 text-left text-white`]}>
                                    {(item.quantity * item.unit_price * item.batch_size).toFixed(2)}
                                </Text>
                            </View>
                        );
                    }) ?? (
                            <View style={tw`flex-row justify-center items-center`} >
                                <Text style={[styles.text, tw`flex-1 text-center text-white`]}>تم حدف المنتج نهائيا</Text>
                            </View>
                        )}
                </View>
                <View style={styles.text}>
                    <Text style={[styles.text, tw`text-left`]}>Total: {parseFloat(order.total_price.toString()).toFixed(2)}</Text>

                </View>

                <XButton color="#000" backgroundColor="#fff" text='ارجاع الى السلة' onClick={() => {
                    if(order.status === 'paid') {
                        setBodyText('سيتم اعادة الطلب الى السلة لتعديل عليه . هل تريد المتابعة ؟ ')
                        setTargetId(order.id);
                    }else{
                        setBodyText('لقد تم توصيل الطلب .. اتصل بالرقم لالغاءه')
                    }

                    setModalVisible(true);
                }} >

                </XButton>
            </View>
        );
    };


    const [modalVisible, setModalVisible] = useState(false);
    const [targetId, setTargetId] = useState(-1);

    const [bodyText, setBodyText] = useState('')

    return (
        <View style={styles.container}>
            <Text style={[styles.title, tw`text-black text-left`]}>Orders</Text>
            <FlatList
                data={orders}
                renderItem={renderOrder}
                contentContainerStyle={{ paddingVertical: 16 }}
                keyExtractor={order => order.id.toString()}
            />

            <XModal onDismiss={() => setModalVisible (false)} visible={modalVisible} title='ارجاع الى السلة' bodyText={bodyText} cancelText='الغاء' confirmText='حسنا' onCancel={() => setModalVisible(false)} onConfirm={async () => { 
                if(targetId >= 0){
                    setModalVisible(false);
                    await axiosClient.post(`order/returnToCart/${targetId}`)
                    setTargetId(-1)
                    await dispatch(fetchOrders()).unwrap();
                    navigator.navigate('CartScreen')
                }else{
                    setModalVisible(false);
                }
             }}   >

            </XModal>

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
        textAlign: 'left',
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
