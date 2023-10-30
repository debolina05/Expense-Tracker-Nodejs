const {Router}=require('express');
const { updatePasswordControllers } = require('../controllers/updatePassword');
const router=Router()

router.post('/',updatePasswordControllers);

module.exports=router;