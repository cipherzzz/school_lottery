import React, { Component } from 'react'
import Eos from 'eosjs'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './app.css'

import School from './school'
import Student from './student'
import Grade from './grade'
import Network from "./network"

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
      selectedStudent: null
    }
  }

  componentDidMount() {

    document.addEventListener('scatterLoaded', scatterExtension => {
      const scatter = window.scatter;
      window.scatter = null;
      this.setState({scatter});

      const eos = scatter.eos( network, Eos, eosOptions, "http")
      this.setState({eos})
      this.network = new Network(eos)
      this.network.init()

      this.getSchools()
  })
  }

  async getSchools() {
    this.setState({schools: await this.network.getSchools()})
  }

  modifySchool(school, name) {
    this.network.modifySchool(school, name)
  }

  createSchool(name) {
    this.network.createSchool(name)
  }

  deleteSchool(school) {
    this.network.deleteSchool(school)
  }

  saveStudent(student, grade) {
    this.network.saveStudent(student, grade)
  }

  updateStudent(student) {
    this.network.updateStudent(student)
  }

  deleteStudent(student) {
    this.network.deleteStudent(student)
  }

  saveGrade(school, gradeInfo) {
    this.network.saveGrade(school, gradeInfo)
  }

  updateGrade(grade, gradeInfo) {
    this.network.updateGrade(grade, gradeInfo)
  }

  deleteGrade(grade) {
    this.network.deleteGrade(grade)
  }

  setStudent(student) {
    this.setState({selectedStudent: student})
  }

  manageStudents(grade) {
    this.setState({selectedGrade: grade})
  }
  
  updateSchool(school, name) {
    if(school.key !== undefined) {
      this.modifySchool(school, name)
    } else {
      this.createSchool(name)
    }
  }

  setGrade(grade) {
    console.log(JSON.stringify(grade))
    this.setState({selectedGrade: grade})
  }

  editGrade(grade) {
    this.setState({selectedGrade: grade, gradeActionType: 1})
  }

  addGrade(grade) {
    this.setState({selectedGrade: grade, gradeActionType: 0})
  }

  newSchool() {
    this.setState({selectedSchool: {name: ''}})
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
        this.network.setAccount(account)
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
          <a onClick={this.authenticateSuperintendent.bind(this)} style={{float: "right", cursor: "pointer"}} className="pure-menu-heading pure-menu-button">Login as Admin</a>
        </div>  
      )
    } else {
      return (
        <div>
          <a href="#" className="pure-menu-heading pure-menu-link">School Lottery</a>
          <a onClick={this.logout.bind(this)} style={{float: "right", cursor: "pointer"}} className="pure-menu-heading pure-menu-button">Logout</a>
          <div style={{float: "right", color: 'white'}} className="pure-menu-heading pure-menu-button"><i>{this.state.identity.personal.firstname + " " + this.state.identity.personal.lastname}</i></div>
        </div>
      )
    }
  }


  renderUserView() {
    console.log("render user view:"+this.state.userType, this.state.selectedGrade)
    if(this.state.userType === 1 && this.state.selectedGrade) {
      return (
      <Student 
        eos={this.state.eos}
        school={this.state.selectedSchool}
        grade={this.state.selectedGrade}
        network={this.network}
        student={this.state.selectedStudent}
        onSave={(student, grade)=>{this.saveStudent(student, grade)}}
        onUpdate={(student)=>{this.updateStudent(student)}}
        onDelete={(student)=>{this.deleteStudent(student)}}
        onSelectStudent={(student)=>{this.setStudent(student)}}
        />
      )
    } else if(this.state.userType === 0) {
      return (
      <Grade 
        updateType={this.state.gradeActionType}
        grade={this.state.selectedGrade}
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
                    <li><b>Parent</b> - Inputs parent/student information</li>
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
        network={this.network}
        school={this.state.selectedSchool}
        isAdmin={this.state.userType === 0}
        onManageStudents={(grade)=>{this.manageStudents(grade)}}
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
