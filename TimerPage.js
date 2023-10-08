import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Audio } from 'expo-av';

function TimerPage({ route, navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { steps, reset } = route.params;

  const soundObject = new Audio.Sound();
  async function playSound() {
    const step = steps[currentStep + 1];

    if (step === undefined) {
      return;
    }

    console.log("Playing sound for step", step);
    console.log(step.type);

    let soundAsset;

    try {
      switch (step.type) {
        case 'breathe-in':
          soundAsset = require('./assets/sound/breathe-in.mp3');
          break;
        case 'breathe-out':
          soundAsset = require('./assets/sound/breathe-out.mp3');
          break;
        case 'quick-in':
          soundAsset = require('./assets/sound/quick-in.mp3');
          break;
        case 'quick-out':
          soundAsset = require('./assets/sound/quick-out.mp3');
          break;
        case 'hold':
          soundAsset = require('./assets/sound/hold.mp3');
          break;
        case 'padding':

        default:
          console.error("Unknown step type:", step.type);
          return; // Early return
      }

      if (soundAsset) {
        await soundObject.unloadAsync();
        await soundObject.loadAsync(soundAsset);
        await soundObject.playAsync();
      } else {
        console.error("Sound asset not found for step type:", step.type);
      }

    } catch (error) {
      console.error("Error loading or playing sound.", error);
    }
  }

  const computeCurrentStep = () => {
    const step = steps[currentStep];

    // TODO: Add special case for each step type
    switch (step.type) {
      default:
        return {
          duration: step.duration,
          color: ["blue"],
          colorsTime: [0],
        };
    }
  };

  const { duration, color, colorsTime } = computeCurrentStep();

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
        colors={color}
        colorsTime={colorsTime}
        onComplete={handleComplete}
        updateInterval={0}
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
