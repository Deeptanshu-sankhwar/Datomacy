window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) {
    return;
  }
  
  if (event.data.type === 'TUBEDAO_AUTH_SUCCESS') {
    chrome.runtime.sendMessage({
      type: 'AUTH_SUCCESS',
      token: event.data.token,
      address: event.data.address,
      chainId: event.data.chainId,
      expiresAt: event.data.expiresAt,
    }).then(() => {
      window.postMessage({
        type: 'TUBEDAO_AUTH_CONFIRMED',
        source: 'extension'
      }, window.location.origin);
    }).catch((error) => {
    });
  } else if (event.data.type === 'TUBEDAO_AUTH_REQUIRED') {
    chrome.runtime.sendMessage({
      type: 'AUTH_REQUIRED',
    }).catch((error) => {
    });
  }
});

window.postMessage({
  type: 'TUBEDAO_EXTENSION_READY',
  source: 'content-script'
}, window.location.origin);

setTimeout(() => {
  window.postMessage({
    type: 'TUBEDAO_EXTENSION_READY',
    source: 'content-script'
  }, window.location.origin);
}, 1000);
