const { Router } = require('express')
const router = Router();

router.get('/', (req, res) => {
  res.render('home', {title: 'Home'});
});

module.exports = router;