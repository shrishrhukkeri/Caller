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

    setTimeout(() => {
      if (number === SECRET_NUMBER) {
        setCallStatus('connected');
        playVoiceClue(handleAutoEnd);
      } else {
        setCallStatus('failed');
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

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        paddingBottom: '40px' // Shift the "center" slightly upwards
      }}>
        <PhoneDisplay number={number} onDelete={handleDelete} />
        
        <div style={{ width: '100%', maxWidth: '320px' }}>
          <Keypad onKeyPress={handleKeyPress} />
          
          <div className="call-button-container">
            <button className="call-button" onClick={startCall}>
              <Phone size={32} fill="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
