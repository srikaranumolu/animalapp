'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Components.module.css';

// Sample data
const friends = [
  {
    id: 1,
    name: 'Emma Thompson',
    username: 'emma_explorer',
    avatar: '/avatars/avatar1.jpg',
    level: 5,
    online: true,
    lastActive: new Date(),
    animalCount: 24,
    badges: ['Animal Expert', 'Quiz Champion']
  },
  {
    id: 2,
    name: 'Michael Chen',
    username: 'wild_mike',
    avatar: '/avatars/avatar2.jpg',
    level: 7,
    online: true,
    lastActive: new Date(),
    animalCount: 32,
    badges: ['Bird Watcher', 'Safari Pro']
  },
  {
    id: 3,
    name: 'Sophie Rodriguez',
    username: 'safari_sophie',
    avatar: '/avatars/avatar3.jpg',
    level: 4,
    online: false,
    lastActive: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    animalCount: 18,
    badges: ['Jungle Explorer']
  },
  {
    id: 4,
    name: 'David Wilson',
    username: 'dave_wild',
    avatar: '/avatars/avatar4.jpg',
    level: 6,
    online: false,
    lastActive: new Date(Date.now() - 86400000), // 1 day ago
    animalCount: 28,
    badges: ['Marine Life Expert', 'Conservation Hero']
  },
  {
    id: 5,
    name: 'Aisha Patel',
    username: 'aisha_animals',
    avatar: '/avatars/avatar5.jpg',
    level: 8,
    online: true,
    lastActive: new Date(),
    animalCount: 40,
    badges: ['Quiz Master', 'Rare Animal Finder']
  }
];

const friendRequests = [
  {
    id: 101,
    name: 'Lucas Kim',
    username: 'lucas_wildlife',
    avatar: '/avatars/avatar6.jpg',
    level: 3,
    animalCount: 15,
    requestDate: new Date(Date.now() - 86400000 * 2) // 2 days ago
  },
  {
    id: 102,
    name: 'Olivia Garcia',
    username: 'olivia_outback',
    avatar: '/avatars/avatar7.jpg',
    level: 5,
    animalCount: 22,
    requestDate: new Date(Date.now() - 3600000 * 5) // 5 hours ago
  }
];

const conversations = [
  {
    id: 1,
    name: 'Emma Thompson',
    avatar: '/avatars/avatar1.jpg',
    isGroup: false,
    lastMessage: {
      text: 'Did you see that new elephant in your collection?',
      time: new Date(Date.now() - 1800000), // 30 minutes ago
      read: true
    },
    unreadCount: 0
  },
  {
    id: 2,
    name: 'Safari Squad',
    avatar: '/groups/group1.jpg',
    isGroup: true,
    participants: ['You', 'Emma Thompson', 'Michael Chen', 'Sophie Rodriguez'],
    lastMessage: {
      text: 'Michael: Who wants to join the jungle quiz tomorrow?',
      time: new Date(Date.now() - 3600000), // 1 hour ago
      read: false
    },
    unreadCount: 3
  },
  {
    id: 3,
    name: 'Aisha Patel',
    avatar: '/avatars/avatar5.jpg',
    isGroup: false,
    lastMessage: {
      text: 'Thanks for the tip about the rare frog!',
      time: new Date(Date.now() - 86400000), // 1 day ago
      read: true
    },
    unreadCount: 0
  },
  {
    id: 4,
    name: 'Marine Enthusiasts',
    avatar: '/groups/group2.jpg',
    isGroup: true,
    participants: ['You', 'David Wilson', 'Aisha Patel', '5 others'],
    lastMessage: {
      text: 'David: Check out this amazing whale shark photo!',
      time: new Date(Date.now() - 172800000), // 2 days ago
      read: true
    },
    unreadCount: 0
  }
];

