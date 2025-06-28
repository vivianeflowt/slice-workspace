import React, { useState, useRef } from 'react';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription }) => {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const [alreadySent, setAlreadySent] = useState(false);
  const recordingRef = useRef(false);
  const allTranscriptsRef = useRef<string[]>([]);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API não suportada neste navegador.');
      return;
    }
    transcriptRef.current = '';
    allTranscriptsRef.current = [];
    setAlreadySent(false);
    recordingRef.current = true;
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = true;
    console.log('[VoiceRecorder] Iniciando gravação...');
    recognition.onstart = () => {
      console.log('[VoiceRecorder] Reconhecimento iniciado');
    };
    recognition.onaudiostart = () => {
      console.log('[VoiceRecorder] Áudio capturado');
    };
    recognition.onspeechstart = () => {
      console.log('[VoiceRecorder] Fala detectada');
    };
    recognition.onspeechend = () => {
      console.log('[VoiceRecorder] Fim da fala');
    };
    recognition.onresult = (event: any) => {
      let fullText = '';
      for (let i = 0; i < event.results.length; i++) {
        fullText += event.results[i][0].transcript + ' ';
      }
      transcriptRef.current = fullText.trim();
      allTranscriptsRef.current.push(transcriptRef.current);
      console.log('[VoiceRecorder] onresult:', transcriptRef.current, event);
    };
    recognition.onerror = (event: any) => {
      console.error('[VoiceRecorder] Erro:', event);
    };
    recognition.onend = () => {
      console.log(
        '[VoiceRecorder] onend. recordingRef.current:',
        recordingRef.current,
        'transcript:',
        transcriptRef.current,
      );
      if (recordingRef.current) {
        recognition.start();
      } else {
        setRecording(false);
        const finalText = allTranscriptsRef.current.join(' ').replace(/\s+/g, ' ').trim();
        if (finalText) {
          console.log('[VoiceRecorder] Enviando transcrição final acumulada:', finalText);
          onTranscription(finalText);
        } else {
          onTranscription('');
          console.log('[VoiceRecorder] Nada para transcrever, callback disparado com vazio');
        }
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
    recordingRef.current = false;
    recognitionRef.current?.stop();
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`btn ${recording ? 'btn-danger animate-pulse' : 'btn-success'}`}
      style={{ fontWeight: 'bold', fontSize: 20, minWidth: 140, minHeight: 48, marginBottom: 8 }}
    >
      {recording ? 'PARAR' : 'GRAVAR'}
    </button>
  );
};

export default VoiceRecorder;
