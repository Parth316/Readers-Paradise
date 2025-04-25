declare namespace NodeJS {
    interface ProcessEnv {
        MONGODB_URI: string;
        JWT_SECRET: string;
        email: string;
        password: string;
    }
}