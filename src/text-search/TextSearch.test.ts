import { TextSearch } from "./TextSearch";

describe('TextSeatch', () => {
    it('works with 1 field and 1 doc', () => {
        const ts = new TextSearch(['f1']);
        ts.add('d1', {'f1': 'ABC'});
        expect(ts.search('AB')).toStrictEqual({'d1': ['f1']});
        expect(ts.search('BC')).toStrictEqual({'d1': ['f1']});
    });

    it('works with 2 fields and 1 doc', () => {
        const ts = new TextSearch(['f1', 'f2']);
        ts.add('d1', {
            'f1': 'ABC',
            'f2': 'BCD'
        });
        expect(ts.search('AB')).toStrictEqual({'d1': ['f1']});
        expect(ts.search('BC')).toStrictEqual({'d1': ['f1', 'f2']});
        expect(ts.search('CD')).toStrictEqual({'d1': ['f2']});
    });

    it('works with 1 field and 2 docs', () => {
        const ts = new TextSearch(['f1']);
        ts.add('d1', {'f1': 'ABC'});
        ts.add('d2', {'f1': 'BCD'});
        expect(ts.search('AB')).toStrictEqual({'d1': ['f1']});
        expect(ts.search('BC')).toStrictEqual({'d1': ['f1'], 'd2': ['f1']});
        expect(ts.search('CD')).toStrictEqual({'d2': ['f1']});
    });

    it('works with 2 fields and 2 docs', () => {
        const ts = new TextSearch(['f1', 'f2']);
        ts.add('d1', {
            'f1': 'ABCD',
            'f2': 'BCDE',
        });
        ts.add('d2', {
            'f1': 'CDEF',
            'f2': 'DEFG',
        });
        expect(ts.search('AB')).toStrictEqual({
            'd1': ['f1']
        });
        expect(ts.search('BC')).toStrictEqual({
            'd1': ['f1', 'f2']
        });
        expect(ts.search('CD')).toStrictEqual({
            'd1': ['f1', 'f2'],
            'd2': ['f1'],
        });
        expect(ts.search('DE')).toStrictEqual({
            'd1': ['f2'],
            'd2': ['f2', 'f1'],
        });
        expect(ts.search('EF')).toStrictEqual({
            'd2': ['f1', 'f2'],
        });
        expect(ts.search('FG')).toStrictEqual({
            'd2': ['f2'],
        });
        expect(ts.search('GH')).toStrictEqual({
        });
    });

    it('works with JP texts', () => {
        const ts = new TextSearch(['f1']);
        ts.add('d1', {'f1': 'あいう'});
        expect(ts.search('あ')).toStrictEqual({'d1': ['f1']});
        expect(ts.search('い')).toStrictEqual({'d1': ['f1']});
    });
});