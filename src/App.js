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
import Grade from './Grade'

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
      schools: [],
      error: null,
      userType: -1, //-1 is unauthorized, 0 is superintendant, 1 is parent
      gradeActionType: -1, //-1 is none, 0 is add, 1 is edit
      selectedSchool: null,
      selectedGrade: null,
      selectedChild: null
    }
  }

  componentDidMount() {

    document.addEventListener('scatterLoaded', scatterExtension => {
      const scatter = window.scatter;
      window.scatter = null;
      this.setState({scatter});

      const eos = scatter.eos( network, Eos, eosOptions, "http")
      this.setState({eos})
      this.getSchools(eos)
  })
  }

  getSchools(eos) {
    eos.getTableRows({
      "json": true,
      "scope": "lottery.code",
      "code": 'lottery.code',
      "table": "school"
    }).then(result => {
      console.log(result)
      this.setState({schools: result.rows})
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

manageChildren(grade) {
  this.setState({selectedGrade: grade})
}

updateSchool(school, name) {
  if(school.key) {
    this.modifySchool(school, name)
  } else {
    this.createSchool(name)
  }
}

modifySchool(school, name) {
  console.log(school.key, name)
  const account = this.state.account
  this.state.eos.contract('lottery.code').then(contract => {
          const options = { authorization: [ account.name+'@'+account.authority ] };
          contract
          .updateschool(account.name, school.key, name, options)
          .then(() => { 
            // this.getGrades()
            // this.setGrade(null)  
          })
          .catch(error => console.log("caught updateschool error: "+error))
        }).catch(error => console.log(error));
}

createSchool(name) {
  const account = this.state.account
  this.state.eos.contract('lottery.code').then(contract => {
          const options = { authorization: [ account.name+'@'+account.authority ] };
          contract
          .addschool(account.name, name, options)
          .then(() => { 
            // this.getGrades()
            // this.setGrade(null)  
          })
          .catch(error => console.log("caught createschool error: "+error))
        }).catch(error => console.log(error));
}

deleteSchool(school) {
  const account = this.state.account
  this.state.eos.contract('lottery.code').then(contract => {
          const options = { authorization: [ account.name+'@'+account.authority ] };
          contract
          .remschool(account.name, school.key, options)
          .then(() => { 
            // this.getGrades()
            // this.setGrade(null)  
          })
          .catch(error => console.log("caught removeschool error: "+error))
        }).catch(error => console.log(error));
}

  saveChild(child, grade) {
    console.log(grade)
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            // void addstudent(const account_name account, uint64_t ssn, string firstname, string lastname, uint64_t grade) {
            contract
            .addstudent(account.name, grade.key, child.ssn, child.firstname, child.lastname, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.getChildren()
              this.setChild(null)  
            })
            .catch(error => console.log("caught addstudent error: "+error))
          }).catch(error => console.log(error));
  }

  updateChild(child) {
    console.log(child.key, child.ssn, child.firstname, child.lastname, child.gradefk)
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            // void addstudent(const account_name account, uint64_t ssn, string firstname, string lastname, uint64_t grade) {
            contract
            .updatestuden(account.name, child.key, child.ssn, child.firstname, child.lastname, child.gradefk, options)
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
            .remstudent(account.name, child.key, options)
            .then(() => { 
              this.getGrades(this.state.eos)
              this.getChildren()
              this.setChild(null) 
            })
            .catch(error => console.log("caught remstudent error: "+error))
          }).catch(error => console.log(error));
  }

  setChild(child) {
    this.setState({selectedChild: child})
  }

  saveGrade(school, gradeInfo) {
    console.log(school.key, gradeInfo.grade_num, gradeInfo.openings)
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            contract
            .addgrade(account.name, school.key, Number(gradeInfo.grade_num), Number(gradeInfo.openings), options)
            .then(() => { 
              // this.getGrades()
              // this.setGrade(null)  
            })
            .catch(error => console.log("caught addgrade error: "+error))
          }).catch(error => console.log(error));
  }

  updateGrade(grade, gradeInfo) {
    console.log(grade.key, gradeInfo.openings)
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            contract
            .updategrade(account.name, grade.key, gradeInfo.openings, options)
            .then(() => { 
              // this.getGrades()
              // this.setGrade(null)  
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
            .remgrade(account.name, grade.key, options)
            .then(() => { 
              this.getGrades()
              this.setGrade(null) 
            })
            .catch(error => console.log("caught remgrade error: "+error))
          }).catch(error => console.log(error));
  }

  setGrade(grade) {
    console.log(JSON.stringify(grade))
    this.setState({grade})
  }

  editGrade(grade) {
    this.setState({grade, gradeActionType: 1})
  }

  addGrade(grade) {
    this.setState({grade, gradeActionType: 0})
  }

  newSchool() {
    this.setState({selectedSchool: {name: ''}})
  }

  runLottery(){
    const account = this.state.account
    this.state.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            contract
            .runlottery(account.name, options)
            .then(() => { 
              this.getGrades()
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
      this.setState({userType: -1, selectedSchool: null, gradeActionType: -1})
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
    if(this.state.userType === 1 && this.state.selectedGrade) {
      return (
      <Parent 
        eos={this.state.eos}
        school={this.state.selectedSchool}
        grade={this.state.selectedGrade}
        child={this.state.selectedChild}
        onSave={(child, grade)=>{this.saveChild(child, grade)}}
        onUpdate={(child)=>{this.updateChild(child)}}
        onDelete={(child)=>{this.deleteChild(child)}}
        onSelectChild={(child)=>{this.setChild(child)}}
        />
      )
    } else if(this.state.userType === 0 && this.state.selectedGrade) {
      return (
      <Grade 
        updateType={this.state.gradeActionType}
        grade={this.state.grade}
        onSave={(gradeInfo)=>{this.saveGrade(this.state.selectedSchool, gradeInfo)}}
        onUpdate={(grade, gradeInfo)=>{this.updateGrade(grade, gradeInfo)}}
        onDelete={(grade)=>{this.deleteGrade(grade)}}
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

  renderSchool(school) {

    let actionView = null
        if(this.state.userType === 0) {
            actionView = <div>
            <button
                    className="pure-button pure-button-xsmall"
                    onClick={()=>{this.setState({selectedSchool: school})}}>Edit</button> 
            &nbsp;&nbsp;
            <button
                    className="pure-button pure-button-xsmall"
                    onClick={()=>{this.deleteSchool(school)}}>Delete</button> 
        </div>
        } else if(this.state.userType === 1) {
          actionView = <button
                    className="pure-button pure-button-xsmall"
                    onClick={()=>{this.setState({selectedSchool: school})}}>Select</button>
        }

    let actionCell = this.state.userType === -1 ? null : <td>{actionView}</td>

    return (
      <tr key={school.key}>
          <td>{school.name}</td>
          <td>{school.status}</td>
          {actionCell}
      </tr>
  )
  }

  renderSelectedSchool() {
    let schoolView = null
    if(this.state.selectedSchool) {
      return (
      <School
        school={this.state.selectedSchool}
        eos={this.state.eos}
        isAdmin={this.state.userType === 0}
        onManageChildren={(grade)=>{this.manageChildren(grade)}}
        onUpdateSchool={(school, name)=>{this.updateSchool(school, name)}}
        onEditGrade={(grade)=>{this.editGrade(grade)}}
        onAddGrade={(grade)=>{this.addGrade(grade)}}
        onDeleteGrade={(grade)=>{this.deleteGrade(grade)}}
      />
      );
    }
    return schoolView
  }

  renderSchools() {

    let schools = []
    this.state.schools.forEach(school => {
      schools.push(this.renderSchool(school))    
    })

    let actionHead = this.state.userType === -1 ? null : <th>Action</th>

    return (
      <table className="pure-table pure-table-horizontal">
        <thead>
            <tr>
                <th>Name</th>
                <th>Status</th>
                {actionHead}
            </tr>
        </thead>
        <tbody>
            {schools}
        </tbody>
      </table>
    )

  }
 
  renderAddSchool(){
    if(this.state.userType === 0) {
        return (
            <button
                className="pure-button pure-button-primary"
                onClick={()=>{this.newSchool()}}>
                Add School
            </button>
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
              <br />
              <div className="pure-g">
                <div className="pure-u-1-2">
                  <h4>Schools</h4>
                  {this.renderSchools()}
                  <br />
                  {this.renderAddSchool()}
                  </div>
                  <div className="pure-u-1-2">
                    {this.renderSelectedSchool()}
                  </div>
                </div>
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
