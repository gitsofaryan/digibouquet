"use client";

import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title?: string;
  description?: string;
}

export default function ShareButton({ url, title = "Check out this beautiful bouquet!", description = "I made this digital bouquet for you" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Share2 size={16} />
        Share
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              
              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-gray-600" />
                )}
                <span className="text-sm">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>

              {/* Native Share (if supported) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={shareViaNative}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Share2 size={16} className="text-gray-600" />
                  <span className="text-sm">Share...</span>
                </button>
              )}

              <hr className="my-2 border-gray-200" />

              {/* Social Media Options */}
              <button
                onClick={shareViaTwitter}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
              >
                <Twitter size={16} className="text-blue-400" />
                <span className="text-sm">Share on Twitter</span>
              </button>

              <button
                onClick={shareViaFacebook}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
              >
                <Facebook size={16} className="text-blue-600" />
                <span className="text-sm">Share on Facebook</span>
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
              >
                <MessageCircle size={16} className="text-green-500" />
                <span className="text-sm">Share on WhatsApp</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
