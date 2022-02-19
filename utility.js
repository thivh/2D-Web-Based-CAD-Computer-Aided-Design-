export function findDistance(X1, Y1, X2, Y2) {
    return Math.pow(Math.pow(X2-X1, 2)+Math.pow(Y2-Y1, 2), 0.5)
}