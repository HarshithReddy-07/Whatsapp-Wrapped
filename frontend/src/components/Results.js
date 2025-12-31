import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/Results.css';

function Results({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('messages');

  // Prepare chart data
  const messageData = Object.entries(data.messages_per_user).map(([user, count]) => ({
    name: user,
    messages: count
  }));

  const mediaData = Object.entries(data.media_stats).map(([user, count]) => ({
    name: user,
    media: count
  }));

  const mentionsReceivedData = Object.entries(data.mentions.mentions_received).map(([user, count]) => ({
    name: user,
    mentions: count
  }));

  const mentionsGivenData = Object.entries(data.mentions.mentions_given).map(([user, count]) => ({
    name: user,
    mentions: count
  }));

  const colors = ['#25D366', '#128C7E', '#075E54', '#34AF23', '#20C997', '#6C63FF', '#FF6B6B', '#FFD93D'];

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>WhatsApp Wrapped 🎉</h1>
        <button className="reset-btn" onClick={onReset}>← Upload New Chat</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.total_messages}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.total_users}</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(data.media_stats).length}</div>
          <div className="stat-label">Users with Media</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(data.social_media_links).length}</div>
          <div className="stat-label">Users with Links</div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages
        </button>
        <button 
          className={`tab ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          📸 Media
        </button>
        <button 
          className={`tab ${activeTab === 'mentions' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentions')}
        >
          @ Mentions
        </button>
        <button 
          className={`tab ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => setActiveTab('links')}
        >
          🔗 Links
        </button>
      </div>

      <div className="content-area">
        {activeTab === 'messages' && (
          <div className="chart-section">
            <h2>Messages Per User</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#25D366" />
              </BarChart>
            </ResponsiveContainer>

            <div className="ranking">
              <h3>🏆 Message Ranking</h3>
              <ol>
                {messageData.map((item, idx) => (
                  <li key={idx}>
                    <span className="rank-name">{item.name}</span>
                    <span className="rank-value">{item.messages} messages</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="chart-section">
            <h2>Media Messages Per User</h2>
            {mediaData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mediaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="media" fill="#FF6B6B" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="ranking">
                  <h3>📸 Media Ranking</h3>
                  <ol>
                    {mediaData.map((item, idx) => (
                      <li key={idx}>
                        <span className="rank-name">{item.name}</span>
                        <span className="rank-value">{item.media} media</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            ) : (
              <p className="no-data">No media messages found</p>
            )}
          </div>
        )}

        {activeTab === 'mentions' && (
          <div className="chart-section">
            <h2>Mentions Received</h2>
            {mentionsReceivedData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mentionsReceivedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mentions" fill="#6C63FF" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="ranking">
                  <h3>@ Most Mentioned</h3>
                  <ol>
                    {mentionsReceivedData.map((item, idx) => (
                      <li key={idx}>
                        <span className="rank-name">@{item.name}</span>
                        <span className="rank-value">{item.mentions} mentions</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <h2 style={{ marginTop: '40px' }}>Mentions Given</h2>
                {mentionsGivenData.length > 0 && (
                  <div className="ranking">
                    <h3>👤 Most Active Mention Makers</h3>
                    <ol>
                      {mentionsGivenData.map((item, idx) => (
                        <li key={idx}>
                          <span className="rank-name">{item.name}</span>
                          <span className="rank-value">{item.mentions} mentions</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            ) : (
              <p className="no-data">No mentions found</p>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="chart-section">
            <h2>Social Media Links Shared</h2>
            {Object.keys(data.social_media_links).length > 0 ? (
              <div className="links-table">
                {Object.entries(data.social_media_links).map(([user, links]) => (
                  <div key={user} className="user-links">
                    <h3>{user}</h3>
                    <div className="links-list">
                      {Object.entries(links).map(([platform, count]) => (
                        <div key={platform} className="link-item">
                          <span className="platform">{platform}</span>
                          <span className="count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No social media links found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
