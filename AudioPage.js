import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAudio } from './AudioContext';
import Slider from '@react-native-community/slider';

const AudioEditPage = () => {
  const { changeTrack, togglePlayback, isPlaying, setVolume } = useAudio();
  const [volume, setLocalVolume] = useState(1);

  const tracks = [
    'track1',
    'track2',
    // potentially more tracks
  ];

  const handleTrackChange = (track) => {
    changeTrack(track);
  };

  const handleVolumeChange = (value) => {
    setLocalVolume(value);
    setVolume(value); // Assuming you have a setVolume method in your context
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Audio settings</Text>

      <View style={styles.backgroundSection}>
        <Text style={styles.subHeader}>Select Track</Text>
        {tracks.map(track => (
          <View key={track} style={styles.buttonContainer}>
            <Button
              title={track}
              onPress={() => handleTrackChange(track)}
            />
          </View>
        ))}
      </View>

      <View style={styles.backgroundSection}>
        <Text style={styles.subHeader}>Volume</Text>
        <Slider
          style={styles.slider}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumValue={0}
          maximumValue={1}
          step={0.05}
          minimumTrackTintColor="#007AFF" // Example track color
          thumbTintColor="#007AFF" // Example thumb color
        />
      </View>

      <View style={styles.section}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={togglePlayback}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  section: {
    // marginVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  backgroundSection: {
    marginVertical: 15,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subHeader: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 15,
    marginTop: 5,
    color: '#444',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    marginVertical: 5,
    width: '90%',
    paddingBottom: 15,
  },
});

export default AudioEditPage;
