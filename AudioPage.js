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
    // add tracks later
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
      <Text style={styles.header}>Edit Audio</Text>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Select Track</Text>
        {tracks.map(track => (
          <Button key={track} title={track} onPress={() => handleTrackChange(track)} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Volume</Text>
        <Slider
          style={styles.slider}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
        />
      </View>

      <View style={styles.section}>
        <Button title={isPlaying ? 'Pause' : 'Play'} onPress={togglePlayback} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  section: {
    marginVertical: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 10,
  },
  slider: {
    width: 200,
    height: 40,
  },
});

export default AudioEditPage;
