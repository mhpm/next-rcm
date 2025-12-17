"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var client_1 = require("../generated/prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var XLSX = require("xlsx");
var fs_1 = require("fs");
// Create the adapter for PostgreSQL
var adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
// Create the Prisma Client with the adapter
var prisma = new client_1.PrismaClient({
    adapter: adapter,
});
function importMembers(filePath, churchId) {
    return __awaiter(this, void 0, void 0, function () {
        var church, workbook, sheetName, worksheet, data, successCount, errorCount, _i, _a, _b, index, row, firstName, lastName1, lastName2, lastName, email, phone, memberData, genderRaw, g, ageRaw, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("\uD83D\uDE80 Starting import from ".concat(filePath, " for church ").concat(churchId, "..."));
                    if (!fs_1.default.existsSync(filePath)) {
                        console.error("\u274C File not found: ".concat(filePath));
                        process.exit(1);
                    }
                    return [4 /*yield*/, prisma.churches.findUnique({ where: { id: churchId } })];
                case 1:
                    church = _c.sent();
                    if (!church) {
                        console.error("\u274C Church not found: ".concat(churchId));
                        process.exit(1);
                    }
                    console.log("\u26EA Found church: ".concat(church.name));
                    workbook = XLSX.readFile(filePath);
                    sheetName = workbook.SheetNames[0];
                    worksheet = workbook.Sheets[sheetName];
                    data = XLSX.utils.sheet_to_json(worksheet);
                    console.log("\uD83D\uDCCA Found ".concat(data.length, " rows in the first sheet."));
                    successCount = 0;
                    errorCount = 0;
                    _i = 0, _a = data.entries();
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    _b = _a[_i], index = _b[0], row = _b[1];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 8, , 9]);
                    firstName = row["firstName"] ||
                        row["firstname"] ||
                        row["Nombre"] ||
                        row["nombre"] ||
                        row["First Name"] ||
                        row["NOMBRES"];
                    lastName1 = row["APELLIDO PATERNO"] ||
                        row["Apellido Paterno"] ||
                        row["apellido paterno"] ||
                        "";
                    lastName2 = row["APELLIDO MATERNO"] ||
                        row["Apellido Materno"] ||
                        row["apellido materno"] ||
                        "";
                    lastName = "".concat(lastName1, " ").concat(lastName2).trim() ||
                        row["lastName"] ||
                        row["lastname"] ||
                        row["Apellido"] ||
                        row["apellido"] ||
                        row["Last Name"];
                    email = row["email"] || row["Email"] || row["Correo"] || row["correo"];
                    phone = row["phone"] ||
                        row["Phone"] ||
                        row["Telefono"] ||
                        row["telefono"] ||
                        row["Celular"] ||
                        row["celular"];
                    if (phone)
                        phone = String(phone);
                    memberData = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email ? String(email).toLowerCase() : null,
                        phone: phone,
                        church_id: churchId,
                        // Defaults
                        role: client_1.$Enums.MemberRole.MIEMBRO,
                        gender: client_1.$Enums.Gender.MASCULINO,
                    };
                    if (!memberData.firstName || !memberData.lastName) {
                        console.warn("\u26A0\uFE0F Skipping row ".concat(index + 2, " (Excel row): Missing firstName or lastName"));
                        errorCount++;
                        return [3 /*break*/, 9];
                    }
                    genderRaw = row["gender"] ||
                        row["Gender"] ||
                        row["Genero"] ||
                        row["genero"] ||
                        row["sexo"] ||
                        row["SEXO"];
                    if (genderRaw) {
                        g = String(genderRaw).toUpperCase();
                        if (g.includes("FEM") || g === "F" || g === "MUJER") {
                            memberData.gender = client_1.$Enums.Gender.FEMENINO;
                        }
                    }
                    ageRaw = row["age"] || row["Age"] || row["Edad"] || row["edad"];
                    if (ageRaw)
                        memberData.age = Number(ageRaw);
                    if (!memberData.email) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma.members.upsert({
                            where: { email: memberData.email },
                            update: __assign({}, memberData),
                            create: memberData,
                        })];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 5: 
                // Create without email
                return [4 /*yield*/, prisma.members.create({
                        data: memberData,
                    })];
                case 6:
                    // Create without email
                    _c.sent();
                    _c.label = 7;
                case 7:
                    successCount++;
                    process.stdout.write("\r\u2705 Imported: ".concat(successCount, " / \u274C Errors: ").concat(errorCount));
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _c.sent();
                    console.error("\n\u274C Error on row ".concat(index + 2, ":"), error_1);
                    errorCount++;
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 2];
                case 10:
                    console.log("\n\n\u2728 Import completed!");
                    console.log("\u2705 Success: ".concat(successCount));
                    console.log("\u274C Errors: ".concat(errorCount));
                    return [2 /*return*/];
            }
        });
    });
}
// Get args
var args = process.argv.slice(2);
if (args.length < 2) {
    console.log("\nUsage: npx tsx scripts/import-members.ts <file_path.xlsx> <church_id>");
    console.log("\nExample:");
    console.log("  npx tsx scripts/import-members.ts ./data/members.xlsx cm12345678");
    process.exit(0);
}
var filePathArg = args[0], churchIdArg = args[1];
importMembers(filePathArg, churchIdArg)
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
