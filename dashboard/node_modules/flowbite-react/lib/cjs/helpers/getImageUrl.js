"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageUrl = void 0;
function getImageUrl(imageName) {
    return `${process.env.PUBLIC_URL}/images/${imageName}`;
}
exports.getImageUrl = getImageUrl;
