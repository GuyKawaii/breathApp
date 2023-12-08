import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Audio } from 'expo-av';
import { useAudio } from './AudioContext';
import Slider from '@react-native-community/slider';
import { saveSessionBreathHolds, loadSessionBreathHolds } from './FirebaseFuntions';
import LoginContext from './LoginContext';
import { Dimensions } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake'; // Prevent screen from sleeping

function TimerPage({ route, navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);                 // rename to isPlayingTimer
  const { steps, reset } = route.params;
  const { togglePlayback, isPlaying: isPlayingMusic } = useAudio(); // remane later to isPlayingMusic and toggleMusicPlayback
  const { user } = useContext(LoginContext);

  const soundObject = new Audio.Sound();

  async function playSound(overrideStep = null) {
    let step;

    if (overrideStep !== null) {
      step = steps[overrideStep];
    } else {
      step = steps[currentStep + 1];
    }

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
        case 'complete':
          soundAsset = require('./assets/sound/complete.mp3');
          break;
        case 'start':
          return; // Early return

        default:
          console.error("Unknown step type:", step.type);
          return; // Early return
      }

      // unload any previous sound
      if (soundAsset) {
        soundObject.setOnPlaybackStatusUpdate((status) => {
          if (!status.didJustFinish) return;
          soundObject.unloadAsync();
        });

        // Load and play the sound
        await soundObject.loadAsync(soundAsset);

        // // Set volume based on the type of sound
        // switch (step.type) {
        //   case 'complete':
        //     await soundObject.setVolumeAsync(1); // 50% volume for 'complete' sound
        //     break;
        //   default:
        //     await soundObject.setVolumeAsync(1);   // 100% volume for other sounds
        //     break;
        // }

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

    switch (step.type) {
      case 'hold':
        return {
          duration: step.duration,
          color: ['#9B59B6', '#96d5ff'],
          colorsTime: [step.duration, 0],
        };
      default:
        return {
          duration: step.duration,
          color: ['#3498DB', '#2ECC71'],
          colorsTime: [step.duration, 0],
        };
    }
  };

  const { duration, color, colorsTime } = computeCurrentStep();

  const handleComplete = () => {
    playSound();

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      return [true, 0];  // Reset timer and repeat
    } else {
      // Check if user is logged in
      if (user && user.email) {
        // sessionData properties:
        const holdDurations = steps
          .filter(step => step.type === 'hold')
          .map(step => step.duration);

        const totalTime = steps
          .reduce((acc, step) => acc + step.duration, 0)

        const totalHoldTime = holdDurations.reduce((acc, duration) => acc + duration, 0);

        const sessionData = {
          holdDurations: holdDurations,
          percentageHold: ((totalHoldTime / totalTime) * 100).toFixed(1) + '%',
        };

        saveSessionBreathHolds(user.email, sessionData).then(() => {
        }).catch(error => {
          console.error('Error saving session:', error);
        });
      } else {
        console.log('No user logged in, not saving session');
      }

      navigation.goBack(); // Go back to SetupPage
      return [false, 0];   // Stop repeating the timer
    }
  };

  useKeepAwake(); // Prevent screen from sleeping
  return (
    <View style={styles.container}>
      <CountdownCircleTimer
        key={currentStep}
        isPlaying={isPlaying}
        duration={duration}
        colors={color}
        colorsTime={colorsTime}
        onComplete={handleComplete}
        updateInterval={0}
      >
        {({ remainingTime, color }) => (
          <Text style={[styles.timerText, { color }]}>
            {remainingTime}
          </Text>
        )}
      </CountdownCircleTimer>

      <View style={styles.controlsContainer}>
        <Pressable style={styles.button} onPress={() => setIsPlaying(prev => !prev)}>
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={togglePlayback}>
          <Text style={styles.buttonText}>{isPlayingMusic ? 'Pause Music' : 'Play Music'}</Text>
        </Pressable>
        <Text style={styles.stepText}>{`${currentStep + 1} / ${steps.length}`}</Text>
        <Text style={styles.stepText}>{`${steps[currentStep].type}`}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={steps.length - 1}
          value={currentStep}
          onValueChange={(value) => setCurrentStep(value)}
          step={1}
          onTouchStart={() => {
            setIsPlaying(false);
          }}
          onSlidingComplete={() => {
            playSound(currentStep);
            setIsPlaying(true);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: 120,
    borderRadius: 4,
    margin: 12,
    backgroundColor: 'green',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  controlsContainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  slider: {
    width: Dimensions.get('window').width - 20,
    height: 40,
  },
  stepText: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default TimerPage;
