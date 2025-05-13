import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { XMarkIcon } from '@heroicons/react/24/solid';

import ReactMarkdown from 'react-markdown';

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
};

export default function TravelExpertChatbot({ tripData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your travel expert assistant. How can I help with your trip to " +
                (tripData?.destination || "your destination") + "?"
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Add custom styles for markdown content
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      .markdown-content h1, .markdown-content h2, .markdown-content h3 {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #111827;
      }
      .markdown-content h1 { font-size: 1.25rem; }
      .markdown-content h2 { font-size: 1.15rem; }
      .markdown-content h3 { font-size: 1.05rem; }
      .markdown-content ul, .markdown-content ol {
        margin-left: 1.5rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .markdown-content ul { list-style-type: disc; }
      .markdown-content ol { list-style-type: decimal; }
      .markdown-content p {
        margin-bottom: 0.5rem;
      }
      .markdown-content a {
        color: #4b5563;
        text-decoration: underline;
      }
      .markdown-content strong {
        font-weight: 600;
        color: #111827;
      }
      .chatbot-container {
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(229, 231, 235, 0.8);
      }
      .assistant-message {
        background: linear-gradient(to right bottom, #f9fafb, #f3f4f6);
        border: 1px solid #e5e7eb;
      }
      .user-message {
        background: linear-gradient(to right bottom, #111827, #1f2937);
        border: 1px solid #111827;
      }
      .chat-input {
        border: 2px solid #e5e7eb;
        transition: all 0.2s ease;
      }
      .chat-input:focus {
        border-color: #4b5563;
        box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.2);
      }
      .send-button {
        transition: all 0.2s ease;
      }
      .send-button:hover {
        transform: translateY(-1px);
      }
      .header-gradient {
        background: linear-gradient(to right, #111827, #374151);
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateTripContext = () => {
        let context = "";
        if (tripData) {
            context = `Trip Details:
        - Departure Location: ${tripData.departureLocation || "Not specified"}
        - Destination: ${tripData.destination || "Not specified"}
        - Duration: ${tripData.days || "Not specified"} days
        - Budget: ${tripData.budget || "Not specified"}
        - Traveling with: ${tripData.travelWith || "Not specified"}`;

            if (tripData.hotels && tripData.hotels.length > 0) {
                context += "\nSelected Hotels:";
                tripData.hotels.forEach((hotel, index) => {
                    context += `\n- ${hotel.name} (${hotel.pricePerNight || 'Price not available'})`;
                });
            }

            if (tripData.placesToVisit && tripData.placesToVisit.length > 0) {
                context += "\nPlaces to Visit:";
                tripData.placesToVisit.forEach((place, index) => {
                    context += `\n- ${place.name}`;
                });
            }
        }
        return context;
    };

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = { role: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const tripContext = generateTripContext();

            const prompt = `
      You are a helpful and friendly travel expert assistant for a trip planning website.
      
      ${tripContext}
      
      Please respond to the following user query in a friendly, informative manner as a travel guide would.
      Focus only on travel-related inquiries, including:
      1. Trip details and changes
      2. Transportation options and schedules
      3. Local attractions and activities
      4. Common travel-related questions
      5. Website support for the trip planning service
      
      Keep responses concise, practical, and conversational. Format important information clearly using proper markdown with headers (##) for sections and bullet points for lists. If you don't have specific information about the user's trip details, provide general travel advice or ask for clarification.
      
      USER QUERY: ${inputMessage}
      `;

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig,
            });

            const response = result.response;
            const responseText = response.text();

            setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        } catch (error) {
            console.error("Error generating response:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again in a moment."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white rounded-xl chatbot-container flex flex-col w-96 sm:w-[450px] md:w-[550px] h-[600px]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 header-gradient text-white rounded-t-xl">
                        <div className="flex items-center">
                            <MessageSquare className="mr-3 h-6 w-6" />
                            <h3 className="font-medium text-lg">Travel Expert</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            aria-label="Close chat"
                        >


                            <div className="h-5 w-5 text-white">x</div>

                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-5 overflow-y-auto bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                            >
                                <div
                                    className={`px-5 py-3 rounded-xl max-w-[80%] shadow-sm ${
                                        message.role === 'user'
                                            ? 'user-message text-white rounded-br-none'
                                            : 'assistant-message text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {message.role === 'assistant' ? (
                                        <div className="markdown-content prose prose-sm max-w-none">
                                            <ReactMarkdown>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        message.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="px-5 py-3 rounded-xl assistant-message text-gray-800 rounded-bl-none shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="h-3 w-3 bg-gray-600 rounded-full animate-bounce opacity-75" style={{ animationDelay: '0s' }}></div>
                                        <div className="h-3 w-3 bg-gray-600 rounded-full animate-bounce opacity-75" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="h-3 w-3 bg-gray-600 rounded-full animate-bounce opacity-75" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                        <div className="flex items-center">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask your travel expert..."
                                className="flex-1 rounded-lg py-3 px-4 focus:outline-none chat-input resize-none"
                                rows="2"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !inputMessage.trim()}
                                className={`ml-3 p-3 rounded-full send-button shadow-sm ${
                                    isLoading || !inputMessage.trim()
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black hover:bg-gray-800 text-white rounded-full px-5 py-4 flex items-center shadow-lg transition-all hover:scale-105"
                >
                    <MessageSquare className="mr-2 h-6 w-6" />
                    <span className="font-medium">Ask Expert</span>
                </button>
            )}
        </div>
    );
}