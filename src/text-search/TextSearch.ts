import { toCodePointByteArray } from "./StringUtils";

type SearchResult = {[docKey: string]: string[]};

export class TextSearch {
    private fields: string[];
    private docKeys: string[];
    private biGramMap: Map<number, Map<number, Map<number, Set<number>>>>;

    constructor(fields: string[]) {
        this.fields = fields;
        this.docKeys = [];
        this.biGramMap = new Map();
    }

    public add(docKey: string, fields: {[field: string]: string}): void {
        const docId = this.docKeys.length;
        this.docKeys.push(docKey);
        Object.entries(fields).forEach(([field, text]) => {
            const fieldId = this.fields.indexOf(field);
            if (fieldId < 0) {
                throw new Error(`Unknown field: ${field}`);
            }
            this.addText(docId, fieldId, text);
        })
    }

    private addText(docId: number, fieldId: number, text: string): void {
        const byteArray = toCodePointByteArray(text);
        for (let i = 0; i < byteArray.length - 1; i++) {
            const firstByte = byteArray[i];
            const secondByte = byteArray[i + 1];
            if (!this.biGramMap.has(firstByte)) {
                this.biGramMap.set(firstByte, new Map());
            }
            const firstByteNode = this.biGramMap.get(firstByte);
            if (!firstByteNode?.has(secondByte)) {
                firstByteNode?.set(secondByte, new Map());
            }
            const secondByteNode = firstByteNode?.get(secondByte);
            if (!secondByteNode?.has(fieldId)) {
                secondByteNode?.set(fieldId, new Set());
            }
            const docIdSet = secondByteNode?.get(fieldId);
            docIdSet?.add(docId);
        }
    }

    public search(query: string): SearchResult {
        const byteArray = toCodePointByteArray(query);
        const resultFieldMap = new Map<number, Set<number>>();
        for (let i = 0; i < byteArray.length - 1; i++) {
            const firstByte = byteArray[i];
            const secondByte = byteArray[i + 1];
            if (!this.biGramMap.has(firstByte)) {
                return {};
            }
            const firstByteNode = this.biGramMap.get(firstByte);
            if (!firstByteNode?.has(secondByte)) {
                return {};
            }
            const secondByteNode = firstByteNode.get(secondByte);
            secondByteNode?.forEach((docIdSet, fieldId) => {
                if (resultFieldMap.has(fieldId)) {
                    const currentDocIdSet = resultFieldMap.get(fieldId);
                    const newDocIdSet = new Set<number>();
                    currentDocIdSet?.forEach(currentDocId => {
                        if (docIdSet.has(currentDocId)) {
                            newDocIdSet.add(currentDocId);
                        }
                    });
                    resultFieldMap.set(fieldId, newDocIdSet);
                } else {
                    resultFieldMap.set(fieldId, docIdSet);
                }
            })
        }
        const searchResult: SearchResult = {};
        resultFieldMap.forEach((docIdSet, fieldId) => {
            const field = this.fields[fieldId];
            docIdSet.forEach(docId => {
                const docKey = this.docKeys[docId];
                if (!searchResult[docKey]) {
                    searchResult[docKey] = [];
                }
                searchResult[docKey].push(field);
            });
        });
        return searchResult;
    }
};