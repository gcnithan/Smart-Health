// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Basic CRUD routes
router.post('/', userController.createUser);           // POST /api/users
router.get('/', userController.getAllUsers);           // GET /api/users
router.get('/:id', userController.getUserById);        // GET /api/users/:id
router.put('/:id', userController.updateUser);         // PUT /api/users/:id
router.delete('/:id', userController.deleteUser);      // DELETE /api/users/:id

// Additional utility routes
router.get('/search/:term', userController.searchUsers);              // GET /api/users/search/:term
router.get('/location/:district', userController.getUsersByLocation);  // GET /api/users/location/:district

// User status management
router.patch('/:id/activate', userController.activateUser);      // PATCH /api/users/:id/activate
router.patch('/:id/deactivate', userController.deactivateUser);  // PATCH /api/users/:id/deactivate

module.exports = router;

// Usage in your main app.js:
/*
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
*/