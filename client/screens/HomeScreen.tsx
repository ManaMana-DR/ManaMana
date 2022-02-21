import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { CuisineTypeIds, PreferencesType } from "./FiltersScreen";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  useEffect(() => {
    const getFilters = async () => {
      let preferences: PreferencesType[] = [];
      let cuisineTypes: CuisineTypeIds[] = [];
      const preferencesStr = await AsyncStorage.getItem("preferences");
      if (preferencesStr) {
        preferences = JSON.parse(preferencesStr);
      }
      const cuisineTypesStr = await AsyncStorage.getItem("cuisineTypes");
      if (cuisineTypesStr) {
        cuisineTypes = JSON.parse(cuisineTypesStr);
      }
      if (preferences.length !== 0 && cuisineTypes.length !== 0) {
        navigation.push("Tinder", { preferences, cuisineTypes });
      }
    };
    getFilters();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Please Select Filters</Text>
      {/* <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
