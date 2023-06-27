const mongoose = require('mongoose')

async function main() {
  await mongoose.connect(process.env.URL_DB)
  console.log('Conectou com Mongoose!')
}

main().catch((err) => console.log(err))

module.exports = mongoose