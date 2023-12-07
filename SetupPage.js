import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from './AudioContext';
import { saveState, loadState } from './StorageUtils';
import { generateSteps } from './generateSteps';
import { useEffect } from 'react';

export default function SetupPage({ navigation }) {
  const [steps, setSteps] = useState([
    { key: "1", label: `2 x Breath 1s in, 2s out`, type: 'breathe', in: 1, out: 2, numberOfBreaths: 2 }
  ]);

  const [breathingSettings, setBreathingSettings] = useState({
    breathInDuration: '1',
    breathOutDuration: '1',
    numberOfBreaths: '1',
    quickInDuration: '1',
    quickOutDuration: '1',
    holdDuration: '1',
  });
  const { isPlaying, togglePlayback } = useAudio();

  useEffect(() => {
    loadSetup();
  }, []);

  const saveSetup = async () => {
    await saveState('breathingSettings', breathingSettings);
  };

  const loadSetup = async () => {
    if (await loadState('breathingSettings')) {
      setBreathingSettings(await loadState('breathingSettings'));
    }
    if (await loadState('steps')) {
      setSteps(await loadState('steps'));
    }
  };

  const addBreath = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `${breathingSettings.numberOfBreaths} x Breath ${breathingSettings.breathInDuration}s in, ${breathingSettings.breathOutDuration}s out`, type: 'breathe', in: parseFloat(breathingSettings.breathInDuration), out: parseFloat(breathingSettings.breathOutDuration), numberOfBreaths: parseFloat(breathingSettings.numberOfBreaths) };
    setSteps([...steps, newItem]);
    saveSetup();
  }

  const addQuick = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `Quick ${breathingSettings.quickInDuration}s in, ${breathingSettings.quickOutDuration}s out`, type: 'quick', durationIn: parseFloat(breathingSettings.quickInDuration), durationOut: parseFloat(breathingSettings.quickOutDuration) };
    setSteps([...steps, newItem]);
    saveSetup();
  }

  const addHold = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `Hold ${breathingSettings.holdDuration}s`, type: 'hold', duration: parseFloat(breathingSettings.holdDuration) };
    setSteps([...steps, newItem]);
    saveSetup();
  };

  // add every type of breath including hold and quick
  const addBlock = () => {
    const newKey = Date.now().toString();
    const newItem = {
      key: newKey, label: `${breathingSettings.numberOfBreaths}x(In:${breathingSettings.breathInDuration}/Out:${breathingSettings.breathOutDuration})-Qin:${breathingSettings.quickInDuration}/Qout:${breathingSettings.quickOutDuration}-Hold:${breathingSettings.holdDuration}`, type: 'block',
      numberOfBreaths: parseFloat(breathingSettings.numberOfBreaths),
      breathInDuration: parseFloat(breathingSettings.breathInDuration),
      breathOutDuration: parseFloat(breathingSettings.breathOutDuration),
      quickInDuration: parseFloat(breathingSettings.quickInDuration),
      quickOutDuration: parseFloat(breathingSettings.quickOutDuration),
      holdDuration: parseFloat(breathingSettings.holdDuration),
    };
    setSteps([...steps, newItem]);
    saveSetup();
  }

  const deleteItemByKey = (key) => {
    const newData = steps.filter(item => item.key !== key);
    setSteps(newData);
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 50,
            backgroundColor: isActive ? 'lightblue' : 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopWidth: 1,
            borderColor: '#ddd',
          }}
          onLongPress={drag}
        >
          <Text>{item.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteItemByKey(item.key)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const saveSteps = async (steps) => {
    try {
      await AsyncStorage.setItem('steps', JSON.stringify(steps));
      alert('Steps saved successfully');
    } catch (error) {
      console.error('Error saving steps:', error);
    }
  };

  const loadSteps = async () => {
    try {
      const loadedSteps = await AsyncStorage.getItem('steps');
      if (loadedSteps !== null) {
        setSteps(JSON.parse(loadedSteps));
      } else {
        alert('No steps saved previously');
      }
    } catch (error) {
      console.error('Error loading steps:', error);
    }
  };

  function navigateToTimerPage(steps) {
    if (steps.length === 0) {
      alert('Add at least one step');
      return;
    }

    let atomicSteps = generateSteps(steps);

    console.log(atomicSteps);

    navigation.navigate('TimerPage', { steps: atomicSteps, allowed: true });
    return atomicSteps;
  }


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <Text>Breath: </Text>
        <Text>In: </Text>
        <TextInput
          keyboardType="number-pad"
          value={breathingSettings.breathInDuration}
          onChangeText={(newVal) => setBreathingSettings(prevState => ({ ...prevState, breathInDuration: newVal }))}
          placeholder="seconds"
          style={styles.input}
        />
        <Text>Out: </Text>
        <TextInput
          keyboardType="number-pad"
          value={breathingSettings.breathOutDuration}
          onChangeText={(newVal) => setBreathingSettings(prevState => ({ ...prevState, breathOutDuration: newVal }))}
          placeholder="seconds"
          style={styles.input}
        />
        <Text>times: </Text>
        <TextInput
          keyboardType="number-pad"
          value={breathingSettings.numberOfBreaths}
          onChangeText={(newVal) => setBreathingSettings(prevState => ({ ...prevState, numberOfBreaths: newVal }))}
          placeholder="breath"
          style={styles.input}
        />
        <Button onPress={addBreath}>Add</Button>
      </View>

      <View style={styles.inputContainer}>
        <Text>Quick </Text>
        <Text>In: </Text>
        <TextInput
          keyboardType="number-pad"
          value={breathingSettings.quickInDuration}
          onChangeText={(newVal) => setBreathingSettings(prevState => ({ ...prevState, quickInDuration: newVal }))}
          placeholder="seconds"
          style={styles.input}
        />
        <Text>Out: </Text>
        <TextInput
          keyboardType="number-pad"
          value={breathingSettings.quickOutDuration}
          onChangeText={(newVal) => setBreathingSettings(prevState => ({ ...prevState, quickOutDuration: newVal }))}
          placeholder="seconds"
          style={styles.input}
        />
        <Button onPress={addQuick}>Add</Button>
      </View>

      <View style={styles.inputContainer}>
        <Text>Hold: </Text>
        <TextInput
          keyboardType="number-pad"
          value={breathingSettings.holdDuration}
          onChangeText={(newVal) => setBreathingSettings(prevState => ({ ...prevState, holdDuration: newVal }))}
          placeholder="seconds"
          style={styles.input}
        />
        <Button onPress={addHold}>Add</Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={addBlock}>Add block</Button>
      </View>
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={steps}
          renderItem={renderItem}
          keyExtractor={(item) => `draggable-item-${item.key}`}
          onDragEnd={({ data }) => setSteps(data)}
        />
      </View>
      <View style={styles.horizontalBox}>
        <Button onPress={() => navigateToTimerPage(steps)}>START</Button>
        <Button onPress={() => loadSteps()}>LOAD</Button>
        <Button onPress={() => saveSteps(steps)}>SAVE</Button>
        <Button onPress={togglePlayback}>
          {isPlaying ? "Pause Music" : "Play Music"}
        </Button>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 70,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
});

