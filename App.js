// Importing required modules and components
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from './firebase';
import ImageModal from './ImageModal';

export default function App() {
  // State Hooks
  const [imagePath, setImagePath] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [region, setRegion] = useState({
    latitude: 50,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });
  const [isModalVisible, setModalVisible] = useState(false);

  // Refs
  const mapView = useRef(null);
  const locationSubscription = useRef(null);

  // Effect Hook to fetch markers and start listening on mount
  useEffect(() => {
    // Fetching markers from firestore on component mount
    fetchMarkers();

    // Function to start location listening
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("No access to location");
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        { distanceInterval: 100, accuracy: Location.Accuracy.High },
        (location) => {
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 20,
            longitudeDelta: 20,
          };
          setRegion(newRegion);
          if (mapView.current) mapView.current.animateToRegion(newRegion);
        }
      );
    }

    startListening(); // Uncommented to start location listening on mount

    // Cleanup location subscription on unmount
    return () => locationSubscription.current?.remove();
  }, []);

  // Function to upload an image
  async function uploadImage(path, marker) { // Accept marker as a parameter
    try {
      const res = await fetch(path);
      const blob = await res.blob();
      const storageRef = ref(storage, `images/${marker.key}.jpg`); // Use marker directly
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  }

  // Function to launch image picker
  async function launchImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: false });
    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  }

  // Function to fetch markers from firestore
  const fetchMarkers = async () => {
    const loadedMarkers = await loadMarkers();
    setMarkers(loadedMarkers);
  };

  // Function to load markers from firestore
  const loadMarkers = async () => {
    try {
      const markersArray = [];
      const querySnapshot = await getDocs(collection(database, "location"));

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let marker = {
          key: doc.id,
          title: data.title,
          coordinate: data.coordinate
        };

        // If imageUrl exists in the data, add it to the marker object
        if (data.imageUrl) {
          marker.imageUrl = data.imageUrl;
        }

        markersArray.push(marker);
      });

      return markersArray;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return [];
    }
  };

  // Function to handle adding of marker
  async function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;

    const markerExists = markers.some(
      marker => marker.coordinate.latitude === latitude && marker.coordinate.longitude === longitude
    );

    if (!markerExists) {
      const newMarker = { coordinate: { latitude, longitude }, key: data.timeStamp.toString(), title: "Great Place" };
      setMarkers([...markers, newMarker]);
      await uploadLocation(newMarker);
    } else {
      console.log('Marker with the same coordinates already exists.');
    }


  }

  // Function to handle pressing of a marker
  async function onMarkerPressed(marker) {
    setSelectedMarker(marker);
    if (marker.imageUrl) {
      setModalVisible(true);
      return;
    }

    const selectedImagePath = await launchImagePicker();
    if (!selectedImagePath) {
      console.log('Image not picked');
      return;
    }

    try {
      let imageUrl = await uploadImage(selectedImagePath, marker); // Pass marker directly
      await updateMarkerWithImage(marker, imageUrl);
      fetchMarkers(); // Update state
    } catch (error) {
      console.error('Error in onMarkerPressed: ', error);
    }
  }

  // updates firestore and locally with image url
  async function updateMarkerWithImage(marker, imageUrl) {
    try {
      // Update Firestore
      const markerDoc = doc(database, 'location', marker.key);
      await updateDoc(markerDoc, { imageUrl });
      console.log('Marker updated in Firestore.');

      // Update local state
      marker.imageUrl = imageUrl;
      console.log('Local marker updated with image URL.');

    } catch (error) {
      console.error('Error updating marker with image:', error);
      return;
    }
    // see local state updated
    console.log(markers);
  }

  // Function to close modal
  const closeModal = () => {
    setModalVisible(false);
  }

  // Function to upload a marker to firestore
  const uploadLocation = async (marker) => {
    if (!marker) return;
    try {
      await setDoc(doc(database, "location", String(marker.key)), {
        title: marker.title,
        coordinate: marker.coordinate,
        key: marker.key,
      });
      console.log('Document successfully added!');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  // Rendering component
  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onLongPress={addMarker}>
        {markers.map(marker => (
          <Marker
            coordinate={marker.coordinate}
            key={marker.key}
            title={marker.title}
            onPress={() => onMarkerPressed(marker)}
          />
        ))}
      </MapView>
      {selectedMarker && isModalVisible && (
        <ImageModal
          visible={isModalVisible}
          imageUrl={selectedMarker.imageUrl}
          onClose={closeModal}
        />
      )}
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});
