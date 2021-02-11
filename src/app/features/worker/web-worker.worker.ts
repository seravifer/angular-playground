/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  throw new Error('Worker error');
  postMessage(response);
});
