import React, { Component } from "react";

import "./App.css";
import "./css/pure-min.css";

//<div className="pure-control-group">

export default class School extends Component {

    renderGrade(grade){
        return (
            <tr key={grade}>
                <td>{grade.grade_num}</td>
                <td>{grade.openings}</td>
                <td>{grade.applicants}</td>
                <td>Open</td>
            </tr>
        )
    }

    render() {

        let grades = []
        this.props.grades.forEach(grade => {
            grades.push(this.renderGrade(grade))    
        })

        return (
            <div>
            <h4>{this.props.name}</h4>    
            <table className="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th>Grade</th>
                    <th>Openings</th>
                    <th>Applicants</th>
                    <th>Status</th>
                </tr>
            </thead>
        
            <tbody>
                {grades}
            </tbody>
        </table>
        </div>
        )
    }
}