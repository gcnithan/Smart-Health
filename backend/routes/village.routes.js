// routes/village.routes.js
const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');

// Basic CRUD routes
router.post('/', villageController.createVillage);                    // POST /api/villages
router.get('/', villageController.getAllVillages);                    // GET /api/villages
router.get('/stats', villageController.getVillageStats);              // GET /api/villages/stats
router.get('/search/:term', villageController.searchVillages);        // GET /api/villages/search/:term
router.get('/code/:code', villageController.getVillageByCode);        // GET /api/villages/code/:code
router.get('/district/:districtId', villageController.getVillagesByDistrict); // GET /api/villages/district/:districtId
router.get('/taluk/:talukId', villageController.getVillagesByTaluk);  // GET /api/villages/taluk/:talukId
router.get('/hobli/:hobliId', villageController.getVillagesByHobli);  // GET /api/villages/hobli/:hobliId
router.get('/:id', villageController.getVillageById);                 // GET /api/villages/:id
router.put('/:id', villageController.updateVillage);                  // PUT /api/villages/:id
router.delete('/:id', villageController.deleteVillage);               // DELETE /api/villages/:id

// Status management routes
router.patch('/:id/activate', villageController.activateVillage);      // PATCH /api/villages/:id/activate
router.patch('/:id/deactivate', villageController.deactivateVillage);  // PATCH /api/villages/:id/deactivate
router.patch('/:id/archive', villageController.archiveVillage);        // PATCH /api/villages/:id/archive

module.exports = router;
