"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = void 0;
const parseFile = (filepath) => {
    let s = "";
    for (let i = 0; i < filepath.length; i++) {
        if (filepath[i] === '\\') {
            s += '/';
        }
        else {
            s += filepath[i];
        }
    }
    return s;
};
exports.parseFile = parseFile;
