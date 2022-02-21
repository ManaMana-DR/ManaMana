import React, { useState } from 'react'
import styled from 'styled-components/native'
import TinderCard from 'react-tinder-card'
import { Avatar } from 'react-native-paper';
import { useGetDishes } from '../hooks/useDishes'
import { Switch } from 'react-native-switch';
import { Text, View } from './Themed';


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

const CardTitle = styled.Text`
    position: absolute;
    bottom: 0;
    margin: 10px;
    color: black;
`

const InfoText = styled.Text`
    margin-top: 2px;
    height: 28px;
    justify-content: center;
    display: flex;
    z-index: -100;
    color: white;
`
const FlexContainer = styled.Text`
display: flex;
justify-content: space-between;
width: 100%;
max-width: 350px;
`

function Cards() {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const { isLoading, error, data: dishes } = useGetDishes()
    const [lastDirection, setLastDirection] = useState<string>()

    const swiped = (direction: string) => {
        setLastDirection(direction)
    }

    const outOfFrame = (name: string) => {
        console.log(name + ' left the screen!')
    }

    console.log(dishes)

    if (isLoading) {
        return <Header>React Native Tinder Card</Header>;
    }
    return (
        <Container>
            <Header>Mana Mana</Header>
            {dishes && <CardContainer>
                {dishes.map((dish) =>
                    <TinderCard key={dish.name} onSwipe={(dir) => swiped(dir)} onCardLeftScreen={() => outOfFrame(dish.name)}>
                        <Card>
                            <CardImage source={{ uri: dish.image }}>
                                <CardTitle>{dish.name}</CardTitle>
                            </CardImage>
                        </Card>
                    </TinderCard>
                )}
            </CardContainer>}
            <FlexContainer>
                <Avatar.Icon style={{
                    backgroundColor: "white", //works on IOS only
                }} color={"black"} size={48} icon="close" onClick={() => { swiped("left") }} />
                <Avatar.Icon style={{
                    backgroundColor: "white", //works on IOS only
                }} color={"red"} size={48} icon="cards-heart" onClick={() => swiped("right")} />
            </FlexContainer>

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

export default Cards
