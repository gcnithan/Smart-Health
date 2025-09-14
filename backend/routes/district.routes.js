// routes/district.routes.js
const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

// Basic CRUD routes
router.post('/', districtController.createDistrict);           // POST /api/districts
router.get('/', districtController.getAllDistricts);           // GET /api/districts
router.get('/stats', districtController.getDistrictStats);     // GET /api/districts/stats
router.get('/search/:term', districtController.searchDistricts); // GET /api/districts/search/:term
router.get('/:id', districtController.getDistrictById);        // GET /api/districts/:id
router.put('/:id', districtController.updateDistrict);         // PUT /api/districts/:id
router.delete('/:id', districtController.deleteDistrict);      // DELETE /api/districts/:id

// Status management routes
router.patch('/:id/activate', districtController.activateDistrict);      // PATCH /api/districts/:id/activate
router.patch('/:id/deactivate', districtController.deactivateDistrict);  // PATCH /api/districts/:id/deactivate
router.patch('/:id/archive', districtController.archiveDistrict);        // PATCH /api/districts/:id/archive

module.exports = router;
