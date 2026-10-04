import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { chatApi } from '../services/chatApi';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am CareNet AI Assistant. I can help answer questions about your heart risk assessments, biometric parameters, symptom diagnostics, and health recommendations.',
      suggestions: [
        'Explain Heart Risk Factors',
        'How does CareNet diagnose symptoms?',
        'Emergency Guidance'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.sender === 'user' || m.sender === 'bot')
        .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

      const res = await chatApi.sendMessage(query, history);

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.reply,
        suggestions: res.suggestions,
        disclaimer: res.disclaimer
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'I encountered an issue connecting to the CareNet AI engine. Please ensure the backend is running and try again.',
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Chat history cleared. How can CareNet AI assist you today?',
        suggestions: [
          'Explain Heart Risk Factors',
          'How does CareNet diagnose symptoms?',
          'Emergency Guidance'
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-btn gold"
        title="CareNet AI Assistant"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '92px',
          zIndex: 9999,
          boxShadow: '0 10px 25px rgba(216, 180, 114, 0.4)'
        }}
      >
        <MessageSquare size={24} />
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '10px',
            height: '10px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            border: '2px solid #08080a'
          }}
        />
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className="glass-card"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '28px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '520px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(216, 180, 114, 0.25)',
            border: '1px solid var(--border-gold)',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(18, 18, 22, 0.95)',
              borderBottom: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dark)'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', margin: 0, fontWeight: 700 }}>CareNet AI Assistant</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--primary-gold-light)' }}>
                  <Sparkles size={12} /> Active AI Diagnostics Engine
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={clearChat}
                className="icon-btn"
                title="Clear Chat"
                style={{ width: '32px', height: '32px' }}
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="icon-btn"
                title="Close Chat"
                style={{ width: '32px', height: '32px' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: 'rgba(8, 8, 10, 0.4)'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    maxWidth: '85%',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: msg.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'var(--primary-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: msg.sender === 'user' ? 'var(--text-main)' : 'var(--text-dark)'
                    }}
                  >
                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'rgba(24, 24, 30, 0.9)',
                      color: msg.sender === 'user' ? 'var(--text-dark)' : 'var(--text-main)',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      border: msg.sender === 'user' ? 'none' : '1px solid var(--border-gold)',
                      fontWeight: msg.sender === 'user' ? 600 : 400
                    }}
                  >
                    {msg.text}
                  </div>
                </div>

                {/* Suggestions Prompt Pills */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '4px',
                      marginLeft: msg.sender === 'user' ? '0' : '38px'
                    }}
                  >
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        style={{
                          background: 'rgba(216, 180, 114, 0.1)',
                          border: '1px solid var(--border-gold)',
                          borderRadius: '12px',
                          padding: '6px 12px',
                          color: 'var(--primary-gold-light)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(216, 180, 114, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(216, 180, 114, 0.1)';
                        }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-gold-light)', fontSize: '0.82rem' }}>
                <Bot size={16} /> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(18, 18, 22, 0.95)',
              borderTop: '1px solid var(--border-gold)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Ask CareNet AI Assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                padding: '10px 14px',
                fontSize: '0.88rem',
                borderRadius: '20px'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="btn btn-primary"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                padding: 0,
                flexShrink: 0,
                opacity: !input.trim() || loading ? 0.5 : 1
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
