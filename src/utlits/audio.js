
export const speak = (text,lang = 'en-US') => {
  if (!window.speechSynthesis) return;

  // Cancel any currently playing speech to avoid overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = lang == 'zh-CN' ? 1.2 : 0.85; // Slightly slower for clear enunciation
  utterance.pitch = 1.1; // Slightly higher pitch to sound friendlier

  // Try to select a "Google" voice if available as they tend to be higher quality
  const voices = window.speechSynthesis.getVoices();
  
  
  const preferredVoice = voices.find(v => 
    v.lang === lang && (v.name.includes('Google') || v.name.includes('Female'))
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};