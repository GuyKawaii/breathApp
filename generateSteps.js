export function generateSteps(steps) {
  let splitSteps = [];

  // padding start
  splitSteps.push({ "type": "start", "duration": 1 });

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    switch (step.type) {
      case 'breathe':
        for (let j = 0; j < step.numberOfBreaths; j++) {
          splitSteps.push({ "type": "breathe-in", "duration": step.in });
          splitSteps.push({ "type": "breathe-out", "duration": step.out });
        }
        break;
      case 'quick':
        splitSteps.push({ "type": "quick-in", "duration": step.durationIn });
        splitSteps.push({ "type": "quick-out", "duration": step.durationOut });
        break;
      case 'block':
        for (let j = 0; j < step.numberOfBreaths; j++) {
          splitSteps.push({ "type": "breathe-in", "duration": step.breathInDuration });
          splitSteps.push({ "type": "breathe-out", "duration": step.breathOutDuration });
        }
        splitSteps.push({ "type": "quick-in", "duration": step.quickInDuration });
        splitSteps.push({ "type": "quick-out", "duration": step.quickOutDuration });
        splitSteps.push({ "type": "hold", "duration": step.holdDuration });
        break;
      default:
        splitSteps.push(step);
        break;
    }

    // Check if this step is of type 'hold' and the next step is also 'hold',
    // then add a breathe-in in between them.
    if (step.type === 'hold' && i + 1 < steps.length && steps[i + 1].type === 'hold') {
      splitSteps.push({ "type": "breathe-in", "duration": 1 });
    }
  }

  // If the last step is of type 'hold', add a padding step of type 'breathe-in'.
  if (splitSteps[splitSteps.length - 1].type === 'hold') {
    splitSteps.push({ "type": "breathe-in", "duration": 1 });
  }

  // padding end
  splitSteps.push({ "type": "complete", "duration": 1 });

  console.log(splitSteps);

  return splitSteps;
}