export const toCodePointByteArray = (str: string): number[] => {
    if (!str || str.length === 0) {
        return [];
    }
    const codePointArray: number[] = [];
    for (let i=0; i < str.length; i++) {
        const codePoint = str.codePointAt(i);
        if (!codePoint) {
            throw new Error(`Failed to get code point of '${str.charAt(i)}'`);
        }
        codePointArray.push(codePoint);
    }
    let result: number[] = [];
    codePointArray.forEach(codePoint => {
        result = result.concat(toByteArray(codePoint));
    })
    return result;
};

const toByteArray = (codePoint: number): number[] => {
    const arr: number[] = [];
    let num = codePoint;
    do {
        arr.push(num & 0xff);
        num >>= 8;
    } while (num > 0);
    return arr.reverse();
};
