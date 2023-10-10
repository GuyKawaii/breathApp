import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext();

export const useAudio = () => {
    return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
    const [backgroundMusicObject, setBackgroundMusicObject] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    async function togglePlayback() {
        if (!backgroundMusicObject) {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(require('./assets/music/aesthetic-boomopera.mp3'));
            setBackgroundMusicObject(sound);

            console.log('Setting Loop');
            await sound.setIsLoopingAsync(true);  // Set the sound to loop

            console.log('Playing Sound');
            await sound.playAsync();
            setIsPlaying(true);
        } else if (isPlaying) {
            await backgroundMusicObject.pauseAsync();
            setIsPlaying(false);
        } else {
            await backgroundMusicObject.playAsync();
            setIsPlaying(true);
        }
    }

    useEffect(() => {
        return backgroundMusicObject
            ? () => {
                console.log('Unloading Sound');
                backgroundMusicObject.unloadAsync();
            }
            : undefined;
    }, [backgroundMusicObject]);

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlayback }}>
            {children}
        </AudioContext.Provider>
    );
};
