import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const AdminScreen = () => {
  const [menu, setMenu] = useState({
    name: '',
    preparingTime: '',
    description: '',
    image: '',
    price: '',
    customizable: false,
  });
  const [nutrition, setNutrition] = useState({});
  const [selectedNutrient, setSelectedNutrient] = useState(''); // For dropdown selection
  const [nutrientValue, setNutrientValue] = useState(''); // Value for selected nutrient

  const addMenuToFirestore = async () => {
    const { name, preparingTime, description, image, price, customizable } = menu;
  
    if (!name || !preparingTime || !description || !image || !price) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    try {
      const newMenu = {
        ...menu,
        price: parseInt(price, 10),
        nutrition, // Add nutrition object
        createdAt: new Date(),
      };
  
      // Add a new document with an auto-generated ID
      const collectionRef = collection(db, 'menu'); // Specify the collection
      await addDoc(collectionRef, newMenu);
  
      Alert.alert('Success', 'Menu item added successfully!');
      setMenu({
        name: '',
        preparingTime: '',
        description: '',
        image: '',
        price: '',
        customizable: false,
      });
      setNutrition({});
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const addNutrient = () => {
    if (!selectedNutrient || !nutrientValue) {
      Alert.alert('Error', 'Please select a nutrient and provide its value');
      return;
    }

    setNutrition((prev) => ({
      ...prev,
      [selectedNutrient]: parseInt(nutrientValue, 10),
    }));

    setSelectedNutrient('');
    setNutrientValue('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Menu Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={menu.name}
        onChangeText={(text) => setMenu({ ...menu, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Preparing Time"
        value={menu.preparingTime}
        onChangeText={(text) => setMenu({ ...menu, preparingTime: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={menu.description}
        onChangeText={(text) => setMenu({ ...menu, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={menu.image}
        onChangeText={(text) => setMenu({ ...menu, image: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={menu.price}
        onChangeText={(text) => setMenu({ ...menu, price: text })}
      />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setMenu({ ...menu, customizable: !menu.customizable })}
      >
        <Text style={styles.toggleText}>
          {menu.customizable ? 'Customizable: Yes' : 'Customizable: No'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Add Nutrition</Text>

      {/* Nutrition Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedNutrient}
          onValueChange={(itemValue) => setSelectedNutrient(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Protein" value="protein" />
          <Picker.Item label="Kcal" value="kcal" />
          <Picker.Item label="Fat" value="fat" />
          <Picker.Item label="Carbs" value="carbs" />
          <Picker.Item label="Fiber" value="fiber" />
          <Picker.Item label="Sugar" value="sugar" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Value"
        keyboardType="numeric"
        value={nutrientValue}
        onChangeText={(text) => setNutrientValue(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={addNutrient}>
        <Text style={styles.addButtonText}>Add Nutrient</Text>
      </TouchableOpacity>

      {/* Display Added Nutrients */}
      {Object.keys(nutrition).length > 0 && (
        <View style={styles.nutritionContainer}>
          <Text style={styles.nutritionTitle}>Nutrition Information:</Text>
          {Object.entries(nutrition).map(([key, value]) => (
            <Text key={key} style={styles.nutritionItem}>
              {key}: {value}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={addMenuToFirestore}>
        <Text style={styles.submitButtonText}>Add Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  toggleButton: {
    padding: 15,
    backgroundColor: '#D24545',
    borderRadius: 5,
    marginVertical: 10,
  },
  toggleText: {
    color: '#fff',
    textAlign: 'center',
  },
  picker: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#D24545',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  nutritionContainer: {
    marginTop: 20,
  },
  nutritionTitle: {
    fontWeight: '600',
    marginBottom: 5,
  },
  nutritionItem: {
    fontSize: 14,
    marginBottom: 3,
  },
  submitButton: {
    backgroundColor: '#D24545',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  nutritionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  smallInput: {
    flex: 1,
    marginRight: 10,
  },
  nutritionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  nutritionItem: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D24545',
  },
  picker: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default AdminScreen;