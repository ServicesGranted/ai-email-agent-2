import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthContext } from './AuthContext';

const App = () => {
  const { token } = React.useContext(AuthContext);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [context, setContext] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setResponse('Please log in to continue.');
      return;
    }

    try {
      const responseData = await fetch('http://localhost:3001/api/prompt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, context })
      });
      const data = await responseData.json();
      setResponse(data.result || 'Error processing request.');
    } catch (error) {
      setResponse('Network error. Please ensure the server is running.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Email Assistant</div>
      <div className="chat-messages">
        <div className="message user-message">You: {prompt || 'Type a command...'}</div>
        <div className="message bot-message">Bot: {response}</div>
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter command (e.g., 'create reminder to clean my room', 'move emails from Kevin to Friends')"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;