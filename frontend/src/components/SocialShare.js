<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

const SocialShare = ({ event }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
<<<<<<< HEAD
  const panelRef = useRef(null);

  const eventUrl = `${window.location.origin}/events/${event._id}`;
  const eventTitle = encodeURIComponent(event.title);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };

    if (showShare) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShare]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
=======

  const eventUrl = `${window.location.origin}/events/${event._id}`;
  const eventTitle = encodeURIComponent(event.title);
  const eventDescription = encodeURIComponent(event.description || '');
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${eventTitle}&url=${eventUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}`,
    whatsapp: `https://wa.me/?text=${eventTitle}%20${eventUrl}`,
    telegram: `https://t.me/share/url?url=${eventUrl}&text=${eventTitle}`
  };

<<<<<<< HEAD
  return (
    <div className="relative z-[9999]" ref={panelRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowShare(!showShare);
        }}
        className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center space-x-2"
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      >
        <span>📤</span>
        <span>Share Event</span>
      </button>

      {showShare && (
        <>
<<<<<<< HEAD
          {/* Backdrop with higher z-index */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={() => setShowShare(false)}
          ></div>

          {/* Share Panel with highest z-index */}
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw] bg-white rounded-lg shadow-2xl z-[9999]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl text-gray-800">Share Event</h3>
                <button 
                  onClick={() => setShowShare(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                >
                  ✕
                </button>
              </div>

<<<<<<< HEAD
              <div className="space-y-3 mb-6">
=======
              {/* Social Media Buttons */}
              <div className="space-y-2 mb-4">
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
<<<<<<< HEAD
                  className="flex items-center space-x-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <span className="text-2xl">📘</span>
                  <span className="font-semibold text-lg">Facebook</span>
=======
                  className="flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <span className="text-xl">📘</span>
                  <span className="font-semibold">Share on Facebook</span>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                </a>

                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
<<<<<<< HEAD
                  className="flex items-center space-x-3 p-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                >
                  <span className="text-2xl">🐦</span>
                  <span className="font-semibold text-lg">Twitter</span>
=======
                  className="flex items-center space-x-3 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                >
                  <span className="text-xl">🐦</span>
                  <span className="font-semibold">Share on Twitter</span>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                </a>

                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
<<<<<<< HEAD
                  className="flex items-center space-x-3 p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  <span className="text-2xl">💼</span>
                  <span className="font-semibold text-lg">LinkedIn</span>
=======
                  className="flex items-center space-x-3 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  <span className="text-xl">💼</span>
                  <span className="font-semibold">Share on LinkedIn</span>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                </a>

                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
<<<<<<< HEAD
                  className="flex items-center space-x-3 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <span className="text-2xl">💬</span>
                  <span className="font-semibold text-lg">WhatsApp</span>
=======
                  className="flex items-center space-x-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <span className="text-xl">💬</span>
                  <span className="font-semibold">Share on WhatsApp</span>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                </a>

                <a
                  href={shareLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
<<<<<<< HEAD
                  className="flex items-center space-x-3 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <span className="text-2xl">✈️</span>
                  <span className="font-semibold text-lg">Telegram</span>
                </a>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Or copy link:</p>
=======
                  className="flex items-center space-x-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <span className="text-xl">✈️</span>
                  <span className="font-semibold">Share on Telegram</span>
                </a>
              </div>

              {/* Copy Link */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Or copy link:</p>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={eventUrl}
                    readOnly
<<<<<<< HEAD
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-sm"
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
=======
                    className="flex-1 px-3 py-2 border rounded bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded font-semibold ${
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
<<<<<<< HEAD
                    {copied ? '✓ Copied!' : 'Copy'}
=======
                    {copied ? '✓ Copied' : 'Copy'}
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
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