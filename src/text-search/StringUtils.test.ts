import { toCodePointByteArray } from "./StringUtils";

test('toCodePointByteArray', () => {
    new Map<string, number[]>([
        ['a', [97]],
        ['Z', [90]],
        ['$', [36]],
        ['abc', [97, 98, 99]],
        ['あ', [48, 66]],
        ['あいう', [48, 66, 48, 68, 48, 70]],
        ['🍅', [1, 243, 69, 223, 69]],
    ]).forEach((expected, test) => {
        expect(toCodePointByteArray(test)).toStrictEqual(expected);
    });
});