// Sample messages for a selected conversation
const sampleMessages = [
  {
    id: 1,
    senderId: 1,
    senderName: 'Emma Thompson',
    senderAvatar: '/avatars/avatar1.jpg',
    text: 'Hey! Have you been exploring the new savanna region? 🦁',
    time: new Date(Date.now() - 3600000 * 2) // 2 hours ago
  },
  {
    id: 2,
    senderId: 'me',
    senderName: 'You',
    text: 'Not yet! I\'m still completing the jungle quizzes. Any cool finds?',
    time: new Date(Date.now() - 3600000 * 1.5) // 1.5 hours ago
  },
  {
    id: 3,
    senderId: 1,
    senderName: 'Emma Thompson',
    senderAvatar: '/avatars/avatar1.jpg',
    text: 'I discovered 3 new animals! Including a rare rhino 🦏',
    time: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: 4,
    senderId: 1,
    senderName: 'Emma Thompson',
    senderAvatar: '/avatars/avatar1.jpg',
    text: 'Did you see that new elephant in your collection?',
    time: new Date(Date.now() - 1800000) // 30 minutes ago
  }
];

export default function Social() {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    // In a real app, this would send the message to the API
    console.log(`Sending message to ${selectedConversation.name}: ${messageText}`);
    
    // Clear the input
    setMessageText('');
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setActiveTab('messages');
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleNewGroup = () => {
    setShowNewGroupModal(true);
  };

  return (
    <div className={styles.socialContainer}>
      <header className={styles.socialHeader}>
        <h1>Friends & Chats</h1>
        <p>Connect with fellow animal explorers</p>
      </header>
      
      <div className={styles.socialTabs}>
        <button 
          className={`${styles.socialTab} ${activeTab === 'friends' ? styles.active : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <span className={styles.tabIcon}>👥</span>
          My Friends
        </button>
        <button 
          className={`${styles.socialTab} ${activeTab === 'messages' ? styles.active : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <span className={styles.tabIcon}>💬</span>
          Messages
          {conversations.reduce((count, convo) => count + convo.unreadCount, 0) > 0 && (
            <span className={styles.unreadBadge}>
              {conversations.reduce((count, convo) => count + convo.unreadCount, 0)}
            </span>
          )}
        </button>
        <button 
          className={`${styles.socialTab} ${activeTab === 'requests' ? styles.active : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <span className={styles.tabIcon}>🔔</span>
          Requests
          {friendRequests.length > 0 && (
            <span className={styles.requestBadge}>{friendRequests.length}</span>
          )}
        </button>
      </div>

      <div className={styles.socialContent}>
        {/* Search Bar for all tabs */}
        <div className={styles.socialSearch}>
          <input
            type="text"
            placeholder={`Search ${activeTab === 'friends' ? 'friends' : activeTab === 'messages' ? 'conversations' : 'requests'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
          
          {activeTab === 'messages' && (
            <div className={styles.chatActions}>
              <button 
                className={styles.newChatButton}
                onClick={handleNewChat}
              >
                <span className={styles.buttonIcon}>✉️</span>
                New Chat
              </button>
              <button 
                className={styles.newGroupButton}
                onClick={handleNewGroup}
              >
                <span className={styles.buttonIcon}>👥</span>
                New Group
              </button>
            </div>
          )}
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className={styles.friendsContainer}>
            {filteredFriends.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3>No friends found</h3>
                <p>Try a different search term</p>
              </div>
            ) : (
              <div className={styles.friendsList}>
                {filteredFriends.map(friend => (
                  <div 
                    key={friend.id} 
                    className={styles.friendCard}
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <div className={styles.friendAvatar}>
                      <div className={styles.avatarWrapper}>
                        <div 
                          className={styles.avatarImage}
                          style={{ backgroundImage: `url(${friend.avatar})` }}
                        ></div>
                        <div className={`${styles.onlineStatus} ${friend.online ? styles.online : styles.offline}`}></div>
                      </div>
                      <div className={styles.friendLevel}>Lv. {friend.level}</div>
                    </div>
                    
                    <div className={styles.friendInfo}>
                      <h3 className={styles.friendName}>{friend.name}</h3>
                      <p className={styles.friendUsername}>@{friend.username}</p>
                      <div className={styles.friendStats}>
                        <span className={styles.animalStat}>
                          <span className={styles.statIcon}>🦁</span>
                          {friend.animalCount} animals
                        </span>
                        <span className={styles.lastActive}>
                          {friend.online 
                            ? 'Online now' 
                            : `Last seen ${formatTimeAgo(friend.lastActive)}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.friendActions}>
                      <button className={styles.messageButton}>
                        <span className={styles.actionIcon}>✉️</span>
                        Message
                      </button>
                      <button className={styles.viewButton}>
                        <span className={styles.actionIcon}>👁️</span>
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className={styles.findFriendsSection}>
              <div className={styles.sectionHeader}>
                <h3>Find New Friends</h3>
              </div>
              
              <div className={styles.findFriendsCard}>
                <div className={styles.cardIcon}>🔍</div>
                <div className={styles.cardContent}>
                  <h4>Discover fellow explorers</h4>
                  <p>Find friends with similar animal interests</p>
                  <button className={styles.discoveryButton}>
                    Explore Connections
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className={styles.messagesContainer}>
            {selectedConversation ? (
              <div className={styles.chatInterface}>
                {/* Conversation Header */}
                <div className={styles.conversationHeader}>
                  <div className={styles.conversationInfo}>
                    <button 
                      className={styles.backButton}
                      onClick={() => setSelectedConversation(null)}
                    >
                      &larr;
                    </button>
                    <div 
                      className={styles.conversationAvatar}
                      style={{ backgroundImage: `url(${selectedConversation.avatar})` }}
                    ></div>
                    <div className={styles.conversationDetails}>
                      <h3>{selectedConversation.name}</h3>
                      {selectedConversation.isGroup && (
                        <p>{selectedConversation.participants.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className={styles.conversationActions}>
                    <button className={styles.infoButton}>
                      <span className={styles.actionIcon}>ℹ️</span>
                    </button>
                  </div>
                </div>
                
                {/* Messages Display */}
                <div className={styles.messagesDisplay}>
                  <div className={styles.messageDate}>
                    <span>Today</span>
                  </div>
                  
                  {sampleMessages.map(message => (
                    <div 
                      key={message.id} 
                      className={`${styles.messageItem} ${message.senderId === 'me' ? styles.sentMessage : styles.receivedMessage}`}
                    >
                      {message.senderId !== 'me' && (
                        <div 
                          className={styles.messageSenderAvatar}
                          style={{ backgroundImage: `url(${message.senderAvatar})` }}
                        ></div>
                      )}
                      
                      <div className={styles.messageContent}>
                        {message.senderId !== 'me' && selectedConversation.isGroup && (
                          <div className={styles.messageSender}>{message.senderName}</div>
                        )}
                        <div className={styles.messageText}>{message.text}</div>
                        <div className={styles.messageTime}>
                          {formatTime(message.time)}
                          {message.senderId === 'me' && (
                            <span className={styles.messageStatus}>✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className={styles.messageInputContainer}>
                  <button className={styles.emojiButton}>
                    <span>😊</span>
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className={styles.messageInput}
                  />
                  <button 
                    className={styles.sendButton}
                    onClick={handleSendMessage}
                    disabled={messageText.trim() === ''}
                  >
                    <span>📤</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {filteredConversations.length === 0 ? (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>💬</div>
                    <h3>No conversations found</h3>
                    <p>Start a new chat or try a different search</p>
                  </div>
                ) : (
                  <div className={styles.conversationsList}>
                    {filteredConversations.map(conversation => (
                      <div 
                        key={conversation.id} 
                        className={`${styles.conversationItem} ${conversation.unreadCount > 0 ? styles.unread : ''}`}
                        onClick={() => handleConversationSelect(conversation)}
                      >
                        <div className={styles.conversationAvatar}>
                          <div 
                            className={styles.avatarImage}
                            style={{ backgroundImage: `url(${conversation.avatar})` }}
                          ></div>
                          {conversation.isGroup && (
                            <div className={styles.groupIndicator}>
                              <span>👥</span>
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.conversationInfo}>
                          <div className={styles.conversationHeader}>
                            <h3 className={styles.conversationName}>{conversation.name}</h3>
                            <span className={styles.messageTime}>
                              {formatTimeAgo(conversation.lastMessage.time)}
                            </span>
                          </div>
                          
                          <p className={styles.lastMessageText}>
                            {conversation.lastMessage.text}
                          </p>
                        </div>
                        
                        {conversation.unreadCount > 0 && (
                          <div className={styles.unreadBubble}>
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Friend Requests Tab */}
        {activeTab === 'requests' && (
          <div className={styles.requestsContainer}>
            <h3 className={styles.requestsTitle}>Friend Requests</h3>
            
            {friendRequests.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔔</div>
                <h3>No pending requests</h3>
                <p>When someone wants to be your friend, you'll see them here</p>
              </div>
            ) : (
              <div className={styles.requestsList}>
                {friendRequests.map(request => (
                  <div key={request.id} className={styles.requestCard}>
                    <div className={styles.requestProfile}>
                      <div 
                        className={styles.requestAvatar}
                        style={{ backgroundImage: `url(${request.avatar})` }}
                      ></div>
                      
                      <div className={styles.requestInfo}>
                        <h3 className={styles.requestName}>{request.name}</h3>
                        <p className={styles.requestUsername}>@{request.username}</p>
                        <div className={styles.requestStats}>
                          <span className={styles.levelStat}>
                            <span className={styles.statIcon}>⭐</span>
                            Level {request.level}
                          </span>
                          <span className={styles.animalStat}>
                            <span className={styles.statIcon}>🦁</span>
                            {request.animalCount} animals
                          </span>
                        </div>
                        <p className={styles.requestTime}>
                          Requested {formatTimeAgo(request.requestDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className={styles.requestActions}>
                      <button className={styles.acceptButton}>
                        Accept
                      </button>
                      <button className={styles.declineButton}>
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className={styles.sentRequestsSection}>
              <h3 className={styles.sectionTitle}>Sent Requests</h3>
              
              <div className={styles.sentRequestCard}>
                <div className={styles.cardIcon}>📤</div>
                <div className={styles.cardContent}>
                  <h4>No pending sent requests</h4>
                  <p>When you send friend requests, they'll appear here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className={styles.modalOverlay} onClick={() => setShowNewChatModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>New Message</h2>
              <button className={styles.closeButton} onClick={() => setShowNewChatModal(false)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search friends..."
                  className={styles.modalSearchInput}
                />
              </div>
              
              <div className={styles.modalFriendsList}>
                {friends.map(friend => (
                  <div key={friend.id} className={styles.modalFriendItem}>
                    <div 
                      className={styles.modalFriendAvatar}
                      style={{ backgroundImage: `url(${friend.avatar})` }}
                    ></div>
                    <div className={styles.modalFriendInfo}>
                      <h4>{friend.name}</h4>
                      <p>@{friend.username}</p>
                    </div>
                    <button className={styles.startChatButton}>
                      Chat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className={styles.modalOverlay} onClick={() => setShowNewGroupModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create Group Chat</h2>
              <button className={styles.closeButton} onClick={() => setShowNewGroupModal(false)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.groupFormField}>
                <label>Group Name</label>
                <input
                  type="text"
                  placeholder="Enter group name..."
                  className={styles.groupNameInput}
                />
              </div>
              
              <div className={styles.selectFriendsContainer}>
                <h4>Select Friends</h4>
                
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search friends..."
                    className={styles.modalSearchInput}
                  />
                </div>
                
                <div className={styles.friendSelection}>
                  {friends.map(friend => (
                    <div key={friend.id} className={styles.selectableFriend}>
                      <input
                        type="checkbox"
                        id={`friend-${friend.id}`}
                        className={styles.friendCheckbox}
                      />
                      <label htmlFor={`friend-${friend.id}`} className={styles.friendSelectLabel}>
                        <div 
                          className={styles.selectableFriendAvatar}
                          style={{ backgroundImage: `url(${friend.avatar})` }}
                        ></div>
                        <span>{friend.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowNewGroupModal(false)}
                >
                  Cancel
                </button>
                <button className={styles.createGroupButton}>
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatTimeAgo(time) {
  const now = new Date();
  const diff = now - new Date(time);
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(time).toLocaleDateString();
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
} 