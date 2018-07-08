import React, { Component } from 'react'
import Eos from 'eosjs'
//import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
//import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import School from './School'
import Parent from './Parent'
import Superintendent from './Superintendent'

const network = {
  protocol:'http',
  blockchain:'eos',
  host:'127.0.0.1',
  port:8888,
  chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
}
const eosOptions = {broadcast:true, chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'}

class App extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      scatter: null,
      eos: null,
      account: null,
      identity: null,
      grades: [],
      children: [],
      child: null,
      error: null,
      userType: -1 //-1 is unauthorized, 0 is superintendant, 1 is parent
    }
  }

  componentDidMount() {

    document.addEventListener('scatterLoaded', scatterExtension => {
      const scatter = window.scatter;
      window.scatter = null;
      this.setState({scatter});

      const eos = scatter.eos( network, Eos, eosOptions, "http")
      this.setState({eos})
      this.getGrades(eos)
      this.getChildren()
  })
  }

  getGrades(eos) {
    eos.getTableRows({
      "json": true,
      "scope": 'lottery.code',
      "code": 'lottery.code',
      "table": "grade",
      "limit": 13
    }).then(result => {
      console.log(result)
      this.setState({grades: result.rows})
    }).catch((error) =>{
      this.setState(error)
    })
  }

  getChildren() {
    this.state.eos.getTableRows({
        "json": true,
        "scope": 'lottery.code',
        "code": 'lottery.code',
        "table": "student",
      }).then(result => {
          this.setState({children: result.rows})
      }).catch((error) =>{
          this.setState(error)
      })
}

  saveChild(child) {
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            // void addstudent(const account_name account, uint64_t ssn, string firstname, string lastname, uint64_t grade) {
            contract
            .addstudent(account.name, child.ssn, child.firstname, child.lastname, child.grade, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.getChildren()
              this.setChild(null)  
            })
            .catch(error => console.log("caught addstudent error: "+error))
          }).catch(error => console.log(error));
  }

  deleteChild(child) {
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            contract
            .remstudent(account.name, child.ssn, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.getChildren()
              this.setChild(null) 
            })
            .catch(error => console.log("caught addstudent error: "+error))
          }).catch(error => console.log(error));
  }

  setChild(child) {
    this.setState({child})
  }

  authenticateParent(){
    this.loadScatterIdentity(true)
  }

  authenticateSuperintendent(){
    this.loadScatterIdentity(false)
  }

  logout() {
    this.state.scatter.forgetIdentity().then(() => {
      this.setState({userType: -1})
  });
  }

  loadScatterIdentity(isParent) {
    
    const requiredFields = {
      personal:['firstname', 'lastname'],
      location:['address', 'city', 'state', 'zipcode', 'phone'],
      accounts:[network]
    };

    this.state.scatter.getIdentity(requiredFields).then(identity => {
      console.log(identity, "identityFound")
      this.setState({identity})

      const account = identity.accounts.find(acc=>acc.blockchain==='eos'); 

      if(account) {
        this.setState({account})
        // We have a valid identity - now we set the user's requested type
        if(isParent === true) {
          this.setState({userType: 1})
        } else {
          this.setState({userType: 0})
        }
      } else {
        throw new Error('Unable to find EOS account')
      }
      
      this.state.eos.contract('lottery.code').then(contract => {
        this.setState({contract})
      }).catch(error => console.log(error)); 

    }).catch(error => {
      console.log(error, "identityCrisis!")
    })
  }

  renderAuthenticateButtons() {
    if(this.state.userType === -1) {
      return (
        <div>
          <button onClick={this.authenticateParent.bind(this)}>Authenticate as Parent with Scatter</button>
          <br/><br/>
          <button onClick={this.authenticateSuperintendent.bind(this)}>Authenticate as Superintendent with Scatter</button>
        </div>  
      )
    } else {
      return <button onClick={this.logout.bind(this)}>Logout</button>
    }
  }


  renderUserView() {
    if(this.state.userType === 1) {
      return (
      <Parent 
        children={this.state.children} 
        grades={this.state.grades}
        child={this.state.child}
        account={this.state.account} 
        identity={this.state.identity}
        onSave={(child)=>{this.saveChild(child)}}
        onDelete={(child)=>{this.deleteChild(child)}}
        onSelectChild={(child)=>{this.setChild(child)}}
        />
      )
    } else if(this.state.userType === 0) {
      return <Superintendent />
    } else {
      return <div/>
    }
  }

  render() {

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">School Lottery</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Trust the System</h1>
              <p>
                This EOS dApp is leveling the playing field for school lottery admissions. 
                The Lake Wogegon public school system has received multiple complaints about unfair admission practices in the
                more popular schools in the district and has created this solution.
                <br/><br/>
                <h3>Roles</h3>
                <ul>
                  <li><b>Superintendent</b> - Inputs total openings per grade, runs lottery</li>
                  <li><b>Parent</b> - Inputs parent/child information</li>
                </ul>
                <School name="Lake Wobegon Elementary" grades={this.state.grades}/>
              </p>
              {this.renderUserView()}
              <br/><br/>
              {this.renderAuthenticateButtons()}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
