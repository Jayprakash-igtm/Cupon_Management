import React from 'react';


const ClaimedCouponCard = ({ coupon }) => {
  return (
    <div className="claimed-coupon-card">
      <div className="claimed-coupon-header">
        <h3 className="claimed-coupon-code">{coupon.code}</h3>
        <span className={`claimed-coupon-status ${coupon.status === 'Claimed' ? 'status-claimed' : 'status-available'}`}>
          {coupon.status}
        </span>
      </div>
      <div className="claimed-coupon-body">
        <p className="claimed-coupon-description">{coupon.description}</p>
        <p className="claimed-coupon-value">Value: {coupon.value} {coupon.type === 'percentage' ? '%' : ''}</p>

        <div className="claimed-coupon-details">
          <div className="detail-item">
            <span className="detail-label">Claimed At:</span>
            <span className="detail-value">
              {coupon.claimedAt ? new Date(coupon.claimedAt).toLocaleString() : 'N/A'}
            </span>
          </div>

          {coupon.claimedBy && (
            <>
              <div className="detail-item">
                <span className="detail-label">IP Address:</span>
                <span className="detail-value">{coupon.claimedBy.ip || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Session ID:</span>
                <span className="detail-value">{coupon.claimedBy.sessionId || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">User Agent:</span>
                <span className="detail-value">{coupon.claimedBy.userAgent || 'N/A'}</span>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClaimedCouponCard;