const router = require('express').Router()

const PetController = require('../controllers/PetController')

const verifyToken = require('../helpers/check-token')

router.post(
  '/create',
  verifyToken,
  PetController.create,
)
router.get('/', PetController.getAll)


module.exports = router
