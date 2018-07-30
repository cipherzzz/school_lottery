import React, { Component } from "react";

import "./App.css";
import "./css/pure-min.css";

export default class Parent extends Component {

    constructor(props) {
        super(props)
        this.state = this.stateFromProps(props)
    }

    componentWillReceiveProps(newProps) {
        if(newProps !== this.props) {
            this.setState(this.stateFromProps(newProps))
        }
    }

    stateFromProps(props){
        return {
            firstName: '',
            lastName: '',
            grade: '',
            ssn: '',
            updateType: -1,
            students: this.getStudents(props.grade.key)
            }
    }

    getStudents(grade_id) {
        this.props.eos.getTableRows({
          "json": true,
          "scope": 'lottery.code',
          "code": 'lottery.code',
          "table": "student",
          "table_key": 'grade_key',
          "lower_bound": grade_id,
        }).then(result => {
          const filteredRows = result.rows.filter((student)=> student.gradefk === grade_id)  
          console.log(JSON.stringify(filteredRows))
          this.setState({students: filteredRows})
        }).catch((error) =>{
          this.setState(error)
        })
      }

    studentFromState(){
        return {
            firstname: this.state.firstName,
            lastname: this.state.lastName,
            grade_num: this.state.grade,
            ssn: this.state.ssn,
        }
    }

    onChangeFirstName(e) {
        this.setState({ firstName: e.target.value,
            firstNameValid: e.target.value !== '' });
    }

    onChangeLastName(e) {
        this.setState({ lastName: e.target.value,
            lastNameValid: e.target.value !== '' });
    }

    onChangeGrade(e) {
        this.setState({ grade: e.target.value,
            gradeValid: e.target.value !== '' });
    }

    onChangeSSN(e) {
        this.setState({ ssn: e.target.value,
            ssnValid: e.target.value !== '' });
    }

     onDelete(child) {
        this.props.onDelete(child)
        this.setState({updateType: -1})
    }
    
    isValid() {
        if(this.state.firstName === '' || this.state.lastName === '' || this.state.grade === ''
        || this.state.ssn === '') {
            return false
        } else {
            return true
        }
    }

    onSave() {
        if(this.isValid()) {
            this.props.onSave(this.studentFromState())
        } 
    }

    onUpdate() {
        if(this.isValid()) {
            this.props.onUpdate(this.studentFromState())
        } 
    }

    onAddForm() {
        this.setState({updateType: 0})
        this.props.onSelectChild(null) 
    }

    onUpdateForm(child) {
        this.setState({updateType: 1})
        this.props.onSelectChild(child) 
    }


    renderStudent(child){
        let actionView = <td>
            <button
                    className="pure-button pure-button-small"
                    onClick={()=>{}}>Email School</button>
        </td>
        if(child.result === 0) {
            actionView = <td>
            <button
                    className="pure-button pure-button-small"
                    onClick={()=>{this.onUpdateForm(child)}}>Update</button> 
            &nbsp;&nbsp;
            <button
                    className="pure-button pure-button-small"
                    onClick={()=>{this.onDelete(child)}}>Delete</button> 
        </td>
        }
        return (
        <tr key={child.ssn}>
            <td>{child.firstname}</td>
            <td>{child.lastname}</td>
            <td>{child.grade}</td>
            <td>{child.ssn}</td>
            <td>{child.result}</td>
            {actionView}
        </tr>)   
    }

    renderGrade(grade) {
        return <option key={grade.grade_num} value={grade.grade_num}>{grade.grade_num}</option>
    }

    renderRequiredField(key){
        if(this.state[key] === true) {
            return <div />
        } else {
            return <span className="pure-form-message-inline">This is a required field.</span>
        }
    }

    renderStudentForm() {
        if(this.state.updateType === -1) {
            return <div />
        } else  {

            let grades = []
            let gradeList = this.props.grades ? this.props.grades : []
            gradeList.forEach(grade => {
                grades.push(this.renderGrade(grade))    
            })
            grades.unshift(<option key={' '}></option>)

            let action = this.onSave
            let title = 'Add Child'
            if(this.state.updateType === 1) {
                action = this.onUpdate
                title = 'Update Child'
            }


            return (
                <div>
                    <h2>{title}</h2>
                    <p>Enter your child's information</p>
                    <div className="pure-form pure-form-aligned">
                        <fieldset>
                            <div className="pure-control-group">
                                <label htmlFor="name">First Name</label>
                                <input id="firstName" type="text" placeholder="Child's first name"
                                    value={this.state.firstName}
                                    onChange={this.onChangeFirstName.bind(this)}
                                    />
                                    {this.renderRequiredField("firstNameValid")}
                            </div>

                            <div className="pure-control-group">
                                <label htmlFor="name">Last Name</label>
                                <input id="lastName" type="text" placeholder="Child's last name"
                                    value={this.state.lastName}
                                    onChange={this.onChangeLastName.bind(this)} 
                                    />
                                    {this.renderRequiredField("lastNameValid")}
                            </div>

                            <div className="pure-control-group">
                                <label htmlFor="name">Grade</label>
                                    <select id="state"
                                    value={this.state.grade}
                                    onChange={this.onChangeGrade.bind(this)}>
                                    {grades}
                            </select>   
                            {this.renderRequiredField("gradeValid")} 
                            </div>

                            <div className="pure-control-group">
                                <label htmlFor="name">SSN</label>
                                <input 
                                    id="ssn" 
                                    type="text" 
                                    placeholder="Last 4 of child's social"
                                    disabled={this.state.updateType === 1}
                                    onChange={this.onChangeSSN.bind(this)}
                                    value={this.state.ssn}
                                    />
                                    {this.renderRequiredField("ssnValid")}
                            </div>

                            <div className="pure-controls">
                                <button
                                    disabled={!this.isValid()}
                                    className="pure-button pure-button-primary"
                                    onClick={action.bind(this)}>Save</button>
                                    &nbsp;&nbsp;   
                            </div>
                        </fieldset>
                    </div>
                </div>
            )
        }
    }

    render() {

        let children = []
        let data = this.state.students ? this.state.students : []
        data.forEach(child => {
            children.push(this.renderStudent(child))    
        })

        return (
        <div>    
        <h2>Students</h2>
        <table className="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th>First</th>
                    <th>Last</th>
                    <th>Grade</th>
                    <th>SSN</th>
                    <th>Placement</th>
                    <th>Action</th>
                </tr>
            </thead>
        
            <tbody>
                {children}
            </tbody>
        </table>
        <br />
        <button
            className="pure-button pure-button-primary"
            onClick={()=>{this.onAddForm()}}>Add Child
        </button>
        <br />
        <hr />
        <br /> 
        {this.renderStudentForm()}                 
        </div>
        )
    }
}