import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const apikey = process.env.EXPO_PUBLIC_API_KEY;

  const handleAddress = async () => {
    const url = `https://geocode.maps.co/search?q=${address}&api_key=${apikey}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      // console.log(json);
      setLat(json[0].lat);
      setLon(json[0].lon);
    } catch (error) {
      Alert.alert("Error", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(address) => setAddress(address)}
        value={address}
      ></TextInput>
      <View style={styles.button}>
        <Button onPress={handleAddress} title="Show"></Button>
      </View>
      <MapView style={styles.map} region={region}>
        <Marker
          coordinate={{
            latitude: Number(lat),
            longitude: Number(lon),
          }}
          // title={address}
        />
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
