"use client";
import { useState, useEffect } from 'react';
import styles from './VoiceStatus.module.css';

const VoiceStatus = ({ isListening, lastCommand, commandFound }) => {
  const [micPermission, setMicPermission] = useState('unknown');

  useEffect(() => {
    // Check microphone permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' })
        .then(permission => {
          setMicPermission(permission.state);
          permission.onchange = () => setMicPermission(permission.state);
        })
        .catch(() => setMicPermission('unknown'));
    }
  }, []);

  const getStatusColor = () => {
    if (!isListening) return '#888888';
    if (lastCommand && commandFound) return '#7bff10';
    if (lastCommand && !commandFound) return '#ff6b6b';
    return '#0098ff';
  };

  const getStatusText = () => {
    if (micPermission === 'denied') return 'Microphone access denied';
    if (!isListening) return 'Voice recognition inactive';
    if (lastCommand && commandFound) return 'Command executed successfully';
    if (lastCommand && !commandFound) return 'Command not recognized';
    return 'Listening for commands...';
  };

  const getStatusIcon = () => {
    if (micPermission === 'denied') return '🚫';
    if (!isListening) return '🎤';
    if (lastCommand && commandFound) return '✅';
    if (lastCommand && !commandFound) return '❌';
    return '🔊';
  };

  return (
    <div className={styles.voiceStatus}>
      <div className={styles.statusIndicator}>
        <div 
          className={styles.statusDot}
          style={{ backgroundColor: getStatusColor() }}
        >
          {isListening && (
            <div className={styles.pulse} style={{ borderColor: getStatusColor() }} />
          )}
        </div>
        <span className={styles.statusIcon}>{getStatusIcon()}</span>
      </div>
      
      <div className={styles.statusText}>
        <div className={styles.statusMain}>{getStatusText()}</div>
        {lastCommand && (
          <div className={styles.lastCommand}>
            Last: &quot;{lastCommand}&quot;
          </div>
        )}
      </div>

      {micPermission === 'denied' && (
        <div className={styles.permissionHelp}>
          <small>Enable microphone access in browser settings</small>
        </div>
      )}
    </div>
  );
};

export default VoiceStatus;