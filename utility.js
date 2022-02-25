export function findDistance(X1, Y1, X2, Y2) {
    return Math.pow(Math.pow(X2-X1, 2)+Math.pow(Y2-Y1, 2), 0.5)
}

export function RGBAtoArray(rgba) {
    var temp = rgba.split(")")[0].split("(")[1].split(",")
    return [temp[0]/255,temp[1]/255,temp[2]/255,temp[3]]
    
    
}

export function hexToRGBA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return RGBAtoArray('rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)');
    }
    throw new Error('Bad Hex');
}
export function IsInRadius(X1,Y1,X2,Y2) {
    return (Math.abs(X1 - X2) <= 0.2) && (Math.abs(Y1-Y2) <= 0.2)
}

export function inputToPoint(shapes) {
    shapes = shapes.split(" ").join().split("(").join("").split(")").join("").split(",");
    return shapes;
}

export function makePointsArray(points) {
    var counter = 0
    var arrPoints = []
    var temp = []
    for (var i = 0; i < points.length; i++) {
        if (counter == 2) {
            arrPoints.push(temp)
            counter = 0
            temp = []
        } 
        temp.push(points[i])
        counter++
    }
    arrPoints.push(temp)

    return arrPoints
}

export function makeVerticeArray(pointsArr) {
    var verticeArr = []
    for (var i = 0; i < pointsArr.length; i++) {
        for (var j = 0; j < pointsArr[i].length; j++) {
            verticeArr.push(parseFloat(pointsArr[i][j]))
        }
        verticeArr.push(0)
    }

    console.log(verticeArr)


    return verticeArr
}

export function isVerticeValid(vertice) {
    var valid = true;
    var i = 0
    while(valid && i < vertice.length) {
        if (vertice[i] < -1 || vertice[i] > 1) {
            valid = false;
        }
        i++
    }

    return valid
}

