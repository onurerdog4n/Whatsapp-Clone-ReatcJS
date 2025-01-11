import React, { useState } from 'react';
import { MessageSquare, MoreVertical, Phone, Search, Video, Send, Smile, Paperclip, ArrowLeft, X } from 'lucide-react';

type Message = {
  id: number;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
};

type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  messages: Message[];
};

function App() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [isSearchingMessages, setIsSearchingMessages] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "John Doe",
      lastMessage: "See you tomorrow!",
      time: "10:30 AM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      messages: [
        { id: 1, content: "Hey John, how are you?", sender: "me", timestamp: "10:00 AM" },
        { id: 2, content: "I'm good, thanks! How about you?", sender: "other", timestamp: "10:05 AM" },
        { id: 3, content: "Great! Are we meeting tomorrow?", sender: "me", timestamp: "10:15 AM" },
        { id: 4, content: "Yes, at the usual place", sender: "other", timestamp: "10:20 AM" },
        { id: 5, content: "See you tomorrow!", sender: "other", timestamp: "10:30 AM" }
      ]
    },
    {
      id: 2,
      name: "Alice Smith",
      lastMessage: "How are you?",
      time: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      messages: [
        { id: 1, content: "Hi Alice!", sender: "me", timestamp: "Yesterday" },
        { id: 2, content: "How are you?", sender: "other", timestamp: "Yesterday" }
      ]
    },
    {
      id: 3,
      name: "Bob Johnson",
      lastMessage: "Great idea!",
      time: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      messages: [
        { id: 1, content: "What do you think about the project?", sender: "me", timestamp: "Yesterday" },
        { id: 2, content: "Great idea!", sender: "other", timestamp: "Yesterday" }
      ]
    }
  ]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now(),
        content: messageInput.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === selectedChat) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: messageInput.trim(),
            time: 'Just now'
          };
        }
        return chat;
      }));

      setMessageInput('');
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showChatList = !isMobileView || (isMobileView && !selectedChat);
  const showChatArea = !isMobileView || (isMobileView && selectedChat);
  const currentChat = chats.find(chat => chat.id === selectedChat);

  const filteredMessages = currentChat?.messages.filter(message =>
    messageSearchQuery
      ? message.content.toLowerCase().includes(messageSearchQuery.toLowerCase())
      : true
  );

  const toggleMessageSearch = () => {
    setIsSearchingMessages(!isSearchingMessages);
    if (!isSearchingMessages) {
      setMessageSearchQuery('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {showChatList && (
        <div className={`${isMobileView ? 'w-full' : 'w-full md:w-[380px]'} bg-white border-r border-gray-200`}>
          {/* Profile Header */}
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              alt="Your avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex gap-4">
              <MessageSquare className="w-6 h-6 text-gray-600" />
              <MoreVertical className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedChat === chat.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <Search className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-center">No chats found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      {showChatArea ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-gray-50 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
              {isMobileView && (
                <button
                  onClick={handleBackToList}
                  className="mr-2 hover:bg-gray-200 p-1 rounded-full"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
              )}
              {currentChat && (
                <>
                  <img
                    src={currentChat.avatar}
                    alt="Chat avatar"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <h2 className="font-semibold">{currentChat.name}</h2>
                </>
              )}
            </div>
            <div className="flex gap-4">
              <Video className="hidden sm:block w-6 h-6 text-gray-600" />
              <Phone className="hidden sm:block w-6 h-6 text-gray-600" />
              <button
                onClick={toggleMessageSearch}
                className={`p-1 rounded-full ${isSearchingMessages ? 'bg-green-100' : 'hover:bg-gray-200'}`}
              >
                <Search className="w-6 h-6 text-gray-600" />
              </button>
              <MoreVertical className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {/* Message Search Bar */}
          {isSearchingMessages && (
            <div className="p-2 bg-white border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in messages"
                  value={messageSearchQuery}
                  onChange={(e) => setMessageSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  autoFocus
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                {messageSearchQuery && (
                  <button
                    onClick={() => setMessageSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-[#e5ded8] p-4">
            <div className="space-y-4 max-w-3xl mx-auto">
              {filteredMessages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'me'
                        ? 'bg-[#dcf8c6] rounded-tr-none'
                        : 'bg-white rounded-tl-none'
                    } ${
                      messageSearchQuery &&
                      message.content.toLowerCase().includes(messageSearchQuery.toLowerCase())
                        ? 'ring-2 ring-green-500'
                        : ''
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <p className="text-xs text-gray-500 text-right mt-1">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-2 sm:p-4 bg-gray-50 flex items-center gap-2 sm:gap-4">
            <div className="flex gap-2 sm:gap-4">
              <Smile className="w-6 h-6 text-gray-600 cursor-pointer" />
              <Paperclip className="w-6 h-6 text-gray-600 cursor-pointer" />
            </div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message"
              className="flex-1 py-2 px-3 sm:px-4 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Send
              className="w-6 h-6 text-gray-600 cursor-pointer"
              onClick={handleSendMessage}
            />
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}

export default App;