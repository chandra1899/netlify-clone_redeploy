"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const parsefile_1 = require("./parsefile");
const geturl_1 = require("./geturl");
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const getAllFiles_1 = require("./getAllFiles");
const updatestatus_1 = require("./updatestatus");
const aws_1 = require("./aws");
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const publisher = (0, redis_1.createClient)();
publisher.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const res = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), "redeploy-queue", 0);
            // @ts-ignore
            const id = res.element;
            console.log(id);
            publisher.hSet("status", id, "uploading...");
            const repoUrl = yield (0, geturl_1.getUrl)(id);
            yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
            console.log('hi');
            const files = (0, getAllFiles_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
            const allPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                yield (0, aws_1.uploadFile)((0, parsefile_1.parseFile)(file).slice(__dirname.length + 1), file);
            }));
            yield Promise.all(allPromises);
            //update status
            yield (0, updatestatus_1.updatestatus)(id);
            publisher.lPush("build-queue", id);
            publisher.hSet("status", id, "uploaded...");
        }
    });
}
main();
