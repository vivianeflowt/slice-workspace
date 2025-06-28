import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MarkdownRichEditor: React.FC = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  return (
    <div style={{ border: '1px solid #31343b', borderRadius: 8, background: '#23272e', color: '#fff', padding: 12, minHeight: 120 }}>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Digite seu prompt em markdown..."
        spellCheck={true}
      />
    </div>
  );
};

export default MarkdownRichEditor;
