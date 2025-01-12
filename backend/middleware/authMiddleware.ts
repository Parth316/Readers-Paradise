// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ error: 'No token, authorization denied' });
//     }
//     try {
//         const decoded = jwt.verify(token, 'BookTellsStoryOfYourLife');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Token is not valid' });
//     }
// };