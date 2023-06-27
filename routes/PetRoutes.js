const router = require('express').Router()

const PetController = require('../controllers/PetController')

const verifyToken = require('../helpers/check-token')

router.post(
  '/create',
  verifyToken,
  PetController.create,
)
router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets)


module.exports = router
