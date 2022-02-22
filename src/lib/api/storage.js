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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createTokenURIData = exports.readTicketMetadata = exports.getLootboxURI = exports.readJSON = void 0;
var constants_1 = require("lib/hooks/constants");
var userState_1 = require("lib/state/userState");
var lootboxUrl = function (lootboxAddress) {
    return "".concat((0, constants_1.storageUrl)(userState_1.userState.network.currentNetworkIdHex || constants_1.DEFAULT_CHAIN_ID_HEX), "/lootbox/").concat(lootboxAddress);
};
var metadataStorageUrl = function (lootboxAddress, ticketID) {
    return "".concat(lootboxUrl(lootboxAddress), "/lootbox/").concat(lootboxAddress, "/ticket/").concat(ticketID, ".json?alt=media");
};
var defaultMetadataStorageUrl = function (lootboxAddress) {
    return "".concat(lootboxUrl(lootboxAddress), "/lootbox/").concat(lootboxAddress, "/ticket/default.json?alt=media");
};
var readJSON = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        result = {
            address: '________',
            name: 'Artemis Guild',
            description: '',
            image: constants_1.DEFAULT_TICKET_IMAGE,
            backgroundColor: constants_1.DEFAULT_TICKET_BACKGROUND_COLOR,
            backgroundImage: constants_1.DEFAULT_TICKET_BACKGROUND
        };
        return [2 /*return*/, result];
    });
}); };
exports.readJSON = readJSON;
var getLootboxURI = function (_a) {
    var semvar = _a.semvar, chainIdHex = _a.chainIdHex, lootboxAddress = _a.lootboxAddress, bucket = _a.bucket;
    return __awaiter(void 0, void 0, void 0, function () {
        var filePath, downloadablePath, lootboxURI;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    filePath = "v/".concat(semvar, "/").concat(chainIdHex, "/lootbox-uri/").concat(lootboxAddress, ".json");
                    downloadablePath = "https://firebasestorage.googleapis.com/v0/b/".concat(bucket, "/o/").concat(filePath, "?alt=media \n");
                    return [4 /*yield*/, fetch(downloadablePath)];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    lootboxURI = _b.sent();
                    return [2 /*return*/, lootboxURI];
            }
        });
    });
};
exports.getLootboxURI = getLootboxURI;
var readTicketMetadata = function (lootboxAddress, ticketID) { return __awaiter(void 0, void 0, void 0, function () {
    var defaultFilepath, filepath, _a, address, name, description, image, backgroundColor, backgroundImage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                defaultFilepath = defaultMetadataStorageUrl(lootboxAddress);
                filepath = metadataStorageUrl(lootboxAddress, ticketID);
                return [4 /*yield*/, (0, exports.readJSON)(filepath)
                    // const { address, name, description, image, backgroundColor, backgroundImage } = await getLootboxURI({
                    //   lootboxAddress,
                    //   semvar: '0.2.0-sandbox',
                    //   chainIdHex: '0x61',
                    //   bucket: "guildfx-exchange.appspot.com",
                    // })
                ];
            case 1:
                _a = _b.sent(), address = _a.address, name = _a.name, description = _a.description, image = _a.image, backgroundColor = _a.backgroundColor, backgroundImage = _a.backgroundImage;
                // const { address, name, description, image, backgroundColor, backgroundImage } = await getLootboxURI({
                //   lootboxAddress,
                //   semvar: '0.2.0-sandbox',
                //   chainIdHex: '0x61',
                //   bucket: "guildfx-exchange.appspot.com",
                // })
                return [2 /*return*/, { address: address, name: name, description: description, image: image, backgroundColor: backgroundColor, backgroundImage: backgroundImage }];
        }
    });
}); };
exports.readTicketMetadata = readTicketMetadata;
var createTokenURIData = function (inputs) { return __awaiter(void 0, void 0, void 0, function () {
    var headers, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("... createTokenURIData");
                headers = new Headers({
                    'Content-Type': 'application/json',
                    'secret': 'mysecret'
                });
                return [4 /*yield*/, fetch(constants_1.PIPEDREAM_TOKEN_URI_UPLOADER, {
                        method: 'POST',
                        headers: headers,
                        mode: 'cors',
                        cache: 'default',
                        body: JSON.stringify(inputs)
                    })];
            case 1:
                x = _a.sent();
                console.log(x);
                return [2 /*return*/, x];
        }
    });
}); };
exports.createTokenURIData = createTokenURIData;
