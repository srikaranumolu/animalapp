'use client';

import { useState } from 'react';
import styles from '../components/Components.module.css';

export default function Social() {
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedChat, setSelectedChat] = useState(null);
  
  // Sample data
  const friends = [
    { id: 1, name: 'JungleExplorer', status: 'online', avatar: '/user-avatar.svg', lastSeen: 'Now' },
    { id: 2, name: 'AnimalLover', status: 'offline', avatar: '/user-avatar.svg', lastSeen: '2 hours ago' },
    { id: 3, name: 'WildlifeWanderer', status: 'online', avatar: '/user-avatar.svg', lastSeen: 'Now' },
    { id: 4, name: 'SafariKid', status: 'away', avatar: '/user-avatar.svg', lastSeen: '30 minutes ago' },
    { id: 5, name: 'FoxFan', status: 'online', avatar: '/user-avatar.svg', lastSeen: 'Now' },
  ];
  
  const friendRequests = [
    { id: 101, name: 'TigerTracker', avatar: '/user-avatar.svg', mutualFriends: 3 },
    { id: 102, name: 'PenguinPal', avatar: '/user-avatar.svg', mutualFriends: 1 },
  ];
  
  const messages = {
    1: [
      { id: 1, sender: 'JungleExplorer', content: 'Hey! Have you seen the new giraffe quiz?', time: '10:30 AM', isOwn: false },
      { id: 2, sender: 'me', content: 'Not yet! Is it difficult?', time: '10:32 AM', isOwn: true },
      { id: 3, sender: 'JungleExplorer', content: 'Medium difficulty but very fun!', time: '10:33 AM', isOwn: false },
    ],
    3: [
      { id: 1, sender: 'WildlifeWanderer', content: 'Did you collect the new rare frog?', time: '9:45 AM', isOwn: false },
      { id: 2, sender: 'me', content: 'Yes! It was hard to find.', time: '9:50 AM', isOwn: true },
    ],
  };
  
  const handleChatSelect = (friendId) => {
    setSelectedChat(friendId);
    setActiveTab('chat');
  };
  
  const renderFriendsList = () => (
    <div className={styles.friendsListContainer}>
      <div className={styles.friendsHeader}>
        <h2>My Friends ({friends.length})</h2>
        <button className={styles.addFriendButton}>
          <span>+</span> Add Friend
        </button>
      </div>
      
      {friendRequests.length > 0 && (
        <div className={styles.friendRequests}>
          <h3>Friend Requests ({friendRequests.length})</h3>
          <div className={styles.requestsList}>
            {friendRequests.map(request => (
              <div key={request.id} className={styles.requestCard}>
                <div className={styles.requestAvatar}>
                  <img src={request.avatar} alt={request.name} width={50} height={50} />
                </div>
                <div className={styles.requestInfo}>
                  <div className={styles.requestName}>{request.name}</div>
                  <div className={styles.mutualFriends}>{request.mutualFriends} mutual friends</div>
                </div>
                <div className={styles.requestActions}>
                  <button className={styles.acceptButton}>Accept</button>
                  <button className={styles.declineButton}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.friendsSearchBox}>
        <input 
          type="text" 
          placeholder="Search friends..."
          className={styles.friendsSearch}
        />
      </div>
      
      <div className={styles.friendsList}>
        {friends.map(friend => (
          <div key={friend.id} className={styles.friendCard} onClick={() => handleChatSelect(friend.id)}>
            <div className={`${styles.friendAvatar} ${styles[friend.status]}`}>
              <img src={friend.avatar} alt={friend.name} width={50} height={50} />
            </div>
            <div className={styles.friendInfo}>
              <div className={styles.friendName}>{friend.name}</div>
              <div className={styles.friendStatus}>
                {friend.status === 'online' ? 'Online' : 
                 friend.status === 'away' ? 'Away' : 
                 `Last seen ${friend.lastSeen}`}
              </div>
            </div>
            <div className={styles.friendActions}>
              <button className={styles.chatButton}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderChatInterface = () => {
    const friend = friends.find(f => f.id === selectedChat);
    const chatMessages = messages[selectedChat] || [];
    
    return (
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <button className={styles.backButton} onClick={() => setActiveTab('friends')}>
            ← Back to Friends
          </button>
          <div className={styles.chatUserInfo}>
            <div className={`${styles.chatAvatar} ${styles[friend.status]}`}>
              <img src={friend.avatar} alt={friend.name} width={40} height={40} />
            </div>
            <div className={styles.chatUserName}>{friend.name}</div>
          </div>
        </div>
        
        <div className={styles.messagesContainer}>
          {chatMessages.length === 0 ? (
            <div className={styles.noMessages}>
              <div className={styles.noMessagesIcon}>💬</div>
              <h3>No messages yet</h3>
              <p>Start the conversation with {friend.name}!</p>
            </div>
          ) : (
            chatMessages.map(message => (
              <div 
                key={message.id} 
                className={`${styles.messageItem} ${message.isOwn ? styles.ownMessage : styles.friendMessage}`}
              >
                {!message.isOwn && (
                  <div className={styles.messageAvatar}>
                    <img src={friend.avatar} alt={friend.name} width={32} height={32} />
                  </div>
                )}
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{message.content}</div>
                  <div className={styles.messageTime}>{message.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className={styles.messageInputContainer}>
          <input 
            type="text" 
            placeholder="Type a message..."
            className={styles.messageInput}
          />
          <button className={styles.sendButton}>Send</button>
        </div>
      </div>
    );
  };
  
  return (
    <div className={styles.socialContainer}>
      <div className={styles.socialTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'friends' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'chat' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('chat')}
          disabled={!selectedChat}
        >
          Chat
        </button>
      </div>
      
      {activeTab === 'friends' ? renderFriendsList() : renderChatInterface()}
    </div>
  );
} 