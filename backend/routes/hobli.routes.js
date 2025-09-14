// routes/hobli.routes.js
const express = require('express');
const router = express.Router();
const hobliController = require('../controllers/hobliController');

// Basic CRUD routes
router.post('/', hobliController.createHobli);                    // POST /api/hoblis
router.get('/', hobliController.getAllHoblis);                    // GET /api/hoblis
router.get('/stats', hobliController.getHobliStats);              // GET /api/hoblis/stats
router.get('/search/:term', hobliController.searchHoblis);        // GET /api/hoblis/search/:term
router.get('/district/:districtId', hobliController.getHoblisByDistrict); // GET /api/hoblis/district/:districtId
router.get('/taluk/:talukId', hobliController.getHoblisByTaluk);  // GET /api/hoblis/taluk/:talukId
router.get('/:id', hobliController.getHobliById);                 // GET /api/hoblis/:id
router.put('/:id', hobliController.updateHobli);                  // PUT /api/hoblis/:id
router.delete('/:id', hobliController.deleteHobli);               // DELETE /api/hoblis/:id

// Status management routes
router.patch('/:id/activate', hobliController.activateHobli);      // PATCH /api/hoblis/:id/activate
router.patch('/:id/deactivate', hobliController.deactivateHobli);  // PATCH /api/hoblis/:id/deactivate
router.patch('/:id/archive', hobliController.archiveHobli);        // PATCH /api/hoblis/:id/archive

module.exports = router;
