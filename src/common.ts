const format = (msg: string): string => {
    return `TSR: ${msg}`;
};

export const error = (msg: string): void => {
    console.error(format(msg));
};

export const log = (msg: string): void => {
    console.log(format(msg));
};