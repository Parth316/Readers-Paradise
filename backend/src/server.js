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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const User_1 = __importDefault(require("../User")); // Adjust the path and extension as needed
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Connect to MongoDB
const uri = "mongodb+srv://parthprajapati316:Parth%40123@clustermain.gmnmr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMain";
mongoose_1.default.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
// Routes
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const newUser = new User_1.default({ email, password });
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.send(error);
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        // Check if the user exists
        const user = yield User_1.default.findOne({ email });
        console.log(user);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Compare password
        const isMatch = yield user.comparePassword(password);
        console.log(isMatch);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Success response
        res.json({ message: 'User authenticated successfully' });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.get("/api/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q; // Search query from frontend
    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    try {
        const response = yield axios_1.default.get(`https://openlibrary.org/search.json?q=${query}`);
        res.json(response.data); // Send the data to the frontend
    }
    catch (error) {
        console.error("Error fetching data from Open Library API:", error);
        res.status(500).json({ error: "Failed to fetch data from Open Library API" });
    }
}));
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
