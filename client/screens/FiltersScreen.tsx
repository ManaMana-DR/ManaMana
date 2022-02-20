import { useState } from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

import { Text, View } from "../components/Themed";

interface Filters {
  kosher: boolean;
  notKosher: boolean;
  vegan: boolean;
}

const cuisine = [
  {
    Names: {
      He: "אסייתי",
      En: "Asian",
    },
    Id: "asianFusion",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/asianFusion.png",
  },
  {
    Names: {
      He: "בשרים",
      En: "BBQ",
    },
    Id: "meatGrill",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/meatGrill.png",
  },
  {
    Names: {
      He: "פיצה",
      En: "Pizza",
    },
    Id: "pizza",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/pizza.png",
  },
  {
    Names: {
      He: "המבורגר",
      En: "Burgers",
    },
    Id: "burgers",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/burgers.png",
  },
  {
    Names: {
      He: "סושי",
      En: "Sushi",
    },
    Id: "japaneseSushi",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/japaneseSushi.png",
  },
  {
    Names: {
      He: "סלטים",
      En: "Salads",
    },
    Id: "salads",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/salads.png",
  },
  {
    Names: {
      He: "בית קפה",
      En: "Coffee House",
    },
    Id: "coffeeHouse",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/coffeeHouse.png",
  },
  {
    Names: {
      He: "אוכל ביתי",
      En: "Home made",
    },
    Id: "homeMade",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/homeMade.png",
  },
  {
    Names: {
      He: "פסטה",
      En: "Pasta",
    },
    Id: "pasta",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/pasta.png",
  },
  {
    Names: {
      He: "דגים",
      En: "Fish",
    },
    Id: "fish",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/fish.png",
  },
  {
    Names: {
      He: "חומוס",
      En: "Humus",
    },
    Id: "humus",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/humus.png",
  },
  {
    Names: {
      He: "גלידריה",
      En: "Gelato",
    },
    Id: "gelato",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/gelato.png",
  },
  {
    Names: {
      He: "כריכים",
      En: "Wraps",
    },
    Id: "sandwichesWraps",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/sandwichesWraps.png",
  },
  {
    Names: {
      He: "חנות נוחות",
      En: "Store",
    },
    Id: "convenienceStore",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/convenienceStore.png",
  },
  {
    Names: {
      He: "קונדטוריה",
      En: "Patisserie",
    },
    Id: "patisserie",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/patisserie.png",
  },
  {
    Names: {
      He: "מיצים/שייקים",
      En: "Juice",
    },
    Id: "SmoothiesAndShakes",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/SmoothiesAndShakes.png",
  },
  {
    Names: {
      He: "מקסיקני",
      En: "Mexican",
    },
    Id: "mexican",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/mexican.png",
  },
  {
    Names: {
      He: "הודי",
      En: "Indian",
    },
    Id: "indian",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/indian.png",
  },
  {
    Names: {
      He: "פלאפל",
      En: "Falafel",
    },
    Id: "falafel",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/falafel.png",
  },
  {
    Names: {
      He: "פירות ים",
      En: "Seafood",
    },
    Id: "seafood",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/seafood.png",
  },
  {
    Names: {
      He: "פוקי",
      En: "Poke",
    },
    Id: "poke",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/poke.png",
  },
  {
    Names: {
      He: "מרקים",
      En: "Soup",
    },
    Id: "soup",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/soup.png",
  },
  {
    Names: {
      He: "מאפים",
      En: "Pastries",
    },
    Id: "bakery",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/bakery.png",
  },
  {
    Names: {
      He: "בר",
      En: "Bar",
    },
    Id: "bar",
    IconImageUrl:
      "https://tenbis-static.azureedge.net/restaurant-cuisine-type-icon-image/bar.png",
  },
];

const preferences: { key: keyof Filters; text: string }[] = [
  { key: "kosher", text: "Kosher" },
  { key: "notKosher", text: "Not Kosher" },
  { key: "vegan", text: "Vegan" },
];

export default function FiltersScreen() {
  const [filters, setFilters] = useState<Partial<Filters>>({});
  const [cuisineTypes, setCuisineTypes] = useState(cuisine);

  const handleChipPress = (key: keyof Filters) => {
    setFilters((filters) => ({ ...filters, [key]: !filters[key] }));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {preferences.map((preference) => (
          <Chip
            style={{ margin: 5 }}
            selected={filters[preference.key]}
            onPress={() => handleChipPress(preference.key)}
          >
            {preference.text}
          </Chip>
        ))}
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Preferences</Text>

      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {cuisineTypes.map((cuisineType) => (
          <Chip
            key={cuisineType.Id}
            // onPress={() => handleChipPress(cuisineType.Id)}
          >
            {cuisineType.Names.He}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsContainer: {},
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
