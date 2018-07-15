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
import Headmaster from './Headmaster'

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
            .addstudent(account.name, child.ssn, child.firstname, child.lastname, child.grade_num, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.getChildren()
              this.setChild(null)  
            })
            .catch(error => console.log("caught addstudent error: "+error))
          }).catch(error => console.log(error));
  }

  updateChild(child) {
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            // void addstudent(const account_name account, uint64_t ssn, string firstname, string lastname, uint64_t grade) {
            contract
            .updatechild(account.name, child.ssn, child.firstname, child.lastname, child.grade_num, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.getChildren()
              this.setChild(null)  
            })
            .catch(error => console.log("caught updatestudent error: "+error))
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
            .catch(error => console.log("caught remstudent error: "+error))
          }).catch(error => console.log(error));
  }

  setChild(child) {
    this.setState({child})
  }

  saveGrade(grade) {
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            // void addgrade(const account_name account, uint64_t grade_num, uint64_t openings) {
            contract
            .addgrade(account.name, grade.grade_num, grade.openings, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.setGrade(null)  
            })
            .catch(error => console.log("caught addgrade error: "+error))
          }).catch(error => console.log(error));
  }

  updateGrade(grade) {
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            // void updategrade(const account_name account, uint64_t grade_num, uint64_t openings) {
            contract
            .updategrade(account.name, grade.grade_num, grade.openings, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.setGrade(null)  
            })
            .catch(error => console.log("caught updategrade error: "+error))
          }).catch(error => console.log(error));
  }

  deleteGrade(grade) {
    const account = this.state.account
    // void remgrade(const account_name account, const uint64_t grade_num) {
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            contract
            .remgrade(account.name, grade.grade_num, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.setGrade(null) 
            })
            .catch(error => console.log("caught remgrade error: "+error))
          }).catch(error => console.log(error));
  }

  setGrade(grade) {
    this.setState({grade})
  }

  runLottery(){
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            contract
            .runlottery(account.name, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.getChildren()
              this.setGrade(null) 
              this.setChild(null) 
            })
            .catch(error => console.log("caught runlottery error: "+error))
          }).catch(error => console.log(error));
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
    
    let requiredFields = {
      personal:['firstname', 'lastname'],
      location:['address', 'city', 'state', 'zipcode', 'phone'],
      accounts:[network]
    };
    if(!isParent) {
      requiredFields = {
        personal:['firstname', 'lastname'],
        accounts:[network]
      }
    }

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
          <a href="#" className="pure-menu-heading pure-menu-link">School Lottery</a>
          <a onClick={this.authenticateParent.bind(this)} style={{float: "right", cursor: "pointer"}} className="pure-menu-heading pure-menu-button">Login as Parent</a>
          {/* <button onClick={this.authenticateParent.bind(this)}>Authenticate as Parent with Scatter</button> */}
          <a onClick={this.authenticateSuperintendent.bind(this)} style={{float: "right", cursor: "pointer"}} className="pure-menu-heading pure-menu-button">Login as Admin</a>
          {/* <button onClick={this.authenticateSuperintendent.bind(this)}>Authenticate as Superintendent with Scatter</button> */}
        </div>  
      )
    } else {
      return (
        <div>
          <a href="#" className="pure-menu-heading pure-menu-link">School Lottery</a>
          <a onClick={this.logout.bind(this)} style={{float: "right", cursor: "pointer"}} className="pure-menu-heading pure-menu-button">Logout</a>
        </div>
      )
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
        onUpdate={(child)=>{this.updateChild(child)}}
        onDelete={(child)=>{this.deleteChild(child)}}
        onSelectChild={(child)=>{this.setChild(child)}}
        />
      )
    } else if(this.state.userType === 0) {
      return (
      <Headmaster 
        account={this.state.account} 
        identity={this.state.identity}
        grades={this.state.grades}
        grade={this.state.grade}
        onSave={(grade)=>{this.saveGrade(grade)}}
        onUpdate={(grade)=>{this.updateGrade(grade)}}
        onDelete={(grade)=>{this.deleteGrade(grade)}}
        onSelectGrade={(grade)=>{this.setGrade(grade)}}
        />
      )
    } else {
      return <div/>
    }
  }

  renderUnauthenticated() {
    if(this.state.userType === -1) {
      return (
        <div>
                <h1>Trust the System</h1>
                <p>
                  This EOS dApp is leveling the playing field for school lottery admissions. 
                  Hogwarts has received multiple complaints about unfair admission practices to the school of Witchcraft and Wizardry 
                  and has created this solution.
                  <br/><br/>
                  <h3>Roles</h3>
                  <ul>
                    <li><b>Superintendent</b> - Inputs total openings per grade, runs lottery</li>
                    <li><b>Parent</b> - Inputs parent/child information</li>
                  </ul>
                </p>
                </div>
      )
    } else {
      return null
    }
  }

  render() {

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            {this.renderAuthenticateButtons()}
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              {this.renderUnauthenticated()}
              <School name="Hogwarts" 
                grades={this.state.grades} 
                isAdmin={this.state.userType === 0}
                onRunLottery={()=>{this.runLottery()}}
              />
              <hr />
              {this.renderUserView()}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
