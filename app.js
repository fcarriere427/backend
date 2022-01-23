const fs = require('fs')

const data = 'This is my Hello World file'

fs.writeFile('info.txt', data, 'utf-8', (err) => {
    console.log('File created')
})
