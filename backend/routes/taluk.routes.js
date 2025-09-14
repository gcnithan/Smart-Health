// routes/taluk.routes.js
const express = require('express');
const router = express.Router();
const talukController = require('../controllers/talukController');

// Basic CRUD routes
router.post('/', talukController.createTaluk);                    // POST /api/taluks
router.get('/', talukController.getAllTaluks);                    // GET /api/taluks
router.get('/stats', talukController.getTalukStats);              // GET /api/taluks/stats
router.get('/search/:term', talukController.searchTaluks);        // GET /api/taluks/search/:term
router.get('/district/:districtId', talukController.getTaluksByDistrict); // GET /api/taluks/district/:districtId
router.get('/:id', talukController.getTalukById);                 // GET /api/taluks/:id
router.put('/:id', talukController.updateTaluk);                  // PUT /api/taluks/:id
router.delete('/:id', talukController.deleteTaluk);               // DELETE /api/taluks/:id

// Status management routes
router.patch('/:id/activate', talukController.activateTaluk);      // PATCH /api/taluks/:id/activate
router.patch('/:id/deactivate', talukController.deactivateTaluk);  // PATCH /api/taluks/:id/deactivate
router.patch('/:id/archive', talukController.archiveTaluk);        // PATCH /api/taluks/:id/archive

module.exports = router;
