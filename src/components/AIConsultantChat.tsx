import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
  RotateCcw,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { NumerologyProfile, ChatMessage } from '../types/numerology';
import { generateDeterministicQA } from '../utils/fallbackNumerology';
import { RichMarkdown } from './RichMarkdown';
import { MarkdownView } from './MarkdownView';

interface AIConsultantChatProps {
  profile: NumerologyProfile | null;
  initialDeepReading?: string | null;
  onGenerateDeepReading?: () => void;
  isDeepReadingLoading?: boolean;
}

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({
  profile,
  initialDeepReading,
  onGenerateDeepReading,
  isDeepReadingLoading,
}) => {
  const buildWelcomeMessage = (p: NumerologyProfile | null): ChatMessage => ({
    id: `welcome_${p?.id || 'default'}`,
    role: 'assistant',
    content: p
      ? `Xin chào **${p.fullName}**! Tôi là Cố Vấn Thần Số Học AI Master. Tôi đã kết nối toàn bộ bản đồ năng lượng của bạn với **Số Chủ Đạo ${p.lifePathDisplay}**, **Sứ Mệnh ${p.destiny}**, **Linh Hồn ${p.soulUrge}** và **Năm Cá Nhân ${p.personalYear}**.\n\nBạn có thể hỏi tôi bất kỳ điều gì về: sự nghiệp, tình duyên, tháo gỡ bế tắc năm nay, hoặc định hướng phát triển bản thân!`
      : `Xin chào! Tôi là Cố Vấn Thần Số Học Trực Tuyến. Hãy nhập thông tin ngày sinh và họ tên của bạn ở thanh trên để tôi giải mã chính xác nhất nhé!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const [messages, setMessages] = useState<ChatMessage[]>([buildWelcomeMessage(profile)]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync chat session whenever the active profile changes
  useEffect(() => {
    setMessages([buildWelcomeMessage(profile)]);
  }, [profile?.id]);

  const sampleQuestions = [
    'Năm nay tôi có nên thay đổi công việc hoặc khởi nghiệp không?',
    'Làm sao để hóa giải các điểm khuyết trong biểu đồ ngày sinh?',
    'Số chủ đạo và số sứ mệnh của tôi kết hợp ra sao?',
    'Bài học linh hồn lớn nhất kiếp này của tôi là gì?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/numerology/ai-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          question: query,
          chatHistory: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      let answerText = '';
      if (res.ok) {
        const data = await res.json();
        answerText = data.answer;
      }

      if (!answerText) {
        answerText = generateDeterministicQA(profile, query);
      }

      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Network issue during AI Q&A, using deterministic Pythagoras engine:', err);
      const fallbackAnswer = generateDeterministicQA(profile, query);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: fallbackAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0A0D14] p-5 sm:p-6 rounded-sm border border-[#B8860B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative geometric-corners shadow-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-2.5 h-2.5 border border-[#B8860B] rotate-45" />
            <h2 className="text-base sm:text-lg font-normal tracking-[0.15em] text-[#F3F4F6] uppercase font-serif">
              Cố Vấn Thần Số Học AI Master
            </h2>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#B8860B]/20 text-[#B8860B] font-bold border border-[#B8860B]/40 font-serif">
              Trực tuyến
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 pl-5">
            Huấn luyện trên hệ tri thức Pythagoras chuẩn mực kết hợp giải mã hình học tâm linh và tâm lý học tích cực.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {messages.length > 1 && (
            <button
              type="button"
              onClick={() => setMessages([buildWelcomeMessage(profile)])}
              className="px-3 py-2.5 rounded-sm bg-[#05070A] hover:bg-[#B8860B]/15 text-[#94A3B8] hover:text-[#B8860B] border border-[#B8860B]/30 text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}

          {/* Generate Full Deep Reading CTA */}
          {onGenerateDeepReading && (
            <button
              id="trigger-full-reading-btn"
              onClick={onGenerateDeepReading}
              disabled={isDeepReadingLoading}
              className="px-4 py-2.5 rounded-sm bg-[#B8860B] hover:bg-[#D4AF37] text-[#05070A] font-serif font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              {isDeepReadingLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#05070A]" />
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
              <span>Tạo Bản Luận Giải Trọn Đời AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Deep Reading View (if available) */}
      {initialDeepReading && (
        <div className="bg-[#0A0D14] rounded-sm p-6 border border-[#B8860B]/40 shadow-2xl space-y-4 animate-fadeIn geometric-corners">
          <div className="flex items-center justify-between pb-3 border-b border-[#B8860B]/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
              <h3 className="text-sm font-normal text-[#F3F4F6] font-serif uppercase tracking-wider">
                Bản Luận Giải Vận Mệnh Trọn Đời (AI Generated)
              </h3>
            </div>
            <span className="text-xs text-[#B8860B] font-medium font-serif">Bản đồ: {profile?.fullName}</span>
          </div>
          <div className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed bg-[#05070A] p-5 rounded-sm border border-[#B8860B]/20 max-h-[460px] overflow-y-auto">
            <MarkdownView content={initialDeepReading} />
          </div>
        </div>
      )}

      {/* Main Chat Box Container */}
      <div className="bg-[#0A0D14] rounded-sm border border-[#B8860B]/30 shadow-xl overflow-hidden flex flex-col h-[550px] geometric-corners">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 border ${
                    isUser
                      ? 'bg-[#B8860B] text-[#05070A] font-serif font-bold text-xs border-[#B8860B]'
                      : 'bg-[#05070A] border-[#B8860B]/40 text-[#B8860B]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-sm px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#B8860B] text-[#05070A] font-medium shadow-md'
                      : 'bg-[#05070A] border border-[#B8860B]/25 text-[#F3F4F6] shadow-md'
                  }`}
                >
                  {isUser ? msg.content : <MarkdownView content={msg.content} />}
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isUser ? 'text-[#05070A]/70' : 'text-[#94A3B8]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#05070A] border border-[#B8860B]/40 text-[#B8860B] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-[#05070A] border border-[#B8860B]/20 rounded-sm px-4 py-3 text-xs text-[#B8860B] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#B8860B]" />
                <span>AI Master đang chiêm nghiệm lá số của bạn...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 sm:p-3 bg-[#05070A] border-t border-[#B8860B]/20 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-[#94A3B8] whitespace-nowrap flex items-center gap-1 pl-1 uppercase tracking-wider font-serif">
            <HelpCircle className="w-3 h-3 text-[#B8860B]" /> Gợi ý:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-sm bg-[#0A0D14] hover:bg-[#05070A] text-[#94A3B8] hover:text-[#F3F4F6] border border-[#B8860B]/20 hover:border-[#B8860B]/50 whitespace-nowrap transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-[#05070A] border-t border-[#B8860B]/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi AI về vận mệnh, tình cảm, sự nghiệp, năm nay..."
              className="flex-1 px-4 py-2.5 rounded-sm bg-[#0A0D14] border border-[#B8860B]/30 focus:border-[#B8860B] focus:outline-none text-[#F3F4F6] text-xs sm:text-sm placeholder-[#94A3B8]/50"
            />
            <button
              id="send-ai-chat-btn"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-sm bg-[#B8860B] hover:bg-[#D4AF37] text-[#05070A] font-bold transition disabled:opacity-40 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
