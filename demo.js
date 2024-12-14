const container = document.createElement('div');
container.className = 'millie-container';
document.body.appendChild(container);

const startButton = document.createElement('button');
startButton.className = 'millie-button';
startButton.textContent = 'Start';
container.appendChild(startButton);

const inputField = document.createElement('input');
inputField.className = 'millie-input';
inputField.type = 'text';
inputField.placeholder = 'Enter phone number';
container.appendChild(inputField);

if (!window.MILLIE_DEV_URL) {
  window.MILLIE_DEV_URL = 'https://project-millie.fly.dev';
}

let hasSession = false;

let retell = window.retell;

let isCalling = false;

let DEMO_AGENT_ID = 'agent_33f2ee331d4a0de6b33babe238';

if (window.MILLIE_DEMO_AGENT_ID) {
  DEMO_AGENT_ID = window.MILLIE_DEMO_AGENT_ID;
}

let phoneNumber = '';

retell.on('call_ended', () => {
  isCalling = false;
  startButton.textContent = 'Start';
});

retell.on('error', (error) => {
  console.error('An error occurred:', error);
  retell.stopCall();
});

startButton?.addEventListener('click', async () => {
  if (!phoneNumber) {
    alert('Please enter a phone number');
    return;
  }

  if (isCalling) {
    retell.stopCall();

    startButton.textContent = 'Start';
    isCalling = false;
  } else {
    const response = await fetch(`${window.MILLIE_DEV_URL}/api/demo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: DEMO_AGENT_ID,
        metadata: {
          phoneNumber,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start call');
    }

    const { accessToken } = await response.json();

    retell.startCall({
      accessToken,
      sampleRate: 48000,
    });
    startButton.textContent = 'Stop';
    isCalling = true;
  }
});

inputField?.addEventListener('input', (event) => {
  phoneNumber = event.target.value;
});
