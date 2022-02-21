import { Text, View } from '../components/Themed';
import { TinderProps } from '../types';
import { useEffect } from 'react';
import React, { useState } from 'react'
import styled from 'styled-components/native'
import TinderCard from 'react-tinder-card'
import { useGetDishes } from '../hooks/useDishes'
import { Switch } from 'react-native-switch';


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


export default function TinderDishes({ route, navigation }: TinderProps) {
	const { preferences, cuisineTypes } = route.params;
	const [lastDirection, setLastDirection] = useState()
	const [isSwitchOn, setIsSwitchOn] = React.useState(false);
	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
	const { isLoading, error, data } = useGetDishes({ cuisineTypes, preferences });

	const swiped = (direction: any) => {
		setLastDirection(direction)
	}

	const outOfFrame = (name: string) => {
		console.log(name + ' left the screen!')
	}

	useEffect(() => {
		if (error) {
			navigation.navigate('NotFound');
		}
	}, [error]);

	if (isLoading) {
		return <Text>Loading...</Text>;
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

				{lastDirection ? <InfoText>You swiped {lastDirection}</InfoText> : <InfoText />}

				<View style={{ marginBottom: 30 }}>
					<Switch
						switchWidthMultiplier={5}
						switchBorderRadius={90}
						value={isSwitchOn}
						onValueChange={onToggleSwitch}
						disabled={false}
						activeText={'Total 34$'}
						inActiveText={'Total 34$'}
						backgroundActive={'green'}
						backgroundInactive={'gray'}
						circleActiveColor={'#30a566'}
						circleInActiveColor={'#000000'} />
				</View>
			</Container>
		);
	}

	return null;
}