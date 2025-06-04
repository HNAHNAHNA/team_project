import ReviewAverageIcon from './images/review-average-icon.svg?react'

type ReviewAverageProps = {
  className?: string;
};

function ReviewAverage({ className = '' }: ReviewAverageProps) {
  return (
    <div className="inline-block">
      <ReviewAverageIcon className={className || "w-4 h-4 mr-1 text-black"} />
    </div>
  );
}

export default ReviewAverage;