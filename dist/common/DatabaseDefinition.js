"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = void 0;
/**
 * One way to create a time ascending unique identifier.
 * Should suffice for most cases but some may require a less naive approach.
 *
 * @author Rodrigo Portela
 */
exports.createId = () => new Date().getTime().toString(36) + Math.random().toString(36);
