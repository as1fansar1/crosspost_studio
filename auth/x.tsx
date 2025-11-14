const authButton = document.getElementById('auth-btn');
const cancelButton = document.getElementById('cancel-btn');

if (!authButton || !cancelButton) {
    throw new Error('Auth buttons not found');
}

authButton.addEventListener('click', () => {
    // In a real app, this would be a token from the OAuth flow.
    // For this simulation, we'll generate a random-looking key.
    const simulatedApiKey = `sk-x-simulated-${Math.random().toString(36).substring(2, 15)}`;

    if (window.opener) {
        window.opener.postMessage({
            type: 'x-auth-success',
            payload: {
                apiKey: simulatedApiKey,
            }
        }, window.opener.location.origin);
    }
    window.close();
});

cancelButton.addEventListener('click', () => {
    if (window.opener) {
        window.opener.postMessage({ type: 'x-auth-cancel' }, window.opener.location.origin);
    }
    window.close();
});
