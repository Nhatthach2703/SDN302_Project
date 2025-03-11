// exports.isAuthenticated = async (req, res, next) => {
//     try {
//         console.log('o day');
//         if (req.cookies.username) {
//             console.log('o day 22');
//             next(); 
//         } else {
//             res.status(401).json({
//                 message: 'You are not authenticated. Please login or signup',
//                 nextSteps: {
//                     login: 'users/login',
//                     signup: 'users/signup'
//         }})}
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// exports.isAuthenticated_Session = async (req, res, next) => {
//     try {
//         if (req.session.userId) {
//             next();
//         } else {
//             res.status(401).json({
//                 message: 'You are not authenticated. Please login or signup',
//                 nextSteps: {
//                     login: '/users/login', 
//                     signup: '/users/signup' // Clients can use this router to redirect to the signup page
//         }})}
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// }

