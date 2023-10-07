import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Audio } from 'expo-av';

function TimerPage({ route, navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { steps, reset } = route.params;

  async function playSound() {
    const soundObject = new Audio.Sound();

    const step = steps[currentStep + 1];
    console.log("Playing sound for step", step);
    try {
      switch (step.type) {
        case 'breathe':
          console.log("Playing breathe sound");
          await soundObject.loadAsync(require('./assets/sound/breathe.mp3'));
          await soundObject.playAsync();
          break;
        case 'breathe-in':
          console.log("Playing breathe sound");
          await soundObject.loadAsync(require('./assets/sound/breathe-in.mp3'));
          await soundObject.playAsync();
          break;
        case 'breathe-out':
          console.log("Playing breathe sound");
          await soundObject.loadAsync(require('./assets/sound/breathe-out.mp3'));
          await soundObject.playAsync();
          break;
        case 'quick':
          console.log("Playing quick sound");
          await soundObject.loadAsync(require('./assets/sound/quick.mp3'));
          await soundObject.playAsync();
          break;
        case 'hold':
          console.log("Playing hold sound");
          await soundObject.loadAsync(require('./assets/sound/hold.mp3'));
          await soundObject.playAsync();
          break;
        default:
          break;
      }
    } catch (error) {
      console.log("Error loading or playing sound.", error);
    }
  }


  useEffect(() => {
    if (reset) {
      setCurrentStep(0);
      setIsPlaying(true);
    }
  }, [reset]);

  const computeCurrentStep = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'breathe':
        return { duration: step.in + step.out, isGrowing: false };
      case 'breathe-in':
        return { duration: step.duration, isGrowing: false };
      case 'breathe-out':
        return { duration: step.duration, isGrowing: false };
      case 'quick':
        return { duration: step.duration, isGrowing: false };
      case 'hold':
        return { duration: step.duration, isGrowing: false };
      default:
        return { duration: step.duration, isGrowing: false };
    }
  };

  const { duration, isGrowing } = computeCurrentStep();

  const handleComplete = () => {
    playSound(currentStep);

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      return [true, 0];  // Reset timer immediately
    } else {
      navigation.goBack();  // Go back to SetupPage
      return [false, 0];  // Stop repeating the timer
    }
  };

  return (
    <View style={styles.container}>
      <CountdownCircleTimer
        key={currentStep}  // Reset timer when changing step
        isPlaying={isPlaying}
        duration={duration}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[10, 6, 3, 0]}
        onComplete={handleComplete}
        updateInterval={0}
        isGrowing={isGrowing}
      >
        {({ remainingTime, color }) => (
          <Text style={{ color, fontSize: 40 }}>
            {remainingTime}
          </Text>
        )}
      </CountdownCircleTimer>
      <Button title="Toggle Playing" onPress={() => setIsPlaying(prev => !prev)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});

export default TimerPage;
