"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mbtiles2tilejson = void 0;
const sqlite3 = __importStar(require("sqlite3"));
const path = __importStar(require("path"));
const runQuery = (db, sql) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const rows = [];
        db.serialize(() => {
            db.each(sql, (error, row) => {
                if (error) {
                    reject(error);
                }
                else {
                    rows.push(row);
                }
            }, (error, count) => {
                resolve(rows);
            });
        });
    });
});
const mbtiles2tilejson = (mbtilesFilePath, baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    let tilejson = {};
    const names = path.parse(mbtilesFilePath);
    tilejson["id"] = names.name;
    tilejson["basename"] = names.base;
    tilejson["tiles"] = baseUrl + "{z}/{x}/{y}." + tilejson["format"];
    tilejson["tilejson"] = "2.0.0";
    let db = new sqlite3.Database(mbtilesFilePath);
    const rows = yield runQuery(db, "SELECT * FROM metadata");
    db.close();
    try {
        for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
            const row = rows_1_1.value;
            switch (row.name) {
                case "bounds":
                case "center":
                    tilejson[row.name] = row.value.split(",").map((i) => parseFloat(i));
                    break;
                case "maxzoom":
                case "minzoom":
                    tilejson[row.name] = parseInt(row.value);
                    break;
                case "json":
                    tilejson = Object.assign(Object.assign({}, tilejson), JSON.parse(row.value));
                    break;
                default:
                    tilejson[row.name] = row.value;
                    break;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return JSON.stringify(tilejson, null, 2);
});
exports.mbtiles2tilejson = mbtiles2tilejson;
