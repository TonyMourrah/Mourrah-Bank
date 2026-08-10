import { useEffect, useState, useRef } from 'react';
import { subscribe } from '../api/loadingBus';

export default function ServerWakingOverlay() {
  const [show, setShow] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const showTimerRef = useRef(null);
  const tickRef = useRef(null);
  const maxTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribe((pendingCount) => {
      if (pendingCount > 0) {
        showTimerRef.current = setTimeout(() => {
          setShow(true);
          setSeconds(2);
          tickRef.current = setInterval(() => {
            setSeconds((s) => s + 1);
          }, 1000);

          maxTimeoutRef.current = setTimeout(() => {
            setShow(false);
            clearInterval(tickRef.current);
          }, 150000);
        }, 2000);
      } else {
        clearTimeout(showTimerRef.current);
        clearInterval(tickRef.current);
        clearTimeout(maxTimeoutRef.current);
        setShow(false);
        setSeconds(0);
      }
    });
    return () => {
      unsubscribe();
      clearTimeout(showTimerRef.current);
      clearInterval(tickRef.current);
      clearTimeout(maxTimeoutRef.current);
    };
  }, []);

  const getMessage = () => {
    if (seconds < 20) return "Réveil du serveur en cours...";
    if (seconds < 60) return "Toujours en train de démarrer, encore un instant...";
    return "Ça prend plus de temps que prévu, mais ça arrive — le serveur gratuit met parfois jusqu'à 2 minutes à se réveiller.";
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 d-flex align-items-center justify-content-center gap-2 py-2"
      style={{
        backgroundColor: '#0a2540',
        color: 'white',
        zIndex: 2000,
        fontSize: '0.9rem',
        display: show ? 'flex' : 'none',
      }}
    >
      <span className="spinner-border spinner-border-sm"></span>
      {getMessage()}
    </div>
  );
}