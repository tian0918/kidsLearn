const getWindowVoives =  () => {
  
  const loadVoices = () => {
    const list = window.speechSynthesis.getVoices();
    return list
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  // console.log(list);
};
export const speak = (text,lang = 'en-US') => {
  if (!window.speechSynthesis) return;

  // Cancel any currently playing speech to avoid overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = lang == 'zh-CN' ? 1.2 : 0.85; // Slightly slower for clear enunciation
  utterance.pitch = 1.1; // Slightly higher pitch to sound friendlier

  // Try to select a "Google" voice if available as they tend to be higher quality
  const voices = getWindowVoives();
  let zh = localStorage.getItem('zhVoices');
  let en = localStorage.getItem('enVoices');
  let cur = lang === 'en-US' ? en : zh;
  const preferredVoice = voices.find(v => 
    v.lang === lang && (v.name.includes(cur) || v.voiceURI.includes(cur))
  );
  console.log(voices);
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};