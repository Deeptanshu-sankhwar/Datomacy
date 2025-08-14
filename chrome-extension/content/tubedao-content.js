// TubeDAO Content Script Bridge : Handles communication between web app and extension

window.addEventListener('message', (event) => {
  // Security: Only accept messages from same origin
  if (event.origin !== window.location.origin) return;
  
  if (event.data.type === 'TUBEDAO_AUTH_SUCCESS') {
    chrome.runtime.sendMessage({
      type: 'AUTH_SUCCESS',
      token: event.data.token,
      address: event.data.address,
      chainId: event.data.chainId,
      expiresAt: event.data.expiresAt,
    }).then(() => {
      // Message sent successfully
    }).catch((error) => {
      console.error('Failed to send auth success message to extension:', error);
    });
  } else if (event.data.type === 'TUBEDAO_AUTH_REQUIRED') {
    chrome.runtime.sendMessage({
      type: 'AUTH_REQUIRED',
    }).then(() => {
      // Message sent successfully
    }).catch((error) => {
      console.error('Failed to send auth required message to extension:', error);
    });
  }
});

// Notify web app that extension content script is ready
window.postMessage({
  type: 'TUBEDAO_EXTENSION_READY',
  source: 'content-script'
}, window.location.origin);
