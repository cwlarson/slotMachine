(() => {
  const CAFFEINE_TYPES = ['coffee', 'tea', 'espresso'];
  const leverNode = document.getElementById('js-lever');
  const screenMessageNode = document.getElementById('js-screenMessage');

  // Populate the slot windows and set the initial orientation
  let slotWindows = [];
  let slotWindowNodes = document.getElementsByClassName('slotMachine-slotWindow-options');
  for(let i=0; i<slotWindowNodes.length; i++) {
    let node = slotWindowNodes[i];
    let optionType = node.dataset.type;
    slotWindows.push({
      node: node,
      optionType: optionType,
      value: 0,
      rotations: 0,
      degreesRotated: 0,
    });

    for(let j=0; j<(2*CAFFEINE_TYPES.length); j++) {
      let caffeineType = CAFFEINE_TYPES[j % CAFFEINE_TYPES.length];

      let option = document.createElement('div');
      option.className = 'slotMachine-slotWindow-option';
      option.style.transform = `rotateY(${360 / (2 * CAFFEINE_TYPES.length) * j}deg) rotateZ(-90deg) translateZ(130px)`;

      let optionImage = document.createElement('img');
      optionImage.src = `https://cwlarson.github.io/slotMachine/images/${caffeineType}-${optionType}.jpg`;

      option.appendChild(optionImage);
      node.appendChild(option);
    }
  };


  // Spin each slot window
  var isSpinning = false;
  let degreesPerOption = 360 / (2 * CAFFEINE_TYPES.length);
  function spinSlotWindow(slotWindow) {
    let numberOfSpins = 0;
    let spinInterval = setInterval(() => {
      if(numberOfSpins < slotWindow.rotations) {
        slotWindow.degreesRotated += degreesPerOption;
        slotWindow.node.style.transform = `rotateX(${slotWindow.degreesRotated}deg) rotateZ(90deg)`;
        numberOfSpins++;
      }
      else {
        clearInterval(spinInterval);
        if(slotWindow.optionType == "grounds") {
          spinSlotWindowComplete();
        }
      }
    }, 100);
  }

  // Called when the final slot window is done spinning
  function spinSlotWindowComplete() {
    isSpinning = false;
    leverNode.classList.remove('animateLever');

    // If all 3 values are equal, then the user wins that beverage
    if(slotWindows[0].value === slotWindows[1].value &&
       slotWindows[0].value === slotWindows[2].value) {
      screenMessageNode.innerHTML = `Congrats!<br/>You've won a free ${CAFFEINE_TYPES[slotWindows[0].value]}`;
    }
    // Else no winner
    else {
      screenMessageNode.innerHTML = "Dang, no luck<br/>Click the lever to try again!";
    }
  }

  // This handles the click event on the lever
  function pullSlotMachineLever() {
    // If the slots are already spinning, don't allow a click
    if(isSpinning) {
      return;
    }
    isSpinning = true;

    // Animate the lever
    leverNode.classList.add('animateLever');

    // Update the message screen on the slot machine
    screenMessageNode.innerHTML = "Spinning...<br/>Cross your fingers!";

    // Spin a random amount between 2 and 6 full rotations for each window, plus the amount that the window to the left spun
    let minimumRotations = CAFFEINE_TYPES.length * 2;
    let previousRotations = 0;
    let multiplier = CAFFEINE_TYPES.length * 4;
    slotWindows.forEach((slotWindow, ind) => {
      slotWindow.rotations = previousRotations + Math.round(Math.random() * multiplier) + minimumRotations;
      slotWindow.value = (slotWindow.value + slotWindow.rotations) % CAFFEINE_TYPES.length;

      previousRotations = slotWindow.rotations;
      spinSlotWindow(slotWindow);
    });
  }

  leverNode.onclick = pullSlotMachineLever;
})();
