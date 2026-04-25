// Trust Score Formula:
// Trust Score = (Rating * 0.5) + (Price Score * 0.3) + (Verification * 0.2)

const calculateTrustScore = (rating, price, isVerified, avgMarketPrice = 5000) => {
  // Rating component (0-5 scale, normalized to 0-100)
  const ratingScore = (rating / 5) * 100;

  // Price Score (inverse - lower price = higher score, capped at 100)
  // If price is below average, score increases
  const priceRatio = avgMarketPrice / price;
  const priceScore = Math.min(priceRatio * 50, 100);

  // Verification component (boolean to 0 or 100)
  const verificationScore = isVerified ? 100 : 0;

  // Weighted calculation
  const trustScore = (
    (ratingScore * 0.5) +
    (priceScore * 0.3) +
    (verificationScore * 0.2)
  );

  return Math.round(trustScore * 10) / 10; // Round to 1 decimal
};

module.exports = { calculateTrustScore };