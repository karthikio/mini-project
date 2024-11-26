import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const HomeScreen = ({ navigation }) => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const highlightsCollection = collection(db, 'highlights');
        const highlightsSnapshot = await getDocs(highlightsCollection);
        const highlightsList = highlightsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHighlights(highlightsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching highlights:', error);
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#D24545" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome to QuickBite!</Text>
        <Text style={styles.subHeader}>
          Discover delicious and freshly prepared meals at our college food court. From quick bites to satisfying meals,
          we've got something for everyone!
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Featured Items</Text>

      <FlatList
        data={highlights}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('FoodDetail', { item })}>
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    backgroundColor: '#FF5733',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 15,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#777',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});

export default HomeScreen;