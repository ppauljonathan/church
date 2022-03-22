const express=require('express');
const router=express.Router();

const controllers=require('../controllers/main');

router.get('/',controllers.getMain);
router.get('/sermon/:id',controllers.getSermon);

module.exports=router;
