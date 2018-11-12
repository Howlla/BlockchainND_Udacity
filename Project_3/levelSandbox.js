const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

//REFACTOR TO PROMISE
const addLevelDBData = (key, value) => {
  return (new Promise((resolve, reject) => {
    db.put(key, value, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  }))
}

//REFACTOR TO PROMISE
const getLevelDBData = (key) =>{
  return (new Promise ((resolve,reject) => {
    db.get(key, ( err,val ) =>{
      if(err){
        reject(err)
      }
      else{
        resolve(JSON.parse(val))
      }
    })
  }))
}

//REFACTOR TO PROMISE
const addDataToLevelDB = (value) =>{
  let i = 0;
  db.createReadStream()
  .on('data', (data) => { i++ })
  .on('error', (err) => console.log('Unable to read data stream!', err))
  .on('close', () => {
    console.log('Block #' + i)
    addLevelDBData(i, value)
  })
}

const getAllLevelDBData = () => new Promise((resolve, reject) => {
  let dataArray = []
  db.createValueStream()
    .on('data', (data) => {
      dataArray.push(data)
    })
    .on('error', (err) => {
      reject(err)
    })
    .on('close', () => {
      //sorted by height
      resolve(dataArray.map(i => JSON.parse(i)).sort((a, b) => a.height - b.height));
    })
})

module.exports = {
  addLevelDBData,
  getLevelDBData,
  addDataToLevelDB,
  getAllLevelDBData
}