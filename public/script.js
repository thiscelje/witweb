// Select DOM elements
const startBtn = document.getElementById('start-btn');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const outputDiv = document.getElementById('output');
const lampu = document.getElementById('lampu');

let recognition;

// Check if SpeechRecognition is supported
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'id-ID'; // Indonesian language

    recognition.onresult = async (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        outputDiv.textContent = `Perintah: ${command}`;

        // Send command to backend
        const response = await fetch('/wit-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: command }),
        });

        const data = await response.json();
        handleWitResponse(data);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
} else {
    alert('Speech recognition not supported in this browser.');
}

// Start listening
startBtn.addEventListener('click', () => {
    recognition.start();
    outputDiv.textContent = 'Mendengarkan...';
});

// Handle Send Button Click for Chat
sendBtn.addEventListener('click', async () => {
    const command = chatInput.value.trim().toLowerCase();
    if (!command) {
        alert('Silakan masukkan perintah.');
        return;
    }

    outputDiv.textContent = `Perintah: ${command}`;

    // Send command to backend
    const response = await fetch('/wit-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: command }),
    });

    const data = await response.json();
    handleWitResponse(data);

    // Clear input field
    chatInput.value = '';
});

// Handle Enter Key Press in Chat Input
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});

// Handle Wit.ai response
function handleWitResponse(data) {
    const intent = data.intents[0]?.name;
    const device = data.entities['device:device']?.[0]?.value;

    if (intent === 'set_device') {
        if (data.text.includes('nyalakan')) {
            lampu.classList.remove('off');
            lampu.classList.add('on');
            outputDiv.textContent = 'Lampu dinyalakan.';
        } else if (data.text.includes('matikan')) {
            lampu.classList.remove('on');
            lampu.classList.add('off');
            outputDiv.textContent = 'Lampu dimatikan.';
        }
    } else if (intent === 'get_device') {
        const status = lampu.classList.contains('on') ? 'Nyala' : 'Mati';
        outputDiv.textContent = `Status Lampu: ${status}`;
    } else {
        outputDiv.textContent = 'Perintah tidak dikenali.';
    }
}