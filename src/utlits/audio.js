let voices = []
const getWindowVoives =  () => {
  
  const loadVoices = () => {
    voices = window.speechSynthesis.getVoices();
    if(voices.length > 0) {
      console.log("----",voices.filter(item => item.lang == 'en-US').find(item => item.name.includes('Google')));
      
      let zh = voices.filter(item => item.lang == 'zh-CN')[0].voiceURI;
      let en = voices.filter(item => item.lang == 'en-US').find(item => item.name.includes('Google')).voiceURI;
      localStorage.setItem('zhVoices',zh)
      localStorage.setItem('enVoices',en)
    }
    
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  // console.log(list);
};

export const speak = (text,lang = 'en-US') => {
  // getWindowVoives()
  if (!window.speechSynthesis) return;

  // Cancel any currently playing speech to avoid overlap
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = lang == 'zh-CN' ? 1.0 : 0.5; // Slightly slower for clear enunciation
  utterance.pitch = 1.0; // Slightly higher pitch to sound friendlier

  // Try to select a "Google" voice if available as they tend to be higher quality

  let zh = localStorage.getItem('zhVoices');
  let en = localStorage.getItem('enVoices');
  let cur = lang === 'en-US' ? en : zh;
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang === lang && (v.name == cur)
  );
  console.log(preferredVoice);
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};