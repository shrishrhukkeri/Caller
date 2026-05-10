import React, { useEffect, useState } from 'react';
import { PhoneOff, Mic, Video, Volume2, Plus, User, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallScreenProps {
  number: string;
  status: 'calling' | 'connected' | 'ended';
  onEndCall: () => void;
}

export const CallScreen: React.FC<CallScreenProps> = ({ number, status, onEndCall }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status === 'connected') {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="glass-panel"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 20px',
        backgroundColor: 'rgba(0,0,0,0.9)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: '#333', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <User size={60} color="#666" />
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: '400', marginBottom: '8px' }}>
            {status === 'connected' ? 'Unknown' : number}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
          {status === 'connected' ? formatTime(timer) : 'calling...'}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '30px',
        marginBottom: 'auto',
        width: '100%',
        maxWidth: '280px'
      }}>
        {[
          { icon: Mic, label: 'mute' },
          { icon: GripVertical, label: 'keypad' },
          { icon: Volume2, label: 'speaker' },
          { icon: Plus, label: 'add call' },
          { icon: Video, label: 'FaceTime' },
          { icon: User, label: 'contacts' },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <item.icon size={24} />
            </div>
            <span style={{ fontSize: '12px', opacity: 0.6 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onEndCall}
        className="call-button end-call-button"
      >
        <PhoneOff size={32} />
      </button>
    </motion.div>
  );
};
