import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const initial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  };
  const [region, setRegion] = useState(initial);
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Effect-funktio ei voi olla async?
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission to get location");
        return;
      } else {
        try {
          // Get location
          const location = await Location.getCurrentPositionAsync({});
          setRegion({
            ...region,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    fetchLocation();
  }, []);

  const apikey = process.env.EXPO_PUBLIC_API_KEY;

  const handleAddress = async () => {
    const url = `https://geocode.maps.co/search?q=${address}&api_key=${apikey}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      // console.log(json);
      const lat = Number(json[0].lat);
      const lon = Number(json[0].lon);
      setRegion({ ...region, latitude: lat, longitude: lon });
    } catch (error) {
      Alert.alert("Error", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Syötä osoite..."
        onChangeText={(address) => setAddress(address)}
        value={address}
      ></TextInput>
      <View style={styles.button}>
        <Button onPress={handleAddress} title="Show"></Button>
      </View>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={region} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: { width: "100%", height: "100%" },
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    padding: 5,
    marginTop: 200,
  },
  button: { width: "100%" },
});
