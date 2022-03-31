const express=require('express');
const router=express.Router();

const controllers=require('../controllers/main');

router.get('/',controllers.getMain);
router.get('/sermon/:id',controllers.getSermon);

router.get('/upload',controllers.getUpload)
router.post('/upload',controllers.postUpload)

router.get('/edit/:id',controllers.getUpdate);
router.post('/edit/:id',controllers.postUpdate);

router.get('/delete/:id',controllers.getDelete);
router.post('/delete/:id',controllers.postDelete);

router.get('/api/main',controllers.getApiMain)
router.get('/api/sermon/:id',controllers.getApiSermon)
module.exports=router;
