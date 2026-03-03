import { rateAssignment } from '@/actions/assignment.action';
import { toastSuccess } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import React, { useState } from 'react';

const StarRating = ({ i }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = i.rating?.star || 0;

const client = useQueryClient();

    const sumbitRattings = useMutation({
      mutationFn: async ({ assignmentId, ratings , buyerId , writerId }: { assignmentId: string, ratings: number , buyerId:string , writerId :string}) => {
        return await rateAssignment(assignmentId, ratings,  buyerId , writerId)
      },
      onSuccess: (data) => {
        if (data.status === 200) {
          toastSuccess('Ratings submitted successfully');
          client.invalidateQueries({ queryKey: ['assignments'] })
        }
        else {
          toastSuccess('Something went wrong');
        }
      }
    })

  return (
    <div className="flex">
      {[...Array(5)].map((_, idx) => {
        const starIndex = idx + 1;

        // Priority: hoverRating > currentRating
        const isFilled = starIndex <= (hoverRating || currentRating);

        return (
          <Star
            key={idx}
            fill={isFilled ? '#facc15' : 'none'} // yellow-400 or none
            onMouseEnter={() => setHoverRating(starIndex)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => {
              sumbitRattings.mutate({
                assignmentId: i.id,
                ratings: starIndex,
                buyerId: i.buyer.id,
                writerId: i.writer.id,
              });
            }}
            className={`${isFilled ? 'text-yellow-400' : 'text-gray-400'} cursor-pointer w-6 h-6 transition-colors duration-150`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
