import React, { useState } from 'react';

const SocialShare = ({ event }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const eventUrl = `${window.location.origin}/events/${event._id}`;
  const eventTitle = encodeURIComponent(event.title);
  const eventDescription = encodeURIComponent(event.description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${eventTitle}&url=${eventUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}`,
    whatsapp: `https://wa.me/?text=${eventTitle}%20${eventUrl}`,
    telegram: `https://t.me/share/url?url=${eventUrl}&text=${eventTitle}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold flex items-center space-x-2"
      >
        <span>📤</span>
        <span>Share Event</span>
      </button>

      {showShare && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowShare(false)}
          ></div>

          {/* Share Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border-2 border-gray-200 z-50">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Share this event</h3>
                <button 
                  onClick={() => setShowShare(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Social Media Buttons */}
              <div className="space-y-2 mb-4">
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <span className="text-xl">📘</span>
                  <span className="font-semibold">Share on Facebook</span>
                </a>

                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                >
                  <span className="text-xl">🐦</span>
                  <span className="font-semibold">Share on Twitter</span>
                </a>

                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  <span className="text-xl">💼</span>
                  <span className="font-semibold">Share on LinkedIn</span>
                </a>

                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <span className="text-xl">💬</span>
                  <span className="font-semibold">Share on WhatsApp</span>
                </a>

                <a
                  href={shareLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <span className="text-xl">✈️</span>
                  <span className="font-semibold">Share on Telegram</span>
                </a>
              </div>

              {/* Copy Link */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Or copy link:</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={eventUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded font-semibold ${
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;