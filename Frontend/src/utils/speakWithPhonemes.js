export async function speakWithPhonemes(text, onAudioReady) {
  // Example pseudo logic – customize with your Speak.js patch
  const { buffer, phonemeEvents } = await window.speakJS.generatePhonemePcm(text);
  const blob = new Blob([buffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  onAudioReady(url);
  return phonemeEvents;
}
