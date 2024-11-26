import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const initialCart = [
  { id: '1', name: 'Spicy Noodles', price: 150 },
  { id: '2', name: 'Grilled Sandwich', price: 100 },
];

const CartScreen = () => {
  const [cart, setCart] = useState(initialCart);

  const calculateTotal = () => cart.reduce((total, item) => total + item.price, 0);

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ₹{calculateTotal()}</Text>
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  name: { fontSize: 16 },
  price: { fontSize: 16, color: 'gray' },
  remove: { color: 'red' },
  total: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  checkoutButton: { backgroundColor: '#D24545', padding: 15, borderRadius: 5, marginTop: 20 },
  checkoutText: { textAlign: 'center', color: 'white', fontWeight: 'bold' },
});

export default CartScreen;