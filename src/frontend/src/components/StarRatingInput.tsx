import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function StarRatingInput({
  value,
  onChange,
}: StarRatingInputProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1" data-ocid="review.rating_input">
      {Array.from({ length: 5 }).map((_, i) => {
        const rating = i + 1;
        const filled = rating <= (hover || value);
        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHover(rating)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
            data-ocid={`review.star.${rating}`}
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                filled
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/40"
              }`}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-semibold text-foreground">
          {value}/5
        </span>
      )}
    </div>
  );
}
