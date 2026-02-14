"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function test() {
    try {
        console.log('Testing GET /queue...');
        const queue = await axios_1.default.get('http://localhost:3001/queue');
        console.log('GET /queue status:', queue.status);
        console.log('Testing POST /queue/add...');
        try {
            await axios_1.default.post('http://localhost:3001/queue/add', {});
        }
        catch (e) {
            console.log('POST /queue/add status:', e.response?.status);
            console.log('POST /queue/add data:', e.response?.data);
        }
    }
    catch (e) {
        console.error('Error:', e.message);
    }
}
test();
//# sourceMappingURL=test-add.js.map