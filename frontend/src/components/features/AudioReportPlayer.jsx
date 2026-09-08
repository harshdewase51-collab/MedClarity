import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Headphones,
  Languages,
} from 'lucide-react';

export default function AudioReportPlayer({ report, language = 'en' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedLang, setSelectedLang] = useState(language);
  const [speechSupported, setSpeechSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Update selected language when parent language changes
  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  const tests = useMemo(() => {
    return Array.isArray(report?.tests) ? report.tests : [];
  }, [report]);

  const abnormalTests = useMemo(() => {
    return tests.filter((t) => {
      const s = (t.status || '').toLowerCase();
      return s === 'high' || s === 'low' || s === 'attention' || s === 'abnormal';
    });
  }, [tests]);

  // Construct narrative speech script in English, Hindi, and Hinglish
  const narrationScript = useMemo(() => {
    const totalCount = tests.length;
    const attnCount = abnormalTests.length;
    const lab = report?.labName || 'Diagnostic Laboratory';

    if (selectedLang === 'hi') {
      let script = `नमस्ते। यह आपकी मेडिकल रिपोर्ट का सरल ऑडियो सारांश है। ${lab} द्वारा किए गए ${totalCount} परीक्षणों का विश्लेषण किया गया है। `;
      if (attnCount === 0) {
        script += `खुशी की बात है कि आपके सभी टेस्ट सामान्य सीमा के भीतर हैं। आपका स्वास्थ्य अच्छा दिख रहा है। `;
      } else {
        script += `आपकी रिपोर्ट में ${attnCount} ऐसे टेस्ट हैं जिन पर ध्यान देने की आवश्यकता है। `;
        abnormalTests.slice(0, 3).forEach((t) => {
          script += `${t.name} का मान ${t.value} ${t.unit || ''} है, जो सामान्य सीमा से ${t.status === 'high' ? 'अधिक' : 'कम'} है। `;
        });
        script += `कृपया इन परिणामों पर अपने डॉक्टर से सलाह अवश्य लें। `;
      }
      script += `यह जानकारी केवल सहायता के लिए है। किसी भी इलाज के लिए हमेशा डॉक्टर से परामर्श करें।`;
      return script;
    }

    if (selectedLang === 'hinglish') {
      let script = `Hello. Ye aapki medical report ka quick audio explanation hai. ${lab} ke ${totalCount} lab tests analyze kiye gaye hain. `;
      if (attnCount === 0) {
        script += `Acchi khabar hai! Aapke sabhi test parameters bilkul normal range me hain. `;
      } else {
        script += `Report me ${attnCount} tests attention require karte hain. `;
        abnormalTests.slice(0, 3).forEach((t) => {
          script += `${t.name} ka result ${t.value} ${t.unit || ''} hai, jo recommended limit se ${t.status === 'high' ? 'high' : 'low'} hai. `;
        });
        script += `Doctor consultation ke dauraan in numbers ko discuss karna recommended hai. `;
      }
      script += `MedClarity ek informational tool hai, treatment decisions ke liye doctor se consult karein.`;
      return script;
    }

    // Default: English
    let script = `Hello. Here is your medical laboratory audio briefing. A total of ${totalCount} biomarkers were evaluated from ${lab}. `;
    if (attnCount === 0) {
      script += `Good news! All evaluated biomarkers are currently within standard healthy limits. Your key physiological systems show reassuring indicators. `;
    } else {
      script += `Clinical analysis identified ${attnCount} biomarker${attnCount > 1 ? 's' : ''} outside standard reference limits. `;
      abnormalTests.slice(0, 3).forEach((t) => {
        script += `Your ${t.name} is ${t.value} ${t.unit || ''}, which is ${t.status}. `;
      });
      script += `We recommend discussing these specific findings with your healthcare provider. `;
    }
    script += `Please remember, MedClarity simplifies laboratory terms but is not a substitute for professional medical diagnosis.`;
    return script;
  }, [report, tests, abnormalTests, selectedLang]);

  // Handle Speech synthesis playback
  const handlePlayPause = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // New playback
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narrationScript);
    utterance.rate = playbackRate;

    // Pick voice if available
    const voices = window.speechSynthesis.getVoices();
    if (selectedLang === 'hi') {
      const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.name.includes('Hindi'));
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const enVoice = voices.find((v) => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural')));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!speechSupported) {
    return null; // Gracefully omit if browser doesn't support Web Speech
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-soft space-y-4 border border-blue-800/60 relative overflow-hidden">
      {/* Decorative subtle background wave circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top bar: Badge & Language selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Bilingual Clinical Voice Narration
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 px-2 py-0.2 rounded-full">
                Zero Latency
              </span>
            </div>
            <p className="text-xs text-blue-200/80">
              Listen to your simplified laboratory summary spoken in your preferred language.
            </p>
          </div>
        </div>

        {/* Audio Language Switcher */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
          <Languages className="w-3.5 h-3.5 text-blue-300 ml-1.5 mr-0.5" />
          <button
            onClick={() => {
              handleStop();
              setSelectedLang('en');
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedLang === 'en' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => {
              handleStop();
              setSelectedLang('hi');
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedLang === 'hi' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => {
              handleStop();
              setSelectedLang('hinglish');
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedLang === 'hinglish' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white'
            }`}
          >
            Hinglish
          </button>
        </div>
      </div>

      {/* Script Preview Box */}
      <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 text-xs text-blue-100/90 leading-relaxed font-normal italic relative z-10">
        "{narrationScript}"
      </div>

      {/* Player Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 relative z-10">
        {/* Play/Pause/Stop Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{isPaused ? 'Resume Audio' : 'Play Narration'}</span>
              </>
            )}
          </button>

          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 text-xs text-blue-200">
          <span className="text-[11px] font-medium">Speed:</span>
          {[0.8, 1.0, 1.25].map((rate) => (
            <button
              key={rate}
              onClick={() => {
                setPlaybackRate(rate);
                if (isPlaying) {
                  handleStop();
                }
              }}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                playbackRate === rate ? 'bg-white/20 text-white' : 'text-blue-300/70 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
