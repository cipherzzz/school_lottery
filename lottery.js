var Eos = require('eosjs') // Eos = require('./src')
// eos = Eos({
//     keyProvider:['5HzMHNo92XxE9vHbZ9EeVuXRwosUWGLHXvM1FkdBSiUPT2i9J9E'],
//     httpEndpoint:'http://127.0.0.1:8888'
//     })


Eos = require('eosjs') // Eos = require('./src')

eos = Eos({
    keyProvider:['5JbAcWZBNr3Jo5mfDB5JRbzCrNx8CkW7FrBb8qQZgtv3CvQwiVq','5JQJzCcY7Y3Pu789xJmSZeorkJKAuvfZPUHXkJmgAjUH8UxEfhx'],
    httpEndpoint:'http://127.0.0.1:8888'
    })  

//   const options = {
//     broadcast: true,
//     sign: true,
//     scope: [
//       "parent"
//     ],
//     authorization: [{
//       "account": "parent",
//       "permission": "active"
//     }]
//   }

//     eos
//     .contract('lottery.code')
//     .then((lottery) => {
//       lottery.getstudents({"account": "parent"})
//     })


eos.transaction({
    actions: [
      {
        account: 'lottery.code',
        name: 'getstudents',
        authorization: [{
          actor: 'parent',
          permission: 'active'
        }],
        data: {
          account: 'parent',
        }
      }
    ]
  }).then((result)=>{console.log(result)})


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



