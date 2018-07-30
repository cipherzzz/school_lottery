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
            ...this.stateFromStudent(props.child),
            ...{students: this.getStudents(props.grade.key)}
            }
    }

    getStudents(grade_id) {
        this.props.eos.getTableRows({
          "json": true,
          "scope": 'lottery.code',
          "code": 'lottery.code',
          "table": "student",
          "table_key": 'grade_key',
        }).then(result => {
          const filteredRows = result.rows.filter((student)=> student.gradefk === grade_id)  
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
            gradefk: this.props.child.gradefk,
            key: this.props.child.key
        }
    }

    stateFromStudent(student){
        if(!student){
            return {
                firstName: '',
                lastName: '',
                grade: '',
                ssn: '',
            }
        }

        return {
            firstName: student.firstname,
            lastName: student.lastname,
            grade: student.grade_num,
            ssn: student.ssn,
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
        if(this.state.firstName === '' || this.state.lastName === '' || this.props.grade.grade_num === ''
        || this.state.ssn === '') {
            return false
        } else {
            return true
        }
    }

    onSave() {
        if(this.isValid()) {
            this.props.onSave(this.studentFromState(), this.props.grade)
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
        console.log("updateType: "+this.state.updateType)
        if(this.state.updateType === -1) {
            return <div />
        } else  {
            let action = this.onSave
            let title = 'Add Student'
            if(this.state.updateType === 1) {
                action = this.onUpdate
                title = 'Update Student'
            }


            return (
                <div>
                    <h2>{title}</h2>
                    <p>Enter your child's information</p>
                    <div className="pure-form pure-form-aligned">
                        <fieldset>
                            <div className="pure-control-group">
                                <label htmlFor="name">School</label>
                                <input id="school" type="text" placeholder="Child's school"
                                    value={this.props.school.name}
                                    disabled={true}
                                    />
                            </div>
                            <div className="pure-control-group">
                                <label htmlFor="name">Grade</label>
                                <input id="grade" type="text" placeholder="Child's grade"
                                    value={this.props.grade.grade_num}
                                    disabled={true}
                                    />
                            </div>
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
                                <label htmlFor="name">SSN</label>
                                <input 
                                    id="ssn" 
                                    type="text" 
                                    placeholder="Last 4 of child's social"
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
        <div className="pure-g">    
        <div className="pure-u-1-2">    
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
        </div>
        <div className="pure-u-1-2">
        {this.renderStudentForm()} 
        </div>                
        </div>
        )
    }
}