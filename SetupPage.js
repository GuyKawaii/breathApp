import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";

function SetupPage({ navigation }) {
  const [steps, setSteps] = useState([]);
  const [breathIn, setBreathIn] = useState('1');
  const [breathOut, setBreathOut] = useState('1');
  const [holdDuration, setHoldDuration] = useState('30');
  const [currentInputs, setCurrentInputs] = useState({}); // New state to track current input values

  const handleInputChange = (index, key, value) => {
    // Only track the change locally without updating the main array
    setCurrentInputs(prev => ({
      ...prev,
      [`${index}-${key}`]: value
    }));
  };

  const handleInputBlur = (index, key) => {
    let value = currentInputs[`${index}-${key}`];
    let parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) parsedValue = 0; // Set default value if parsed value is NaN

    let newSteps = [...steps];
    newSteps[index][key] = parsedValue;
    setSteps(newSteps);
  };

  const addBreatheStep = () => {
    setSteps(prev => [...prev, { type: 'breathe', in: parseInt(breathIn, 10), out: parseInt(breathOut, 10) }]);
  };

  const addQuickStep = () => {
    setSteps(prev => [...prev, { type: 'quick' }]);
  };

  const addHoldStep = () => {
    setSteps(prev => [...prev, { type: 'hold', duration: parseInt(holdDuration, 10) }]);
  };

  const updateStep = (index, key, value) => {
    if (value === "") return; // Exit the function if the input is empty

    let parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) parsedValue = 0; // Set default value if parsed value is NaN

    let newSteps = [...steps];
    newSteps[index][key] = parsedValue;
    setSteps(newSteps);
  };

  const deleteStep = (index) => {
    let newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Setup your breath holding</Text>

      {/* Breathe Step */}
      <Text>Breathe (seconds):</Text>
      <TextInput
        placeholder="In"
        value={breathIn}
        onChangeText={setBreathIn}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10, width: 50 }}
      />
      <TextInput
        placeholder="Out"
        value={breathOut}
        onChangeText={setBreathOut}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10, width: 50 }}
      />
      <Button title="Add Breathe Step" onPress={addBreatheStep} />

      {/* Quick Step */}
      <Button title="Add Quick Breath" onPress={addQuickStep} />

      {/* Hold Step */}
      <TextInput
        placeholder="Hold Duration"
        value={holdDuration}
        onChangeText={setHoldDuration}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10, width: 100 }}
      />
      <Button title="Add Hold Step" onPress={addHoldStep} />

      {/* Show Steps */}
      <FlatList
        data={steps}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{item.type}</Text>
            {item.type === 'breathe' && (
              <>
                <TextInput
                  placeholder="In"
                  value={currentInputs[`${index}-in`] || item.in.toString()}
                  onChangeText={value => handleInputChange(index, 'in', value)}
                  onBlur={() => handleInputBlur(index, 'in')}
                  keyboardType="numeric"
                  style={{ borderWidth: 1, padding: 8, width: 50 }}
                />
                <TextInput
                  placeholder="Out"
                  value={currentInputs[`${index}-out`] || item.out.toString()}
                  onChangeText={value => handleInputChange(index, 'out', value)}
                  onBlur={() => handleInputBlur(index, 'out')}
                  keyboardType="numeric"
                  style={{ borderWidth: 1, padding: 8, width: 50 }}
                />
              </>
            )}
            {item.type === 'hold' && (
              <TextInput
                placeholder="Duration"
                value={currentInputs[`${index}-duration`] || item.duration.toString()}
                onChangeText={value => handleInputChange(index, 'duration', value)}
                onBlur={() => handleInputBlur(index, 'duration')}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 8, width: 100 }}
              />
            )}
            <Button title="Delete" onPress={() => deleteStep(index)} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Start the sequence */}
      <Button title="Start" onPress={() => navigateToTimerPage()} />
    </View>
  );

  // split steps and navigate to TimerPage
  function navigateToTimerPage() {
    // placeholder for now
    let steps = [{ type: 'breathe-in', duration: 1 }, { type: 'breathe-out', duration: 3 }, { type: 'quick', duration: 4 }, { type: 'hold', duration: 30 }];
    navigation.navigate('TimerPage', { steps, reset: true });
  }
}

export default SetupPage;
