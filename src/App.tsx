import { useState, useCallback } from 'react';
import { Phone } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Keypad } from './components/Keypad';
import { PhoneDisplay } from './components/PhoneDisplay';
import { CallScreen } from './components/CallScreen';
import { useAudio } from './hooks/useAudio';

const SECRET_NUMBER = "784512";

function App() {
  const [number, setNumber] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'failed'>('idle');
  const { playDTMF, playRingtone, playVoiceClue, playFailureMessage, stopAllAudio, playEndBeep } = useAudio();

  const handleKeyPress = useCallback((key: string) => {
    if (number.length < 15) {
      setNumber(prev => prev + key);
      playDTMF(key);
    }
  }, [number, playDTMF]);

  const handleDelete = useCallback(() => {
    setNumber(prev => prev.slice(0, -1));
  }, []);

  const handleAutoEnd = useCallback(() => {
    // Wait 0.4 seconds after audio ends
    setTimeout(() => {
      setCallStatus('idle');
      playEndBeep();
      stopAllAudio();
    }, 400);
  }, [playEndBeep, stopAllAudio]);

  const startCall = () => {
    if (!number) return;
    
    setCallStatus('calling');
    playRingtone();

    // Simulate connection delay
    setTimeout(() => {
      if (number === SECRET_NUMBER) {
        setCallStatus('connected');
        playVoiceClue(handleAutoEnd);
      } else {
        setCallStatus('failed');
        // Custom failure MP3
        playFailureMessage(handleAutoEnd);
      }
    }, 3000);
  };

  const endCall = () => {
    setCallStatus('idle');
    stopAllAudio();
  };

  return (
    <div className="phone-container">
      <AnimatePresence>
        {callStatus !== 'idle' && (
          <CallScreen 
            number={number} 
            status={callStatus === 'connected' ? 'connected' : 'calling'} 
            onEndCall={endCall} 
          />
        )}
      </AnimatePresence>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PhoneDisplay number={number} onDelete={handleDelete} />
        
        <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
          <Keypad onKeyPress={handleKeyPress} />
          
          <div className="call-button-container">
            <button className="call-button" onClick={startCall}>
              <Phone size={32} fill="white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Home Bar */}
      <div style={{ 
        width: '120px', 
        height: '5px', 
        background: 'rgba(255,255,255,0.2)', 
        borderRadius: '10px',
        margin: '20px auto 0'
      }} />
    </div>
  );
}

export default App;
