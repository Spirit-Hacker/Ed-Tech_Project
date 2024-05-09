export default function getAverageRating(ratingsArr){
    if(ratingsArr?.length === 0) return 0;
    let totalRatingCount = ratingsArr?.reduce((acc, curr) => {
        acc += curr.rating;
        return acc;
    }, 0);

    let multiplier = Math.pow(10, 1);
    let avgRating = Math.round((totalRatingCount / ratingsArr?.length) * multiplier) / multiplier;
    return avgRating;
}