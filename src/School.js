import React, { Component } from "react";

import "./App.css";
import "./css/pure-min.css";

//<div className="pure-control-group">

export default class School extends Component {

    constructor(props) {
        super(props);
        this.state = {grades: []}
    }

    componentWillMount() {
        this.setState({grades: this.getGrades(this.props.school.key)})
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
                    onClick={()=>{console.log("Delete")}}>Delete</button> 
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
                    className="pure-button pure-button-primary"
                    onClick={()=>{this.props.onAddGrade(this.props.grade)}}>
                    Add Grade
                </button>
            )
        } else {
            return null
        }
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
            <h4>{this.props.school.name}</h4>    
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