const express=require('express');
const router=express.Router();

const controllers=require('../controllers/main');

router.get('/',controllers.getMain);
router.get('/sermon/:id',controllers.getSermon);

router.get('/upload',controllers.getUpload)
router.post('/upload',controllers.postUpload)

module.exports=router;
