import React from 'react';
import { formatDistanceToNow } from 'date-fns'; // You'll need to install this package

const CouponCard = ({ coupon, onEdit }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'claimed':
        return 'status-claimed';
      case 'available':
        return 'status-available';
      default:
        return '';
    }
  };

  // Calculate usage statistics
  const claimCount = coupon.claimedBy?.length || 0;
  const lastClaimed = coupon.lastSelectedAt ? formatDistanceToNow(new Date(coupon.lastSelectedAt), { addSuffix: true }) : 'Never';

  return (
    <div className="coupon-card">
      <div className="coupon-header">
        <span className={`coupon-status ${getStatusClass(coupon.status)}`}>
          {coupon.status}
        </span>
        <h3 className="coupon-code">{coupon.code}</h3>
      </div>

      <div className="coupon-body">
        <div className="coupon-value">
          {coupon.type === 'percentage' ? (
            <span>{coupon.value}% OFF</span>
          ) : (
            <span>${coupon.value} OFF</span>
          )}
        </div>
        
        <p className="coupon-description">{coupon.description}</p>
        
        <div className="coupon-details">
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className={`detail-value ${coupon.isActive ? 'active' : 'inactive'}`}>
              {coupon.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Created:</span>
            <span className="detail-value">{formatDate(coupon.createdAt)}</span>
          </div>
          
          {coupon.claimedAt && (
            <div className="detail-item">
              <span className="detail-label">Claimed:</span>
              <span className="detail-value">{formatDate(coupon.claimedAt)}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-label">Usage:</span>
            <span className="detail-value">{claimCount} claims</span>
          </div>
          
          {coupon.lastSelectedAt && (
            <div className="detail-item">
              <span className="detail-label">Last used:</span>
              <span className="detail-value">{lastClaimed}</span>
            </div>
          )}
        </div>

        {claimCount > 0 && (
          <div className="claimed-by-section">
            <h4>Claimed By:</h4>
            <div className="claimed-list">
              {coupon.claimedBy.slice(0, 3).map((claim, index) => (
                <div key={index} className="claim-item">
                  <div className="claim-details">
                    <span>IP: {claim.ip || 'Not recorded'}</span>
                    <span>Time: {formatDate(claim.attemptAt)}</span>
                  </div>
                </div>
              ))}
              {coupon.claimedBy.length > 3 && (
                <div className="more-claims">
                  +{coupon.claimedBy.length - 3} more claims
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="coupon-actions">
        <button onClick={onEdit} className="edit-btn">Edit</button>
      </div>
    </div>
  );
};

export default CouponCard;