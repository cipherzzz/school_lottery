import React, { Component } from "react";

import "./App.css";
import "./css/pure-min.css";

export default class Parent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            grade: '',
            ssn: '',
            }
    }

    componentWillReceiveProps(newProps) {
        this.stateFromProps(newProps)
    }

    stateFromProps(props){
        if(props.child) {
            this.setState({
                firstName: props.child.firstname,
                lastName: props.child.lastname,
                grade: props.child.grade,
                ssn: props.child.ssn,
                })
        } else {
            this.setState({
                firstName: "",
                lastName: "",
                grade: "",
                ssn: "",
                })
        }
    }

    childFromState(){
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

     onDelete() {
        this.props.onDelete(this.childFromState())
    }
    
    onSave() {
        if(this.state.firstName && this.state.lastName && this.state.grade && this.state.ssn) {
            this.props.onSave(this.childFromState())
        }
        
    }


    renderChild(child){
        return (
        <tr key={child.ssn}>
            <td>{child.firstname}</td>
            <td>{child.lastname}</td>
            <td>{child.grade}</td>
            <td>{child.ssn}</td>
            <td>
                <button
                        className="pure-button pure-button-small"
                        onClick={()=>{this.props.onSelectChild(child)}}>Update</button> 
                &nbsp;&nbsp;
                <button
                        className="pure-button pure-button-small"
                        onClick={()=>{this.props.onDelete(child)}}>Delete</button> 
            </td>
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

    render() {

        let children = []
        let data = this.props.children ? this.props.children : []
        data.forEach(child => {
            children.push(this.renderChild(child))    
        })

        let grades = []
        let gradeList = this.props.grades ? this.props.grades : []
        gradeList.forEach(grade => {
            grades.push(this.renderGrade(grade))    
        })
        grades.unshift(<option key={' '}></option>)

        return (
        <div>    
        <h2>Parent</h2>
        <table className="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th>First</th>
                    <th>Last</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Zip</th>
                </tr>
            </thead>
        
            <tbody>
                <tr>
                    <td>{this.props.identity.personal.firstname}</td>
                    <td>{this.props.identity.personal.lastname}</td>
                    <td>{this.props.identity.location.address}</td>
                    <td>{this.props.identity.location.city}</td>
                    <td>{this.props.identity.location.state}</td>
                    <td>{this.props.identity.location.zipcode}</td>
                </tr>
            </tbody>
        </table>
        <h2>Students</h2>
        <table className="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th>First</th>
                    <th>Last</th>
                    <th>Grade</th>
                    <th>SSN</th>
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
            onClick={()=>{this.props.onSelectChild(null)}}>Add Child
        </button>
        <br />
        <hr />
        <br />                  
        <h2>Add/Edit Child</h2>
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
                    <input id="ssn" type="text" placeholder="Last 4 of child's social"
                        onChange={this.onChangeSSN.bind(this)}
                        value={this.state.ssn}
                        />
                        {this.renderRequiredField("ssnValid")}
                </div>

                <div className="pure-controls">
                    <button
                        className="pure-button pure-button-primary"
                        onClick={this.onSave.bind(this)}>Save</button>
                        &nbsp;&nbsp;   
                </div>
            </fieldset>
        </div>
        </div>
        )
    }
}