import React, { useState, useEffect } from "react";
import Swiper from "react-native-deck-swiper";
import { StyleSheet, Text, View, Image } from "react-native";
import { imageData, getAllRestaurantsByLocation } from "../api.mjs";
import ChooseRestaurant from "../components/ChooseRestaurant.jsx";

export default function SwipeList({ setMaybePile, preferences, postcode }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getAllRestaurantsByLocation(postcode, preferences).then((response) => {
      response.forEach((restaurant) => {
        restaurant.image = imageData[restaurant.type];
      });

      setData(response);
      setIsLoading(false);
    });
  }, [preferences]);

  const swipeRightHandler = (cardIndex) => {
    setMaybePile((currMaybePile) => {
      return [...currMaybePile, cardIndex];
    });
  };

  if (isLoading)
    return (
      <View style={styles.defaultBackground}>
        <Text style={styles.textTitle}>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Swiper
        cards={data}
        renderCard={(card) => {
          return (
            <View style={styles.card}>
              <Image source={card.image} style={styles.image} />
              <Text style={styles.textTitle}>{card.name}</Text>
              <Text style={styles.textLine}>🍴{card.type}</Text>
              <Text style={styles.textLine}>📍 {card.addressLine1}</Text>
              <Text style={styles.textLine}>⭐ {card.ratingValue}/5</Text>
              <Text style={styles.textLine}>Less than 1 mile away</Text>
              <ChooseRestaurant restaurantCard={card} />
            </View>
          );
        }}
        onSwipedRight={(cardIndex) => {
          swipeRightHandler(data[cardIndex]);
        }}
        onSwipedAll={() => {
          alert("No more options");
        }}
        cardIndex={0}
        backgroundColor={"#FD3A73"}
        stackSize={5}
        goBackToPreviousCardOnSwipeBottom={true}
        disableTopSwipe={true}
      ></Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  card: {
    flex: 0.75,
    borderRadius: 4,
    borderWidth: 2,
    marginTop: 50,
    borderColor: "#E8E8E8",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  textTitle: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  textLine: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    backgroundColor: "transparent",
  },
  image: {
    flex: 0.75,
    flexDirection: "column",
    marginBottom: 10,
    width: "100%",
    height: "50%",
  },
  defaultBackground: {
    flex: 1,
    backgroundColor: "#FD3A73",
    alignItems: "center",
    justifyContent: "center",
  },
});
