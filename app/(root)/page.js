"use client";
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useLogger } from '../context/LoggerContext';
import { useOutput } from '../context/OutputContext';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import handleCommand from '../hooks/commandHandler';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

function Home() {
  const [code, setCode] = useState('');
  const [editor, setEditor] = useState(null);
  const { terminalLogs, addLog } = useLogger(); 
  const { output, addOutput } = useOutput();

  const handleSpeechResult = (transcript) => {
    if (editor) {
      let commandfound = handleCommand(transcript, setCode, editor, addOutput);
      if(commandfound){
        addLog(`Command received: ${transcript}`); 
      }
      else{
        addLog(`Command not found`);

      }
  
    } else {
      console.log('Editor is not initialized yet');
    }
  };



  const { error } = useSpeechRecognition(handleSpeechResult);

  useEffect(() => {
    import('monaco-editor').then(monaco => {
      monaco.editor.setTheme('vs-dark');
    });
  }, []);

  const handleEditorDidMount = (editorInstance) => {
    console.log('Editor instance:', editorInstance);
    setEditor(editorInstance);
  };


  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>VCIDE</h2>
        <ul>
          <li>File1.js</li>
          <li>File2.js</li>
        </ul>
      </div>
      <div className={styles.main}>
        <div className={styles.codeEditor}>
          <h2>Code Editor</h2>
          <MonacoEditor
            height="100%"
            language="javascript"
            value={code}
            onChange={(value) => setCode(value)}
            onMount={handleEditorDidMount}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              theme: 'vs-dark',
              minimap: {
                enabled: true,
              },
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
              },
              language: 'javascript',
            }}
          />
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.terminal}>
            <h2>Terminal (Logger)</h2>
            <div className={styles.output}>
              {terminalLogs.map((log, index) => (
                <p key={index}>{log}</p>  
              ))}
            </div>
          </div>
          <div className={styles.outputWindow}>
            <h2>Output</h2>
            <div className={styles.output}>
              {output && <p>{output}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
