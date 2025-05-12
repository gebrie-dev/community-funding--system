// src/components/SocialShare.jsx
import { Facebook, Twitter, Mail, LinkIcon } from 'lucide-react';
import './SocialShare.css';

const SocialShare = ({ url, title, description }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
  };
  
  const shareByEmail = () => {
    window.open(`mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`, '_blank');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  };
  
  return (
    <div className="social-share">
      <h3>Share this campaign</h3>
      <div className="share-buttons">
        <button className="share-button facebook" onClick={shareOnFacebook}>
          <Facebook size={18} />
          <span>Facebook</span>
        </button>
        
        <button className="share-button twitter" onClick={shareOnTwitter}>
          <Twitter size={18} />
          <span>Twitter</span>
        </button>
        
        <button className="share-button email" onClick={shareByEmail}>
          <Mail size={18} />
          <span>Email</span>
        </button>
        
        <button className="share-button copy" onClick={copyToClipboard}>
          <LinkIcon size={18} />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;