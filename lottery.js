var Eos = require('eosjs') // Eos = require('./src')
// eos = Eos({
//     keyProvider:['5HzMHNo92XxE9vHbZ9EeVuXRwosUWGLHXvM1FkdBSiUPT2i9J9E'],
//     httpEndpoint:'http://127.0.0.1:8888'
//     })


Eos = require('eosjs') 

eos = Eos({
    keyProvider:[
        '5HzMHNo92XxE9vHbZ9EeVuXRwosUWGLHXvM1FkdBSiUPT2i9J9E',
        "5KDMeU7WZKfgR58xs5yq5j7ujrPyr5qsJvmBpZiv71a5Znuwwdf",
        "5JQJzCcY7Y3Pu789xJmSZeorkJKAuvfZPUHXkJmgAjUH8UxEfhx"
        ],
    httpEndpoint:'http://127.0.0.1:8888'
    }) 

eos.contract('lottery.code').then(contract => {
    const options = { authorization: [ `parent@active` ] };
    contract.getgrades(`parent`, options)
}).catch(error => console.log(error));    

// eos.transaction({
//     actions: [
//       {
//         account: 'test.code',
//         name: 'testaction',
//         authorization: [{
//           actor: 'test.code',
//           permission: 'active'
//         }],
//         data: {
//           account: 'test.code',
//         }
//       }
//     ]
//   }).then((result)=>{console.log(result)})     

//   const options = {
//     account: "test.code",  
//     broadcast: true,
//     sign: true,
//     scope: [
//       "test.code"
//     ],
//     authorization: [{
//       "actor": "test.code",
//       "permission": "active"
//     }]
//   }

//     eos
//     .contract('test.code')
//     .then((lottery) => {
//       lottery.testaction({"account": "test.code"})
//     })


// eos.transaction({
//     actions: [
//       {
//         account: 'admin',
//         name: 'getstudents',
//         authorization: [{
//           actor: 'parent',
//           permission: 'active'
//         }],
//         data: {
//           account: 'parent',
//         }
//       }
//     ]
//   }).then((result)=>{console.log(result)})




//   eos.getTableRows({
//     "json": true,
//     "scope": 'lottery.code',
//     "code": 'lottery.code',
//     "table": "grade",
//     "limit": 500
// }).then(result => {
//     console.log(result)
// })

    // eos.getCurrencyBalance();

    //eos.getCurrencyBalance('parent', 'eosio');
    //eos.getCurrencyBalance({code: 'SYS', account: 'lottery.code'})

// Run with no arguments to print usage.
// eos.transfer()

// // Usage with options (options are always optional)
// options = {broadcast: false}

// eos.transfer({from: 'inita', to: 'initb', quantity: '1 SYS', memo: ''}, options)

// // Object or ordered args may be used.
// eos.transfer('parent', 'admin', '2 SYS', 'memo', options).then((result)=>{console.log(JSON.stringify(result))})

// // A broadcast boolean may be provided as a shortcut for {broadcast: false}
// eos.transfer('admin', 'parent', '1 SYS', '', false)



