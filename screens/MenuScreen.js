import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { Ionicons } from 'react-native-vector-icons';

const MenuScreen = ({ navigation }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  const userId = auth.currentUser.uid;

  useEffect(() => {
    // Fetch menu items
    const fetchMenuData = async () => {
      try {
        const menuCollection = collection(db, 'menu');
        const menuSnapshot = await getDocs(menuCollection);
        const menuList = menuSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenu(menuList);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user's favorites
    const fetchFavorites = async () => {
      try {
        const favoritesCollection = collection(db, `favorites/${userId}/food`);
        const favoritesSnapshot = await getDocs(favoritesCollection);
        const favoriteItems = new Set(
          favoritesSnapshot.docs.map((doc) => doc.id)
        );
        setFavorites(favoriteItems);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchMenuData();
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = async (item) => {
    const favoriteDocRef = doc(db, `favorites/${userId}/food`, item.id);

    try {
      if (favorites.has(item.id)) {
        // Remove from favorites
        await deleteDoc(favoriteDocRef);
        setFavorites((prevFavorites) => {
          const updatedFavorites = new Set(prevFavorites);
          updatedFavorites.delete(item.id);
          return updatedFavorites;
        });
      } else {
        // Add to favorites
        await setDoc(favoriteDocRef, item);
        setFavorites((prevFavorites) => new Set(prevFavorites.add(item.id)));
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('MenuDetail', {
          item, // Pass the full item object to the detail page
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>Rs. {item.price}</Text>
          <TouchableOpacity onPress={() => handleFavoriteToggle(item)}>
            <Ionicons
              name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
              size={24}
              color={favorites.has(item.id) ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#D24545" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {menu.length > 0 ? (
        <FlatList
          data={menu}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No items found in the menu.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  itemImage: {
    width: "100%",
    height: 120,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: "left"
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 5
  },
  itemPrice: {
    fontSize: 14,
    color: '#777',
  },
  favoriteIcon: {
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
  },
});

export default MenuScreen;