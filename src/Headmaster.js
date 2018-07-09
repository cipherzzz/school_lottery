import React, { Component } from "react";

import "./App.css";
import "./css/pure-min.css";

export default class Headmaster extends Component {

    constructor(props) {
        super(props)
        this.state = {
            grade: '',
            openings: '',
            applicants: '',
            updateType: -1
            }
    }

    componentWillReceiveProps(newProps) {
        this.stateFromProps(newProps)
    }

    stateFromProps(props){
        if(props.grade) {
            this.setState({
                grade: props.grade.grade_num,
                openings: props.grade.openings,
                applicants: props.grade.applicants
                })
        } else {
            this.setState({
                grade: '',
                openings: '',
                applicants: ''
                })
        }
    }

    gradeFromState(){
        return {
            grade_num: this.state.grade,
            openings: this.state.openings,
            applicants: this.state.applicants,
        }
    }

    onChangeGrade(e) {
        this.setState({ grade: e.target.value,
            gradeValid: e.target.value !== '' });
    }

    onChangeOpenings(e) {
        this.setState({ openings: e.target.value,
            openingsValid: e.target.value !== '' });
    }

     onDelete() {
        this.props.onDelete(this.gradeFromState())
        this.setState({updateType: -1})
    }
    
    onAddForm() {
        this.setState({updateType: 0})
        this.props.onSelectGrade(null) 
    }

    onUpdateForm() {
        this.setState({updateType: 1})
        this.props.onSelectGrade(this.gradeFromState()) 
    }

    onSave() {
        if(this.state.grade && this.state.openings) {
            this.props.onSave(this.gradeFromState())
        }   
    }

    onUpdate() {
        if(this.state.grade && this.state.openings) {
            this.props.onUpdate(this.gradeFromState())
        }
        
    }


    renderGrade(grade){
        return (
        <tr key={grade.grade_num} onClick={()=> this.props.onSelectGrade(grade)}>
            <td>{grade.grade_num}</td>
            <td>{grade.openings}</td>
            <td>
                <button
                        className="pure-button pure-button-small"
                        onClick={this.onUpdateForm.bind(this)}>Update</button> 
                &nbsp;&nbsp;
                <button
                        className="pure-button pure-button-small"
                        onClick={()=>{this.onDelete(grade)}}>Delete</button> 
            </td>
        </tr>)   
    }

    renderGradeOption(grade) {
        return <option key={grade} value={grade}>{grade}</option>
    }

    renderRequiredField(key){
        console.log(this.state[key])
        if(this.state[key] === true) {
            return <div />
        } else {
            return <span className="pure-form-message-inline">This is a required field.</span>
        }
    }

    renderGradeForm() {
        if(this.state.updateType === -1) {
            return <div />
        } else  {

            let gradeOptions = []
            const allGrades = [0,1,2,3,4,5,6,7,8,9,10,11,12]
            allGrades.forEach(grade => {
                gradeOptions.push(this.renderGradeOption(grade))    
            })
            gradeOptions.unshift(<option key={''}></option>)

            let action = this.onSave
            let title = 'Add Grade'
            if(this.state.updateType === 1) {
                action = this.onUpdate
                title = 'Update Grade'
            }
        return (
            <div>
                <h2>{title}</h2>
                <p>Enter the grade information</p>
                <div className="pure-form pure-form-aligned">
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Grade</label>
                                <select id="state"
                                value={this.state.grade}
                                onChange={this.onChangeGrade.bind(this)}>
                                {gradeOptions}
                        </select>   
                        {this.renderRequiredField("gradeValid")} 
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Openings</label>
                            <input id="lastName" type="text" placeholder="Number of Openings"
                                value={this.state.openings}
                                onChange={this.onChangeOpenings.bind(this)} 
                                />
                                {this.renderRequiredField("openingsValid")}
                        </div>

                        <div className="pure-controls">
                            <button
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

        let grades = []
        let data = this.props.grades ? this.props.grades : []
        data.forEach(grade => {
            grades.push(this.renderGrade(grade))    
        })

        return (
        <div>    
        <h2>Administrator</h2>
        <table className="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th>First</th>
                    <th>Last</th>
                </tr>
            </thead>
        
            <tbody>
                <tr>
                    <td>{this.props.identity.personal.firstname}</td>
                    <td>{this.props.identity.personal.lastname}</td>
                </tr>
            </tbody>
        </table> 
        <h2>Grades</h2>
        <table className="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th>Grade Number</th>
                    <th>Openings</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {grades}
            </tbody>
        </table> 
        <br />
        <button
            className="pure-button pure-button-primary"
            onClick={this.onAddForm.bind(this)}>Add Grade
        </button>
        <br />
        <hr />
        <br />
        {this.renderGradeForm()}
        </div>
        )
    }
}