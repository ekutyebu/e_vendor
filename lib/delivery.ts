interface Coordinates {
    lat: number
    lng: number
}

/**
 * Haversine formula to calculate distance between two coordinates in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat)
    const dLon = toRad(coord2.lng - coord1.lng)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180
}

/**
 * Calculate delivery fee based on distance and vendor settings
 * @param vendorCoords - Vendor location
 * @param customerCoords - Customer location
 * @param baseFee - Base delivery fee (FCFA)
 * @param radius - Free delivery radius (km)
 * @returns Total delivery fee in FCFA
 */
export function calculateDeliveryFee(
    vendorCoords: Coordinates,
    customerCoords: Coordinates,
    baseFee: number,
    radius: number
): number {
    const distance = calculateDistance(vendorCoords, customerCoords)

    if (distance <= radius) {
        return baseFee
    }

    const extraDistance = distance - radius
    const extraFee = Math.ceil(extraDistance) * 500 // 500 FCFA per extra km
    return baseFee + extraFee
}

/**
 * Estimate delivery time in minutes based on distance
 */
export function estimateDeliveryTime(distanceKm: number): number {
    const baseTime = 30 // 30 min base time
    const timePerKm = 5 // 5 min per km
    return baseTime + Math.ceil(distanceKm) * timePerKm
}
