import { Text, View } from '../components/Themed';
import { TinderProps } from '../types';
import { useEffect } from 'react';
import React, { useState } from 'react'
import styled from 'styled-components/native'
import TinderCard from 'react-tinder-card'
import { useGetDishes } from '../hooks/useDishes'
import { Switch } from 'react-native-switch';
import { ActivityIndicator } from 'react-native'
import { Button } from 'react-native-paper'
import { Linking } from 'react-native';


const Container = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
`

const Header = styled.Text`
    color: #ffffff;
    font-size: 30px;
    margin-bottom: 30px;
`

const CardContainer = styled.View`
    flex: 1 1 auto;
    display: flex;
    width: 90%;
    max-width: 350px;
    height: 300px;
`

const Card = styled.View`
    position: absolute;
    background-color: #fff;
    width: 100%;
    max-width: 350px;
    height: 500px;
    shadow-color: black;
    shadow-opacity: 0.2;
    shadow-radius: 20px;
    border-radius: 20px;
    resize-mode: cover;
`

const CardImage = styled.ImageBackground`
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 20px;
`

const CardTitle = styled.View`
	width: 100%;
    position: absolute;
    bottom: 0;
	padding: 6px 0;
	background-color: rgba(0, 0, 0, 0.4);
`

const InfoText = styled.Text`
    margin-top: 2px;
    height: 28px;
    justify-content: center;
    display: flex;
    z-index: -100;
    color: white;
`


export default function TinderDishes({ route }: TinderProps) {
	const { preferences, cuisineTypes } = route?.params;
	const [lastDirection, setLastDirection] = useState()
	const [isSwitchOn, setIsSwitchOn] = React.useState(false);
	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
	const { isLoading, error, data } = useGetDishes({ cuisineTypes, preferences });
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const swiped = (direction: any) => {
		setLastDirection(direction)
	}

	const outOfFrame = (name: string) => {
		console.log(name + ' left the screen!')
	}

	if (cuisineTypes.length === 0) {
		return (
			<View >
				<Text>Please Select Filters</Text>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flex: 1
				}}
			>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	if (error) {
		return (
			<View
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flex: 1
				}}
			>
				<Text>No Dishes Found</Text>
			</View>
		)
	}

	const handleClick = () => {
		const recommendation = data[currentIndex];
		console.log("click", recommendation)
		Linking.openURL(recommendation.orderUrl).catch(err => console.error("Couldn't load page", err));

	}

	if (data) {
		return (
			<Container>
				<Header>Mana Mana</Header>
				{data && <CardContainer>
					{data.map((item) =>
						<TinderCard key={item.name} onSwipe={(dir) => swiped(dir)} onCardLeftScreen={() => outOfFrame(item.name)}>
							<Card>
								<CardImage source={{ uri: item.imageUrl }}>
									<CardTitle>
										<Text style={{ textAlign: "center" }}>{item.name}</Text>
										<Text style={{ textAlign: "center" }}>
											{item.restaurantName}
										</Text>
									</CardTitle>
								</CardImage>
							</Card>
						</TinderCard>
					)}
				</CardContainer>}

				<View >
					<Button icon="credit-card" mode="contained" onPress={handleClick}>
						{`Pay ${data[currentIndex].price} Now`}
					</Button>
				</View>

				{lastDirection ? <InfoText>You swiped {lastDirection}</InfoText> : <InfoText />}


			</Container>
		);
	}

	return null;
}