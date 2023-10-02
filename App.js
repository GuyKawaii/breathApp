import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { database, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function App() {
  const [imagePath, setImagePath] = useState(null);

  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 10,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  const mapView = useRef(null); // ref. til map view opjectet
  const locationSubscription = useRef(null); // når vi lukker appen skal den ikke lytte mere

  async function launchImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })

    if (!result.canceled) {
      setImagePath(result.assets[0].uri)
    }
  }


  useEffect(() => {
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("igen adgang til lokation");
        return;
      }
      locationSubscription.current = await Location.watchPositionAsync(
        {
          distanceInterval: 100,
          accuracy: Location.Accuracy.High,
        },
        (lokation) => {
          const newRegion = {
            latitude: lokation.coords.latitude,
            longitude: lokation.coords.longitude,
            latitudeDelta: 20,
            longitudeDelta: 20,
          };
          setRegion(newRegion); // flytter kortet til den nye lokation
          if (mapView.current) {
            mapView.current.animateToRegion(newRegion);
          }
        });
    }
    startListening();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    }

  },[]);

  function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
    const newMarker = {
      coordinate: { latitude, longitude },
      key: data.timeStamp,
      title: "Great Place",
    };
    setMarkers([...markers, newMarker]);
  }

  function onMarkerPressed(text) {
    launchImagePicker();
    alert("you pressed " + text);
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onLongPress={addMarker}>
        {markers.map((marker) => (
          <Marker
            coordinate={marker.coordinate}
            key={marker.key}
            title={marker.title}
            onPress={() => onMarkerPressed(marker.title)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
