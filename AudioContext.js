import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';

// Static imports for tracks
const track2 = require('./assets/music/aesthetic-boomopera.mp3');
const track1 = require('./assets/music/forest-stream-birds-sound.mp3');

const tracks = {
  'track1': track1,
  'track2': track2,
};

const AudioContext = createContext();

export const useAudio = () => {
    return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
    const [backgroundMusicObject, setBackgroundMusicObject] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState('track1');
    const [volume, setVolumeState] = useState(1); // Default volume level

    // Function to load and play a sound
    async function loadSound(trackName) {
        const track = tracks[trackName];
        const { sound } = await Audio.Sound.createAsync(track);
        if (backgroundMusicObject) {
            await backgroundMusicObject.unloadAsync();
        }
        setBackgroundMusicObject(sound);
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
        setIsPlaying(true);
    }

    // Function to change the track
    async function changeTrack(trackName) {
        setCurrentTrack(trackName);
        await loadSound(trackName);
    }

    // Function to toggle playback
    async function togglePlayback() {
        if (!backgroundMusicObject) {
            await loadSound(currentTrack);
        } else if (isPlaying) {
            await backgroundMusicObject.pauseAsync();
            setIsPlaying(false);
        } else {
            await backgroundMusicObject.playAsync();
            setIsPlaying(true);
        }
    }

    // Function to set the volume
    const setVolume = async (newVolume) => {
        setVolumeState(newVolume); // Update state
        if (backgroundMusicObject) {
            await backgroundMusicObject.setVolumeAsync(newVolume);
        }
    };

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlayback, changeTrack, setVolume, volume }}>
            {children}
        </AudioContext.Provider>
    );
};

