import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const ProfileScreen = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid; // Ensure the user is logged in
  const [userData, setUserData] = useState({ name: '', email: '', rollNo: '', createdAt: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      const userDocRef = doc(db, 'users', userId);

      // Fetch user data in real-time
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        } else {
          Alert.alert('Error', 'User data not found.');
        }
      });

      return () => unsubscribe(); // Clean up the listener
    }
  }, [userId]);

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, userData); // Update Firestore with new user data
      setIsEditing(false);
      Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(); // Format as per your needs
  };

  return (
    <View style={styles.container}>
      {/* Display user details in formatted text */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userData.name}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Roll No:</Text>
        <Text style={styles.value}>{userData.rollNo}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Joined:</Text>
        <Text style={styles.value}>{formatDate(userData.createdAt)}</Text>
      </View>

      {/* Editable fields for name and email */}
      {isEditing && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={[styles.input, isEditing ? styles.editing : null]}
              value={userData.name}
              editable={isEditing}
              onChangeText={(text) => handleChange('name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={[styles.input, isEditing ? styles.editing : null]}
              value={userData.email}
              editable={isEditing}
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>
        </>
      )}

      {/* Button to edit or save profile */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
      >
        <Text style={styles.buttonText}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>

      {/* Button to log out */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => auth.signOut()}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  editing: {
    borderColor: '#E4DEBE',
  },
  button: {
    backgroundColor: '#E6BAA3',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#D24545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;