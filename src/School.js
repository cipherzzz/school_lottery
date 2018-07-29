import React, { Component } from "react";

import "./App.css";
import "./css/pure-min.css";

//<div className="pure-control-group">

export default class School extends Component {

    constructor(props) {
        super(props);
        this.state = {grades: [], name: props.school.name, nameValid: true}
    }

    componentWillMount() {
        this.setState({grades: this.getGrades(this.props.school.key)})
    }

    componentWillReceiveProps(newProps) {
        if(newProps.school !== this.props.school) {
            this.setState({grades: this.getGrades(newProps.school.key), name: newProps.school.name})
        }
    }

    getGrades(school_id) {
        this.props.eos.getTableRows({
          "json": true,
          "scope": 'lottery.code',
          "code": 'lottery.code',
          "table": "grade",
          "table_key": 'school_key',
          "lower_bound": school_id,
        }).then(result => {
          const filteredRows = result.rows.filter((grade)=> grade.schoolfk === school_id)  
          console.log(JSON.stringify(filteredRows))
          this.setState({grades: filteredRows})
        }).catch((error) =>{
          this.setState(error)
        })
      }
    
    isValid() {
    if(this.state.name === '') {
        return false
    } else {
        return true
    }
    }

    onChangeName(e) {
    this.setState({ name: e.target.value,
        nameValid: e.target.value !== '' });
    }  

    renderRequiredField(key){
        console.log(this.state[key])
        if(this.state[key] === true) {
            return <div />
        } else {
            return <span className="pure-form-message-inline">This is a required field.</span>
        }
    }

    renderGrade(grade){

        let actionView = null
        if(this.props.isAdmin) {
            actionView = <div>
            <button
                    className="pure-button pure-button-xsmall"
                    onClick={()=>{this.props.onEditGrade(grade)}}>Edit 
                    Grade</button> 
            &nbsp;&nbsp;
            <button
                    className="pure-button pure-button-xsmall"
                    onClick={()=>{this.props.onDeleteGrade(grade)}}>Delete</button> 
        </div>
        }

        return (
            <tr key={grade.key}>
                <td>{grade.grade_num}</td>
                <td>{grade.openings}</td>
                <td>{actionView}</td>
            </tr>
        )
    }

    renderAddGrade(){
        if(this.props.isAdmin) {
            return (
                <button
                    disabled={this.props.school.key === undefined}
                    className="pure-button pure-button-primary"
                    onClick={()=>{this.props.onAddGrade(this.props.grade)}}>
                    Add Grade
                </button>
            )
        } else {
            return null
        }
    }

    renderName() {
        const isNew = this.props.school.key === undefined
        const buttonName = isNew ? 'Create School' : 'Update Name'
        return (
            <div className="pure-control-group">
                <input id="name" type="text" placeholder="School Name"
                    value={this.state.name}
                    onChange={this.onChangeName.bind(this)} 
                    />
                    &nbsp;&nbsp;
                <button
                    disabled={!this.isValid()}
                    className="pure-button pure-button-primary"
                    onClick={()=>{this.props.onUpdateSchool(this.props.school, this.state.name)}}>
                    {buttonName}
                </button>    
                {this.renderRequiredField("nameValid")}
            </div>
        )
    }

    render() {

        let grades = []
        this.state.grades && this.state.grades.forEach(grade => {
            grades.push(this.renderGrade(grade))    
        })
        
        if(grades.length === 0) {
            const noGrades = <td colSpan="4">No Grades</td>
            grades.push(noGrades)
        }

        return (
            <div>
            {this.renderName()}
            <br />        
            <table className="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th>Grade</th>
                    <th>Openings</th>
                    <th>Action</th>
                </tr>
            </thead>
        
            <tbody>
                {grades}
            </tbody>
        </table>
        <br/>
        {this.renderAddGrade()}
        </div>
        )
    }
}