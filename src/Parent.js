import React, { Component } from "react";

import "./App.css";
import "./css/pure-min.css";

//<div className="pure-control-group">

export default class Parent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            firstName: null,
            lastName: null,
            grade: null,
            ssn: null
            }
    }

    componentDidMount() {
    
        this.props.eos.getTableRows({
            "json": true,
            "scope": 'lottery.code',
            "code": 'lottery.code',
            "table": "student",
            "limit": 1
          }).then(result => {
            console.log(result)
            if(result.rows.length === 1) {
                const child = result.rows[0]
                this.setState({firstName: child.firstname,
                                lastName: child.lastname,
                                grade: child.grade,
                                ssn: child.ssn})
            } 
          }).catch((error) =>{
            this.setState(error)
          })
    }

    onChangeFirstName(e) {
        this.setState({ firstName: e.target.value });
    }

    onChangeLastName(e) {
        this.setState({ lastName: e.target.value });
    }

    onChangeGrade(e) {
        this.setState({ grade: e.target.value });
    }

    onChangeSSN(e) {
        this.setState({ ssn: e.target.value });
    }

    onDelete() {
        const account = this.props.account
        this.props.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            contract
            .remstudent(account.name, this.state.ssn, options)
            .catch(error => console.log("caught remstudent error: "+error))
          }).catch(error => console.log(error)); 
    }
    
    onSave() {
        const account = this.props.account
        this.props.eos.contract('lottery.code').then(contract => {
            const options = { authorization: [ account.name+'@'+account.authority ] };
            // void addstudent(const account_name account, uint64_t ssn, string firstname, string lastname, uint64_t grade) {
            contract
            .addstudent(account.name, this.state.ssn, this.state.firstName, this.state.lastName, this.state.grade, options)
            .catch(error => console.log("caught addstudent error: "+error))
          }).catch(error => console.log(error)); 
    }

    render() {

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
                </div>

                <div className="pure-control-group">
                    <label htmlFor="name">Last Name</label>
                    <input id="lastName" type="text" placeholder="Child's last name"
                        value={this.state.lastName}
                        onChange={this.onChangeLastName.bind(this)} 
                        />
                </div>

                <div className="pure-control-group">
                    <label htmlFor="name">Grade</label>
                    <input id="grade" type="text" placeholder="Entering grade"
                        onChange={this.onChangeGrade.bind(this)}
                        value={this.state.grade} 
                        />
                </div>

                <div className="pure-control-group">
                    <label htmlFor="name">SSN</label>
                    <input id="ssn" type="text" placeholder="Last 4 of child's social"
                        onChange={this.onChangeSSN.bind(this)}
                        value={this.state.ssn}
                        />
                </div>

                <div className="pure-controls">
                    <button
                        className="pure-button pure-button-primary"
                        onClick={this.onSave.bind(this)}>Save</button>
                        &nbsp;&nbsp;
                    <button
                        className="pure-button pure-button-primary"
                        onClick={this.onDelete.bind(this)}>Delete</button>    
                </div>
            </fieldset>
        </div>
        </div>
        )
    }
}