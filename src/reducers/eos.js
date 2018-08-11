import Eos from 'eosjs'
import Network from "../network"

const initialState = {
    scatter: undefined,
    account: undefined,
    identity: undefined,
    userType: -1,
    schools: [],
    grades: [],
    students: [],
    selectedSchool: undefined,
    selectedGrade: undefined,
    gradeActionType: -1,
    selectedStudent: undefined,
};

const networkOptions = {
    protocol:'http',
    blockchain:'eos',
    host:'127.0.0.1',
    port:8888,
    chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  }

const eosOptions = {
    broadcast: true, 
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
}

const SET_SCATTER = "setScatter"
const SET_ACCOUNT = "setAccount"
const SET_IDENTITY = "setIdentity"
const SET_USER_TYPE = "setUserType"

const SET_SCHOOLS = "setSchools"
const SELECT_SCHOOL = "selectSchool"

const SET_GRADES = "setGrades"
const SELECT_GRADE = "selectGrade"
const SET_GRADE_ACTION_TYPE = "setGradeActionType"

const SET_STUDENT_ACTION_TYPE = "setStudentActionType"
const SET_STUDENTS = "setStudents"
const SELECT_STUDENT = "selectStudent"

let network

export function reset() {
    return (dispatch) => {
        dispatch(setScatter(undefined))
        dispatch(setAccount(undefined))
        dispatch(setIdentity(undefined))
        dispatch(setUserType(-1))
        dispatch(selectSchool(undefined))
        dispatch(selectGrade(undefined))
        dispatch(selectStudent(undefined))
        dispatch(setGradeActionType(-1))
    };
}

export function setScatter(scatter) {
    return {type: SET_SCATTER, scatter};
}

export function setAccount(account) {
    return {type: SET_ACCOUNT, account};
}

export function setIdentity(identity) {
    return {type: SET_IDENTITY, identity};
}

export function setUserType(userType) {
    return {type: SET_USER_TYPE, userType};
}

export function initScatter(scatter) {
    return async (dispatch, getState) => {
        dispatch(setScatter(scatter))

        const eos = scatter.eos( networkOptions, Eos, eosOptions, "http")
        network = new Network(eos)
        network.init()
    }
}

export function login(isParent, scatter) {
    return async (dispatch, getState) => {

        let requiredFields = {
            personal:['firstname', 'lastname'],
            location:['address', 'city', 'state', 'zipcode', 'phone'],
            accounts:[networkOptions]
        };

        if(!isParent) {
            requiredFields = {
                personal:['firstname', 'lastname'],
                accounts:[networkOptions]
            }
        }

        const identity = await scatter.getIdentity(requiredFields)
        dispatch(setIdentity(identity))

        const account = identity.accounts.find(acc=>acc.blockchain==='eos'); 

        if(account) {
            network.setAccount(account)
            dispatch(setAccount(account))
            
            // We have a valid identity - now we set the user's requested type
            if(isParent === true) {
                dispatch(setUserType(1))
            } else {
                dispatch(setUserType(0))
            }
        } else {
            throw new Error('Unable to find EOS account')
        }
    }
}

export function receiveSchools(schools) {
    return {type: SET_SCHOOLS, schools};
}

export function selectSchool(school) {
    return {type: SELECT_SCHOOL, school};
}

export function receiveGrades(grades) {
    return {type: SET_GRADES, grades};
}

export function receiveStudents(students) {
    return {type: SET_STUDENTS, students};
}

export function selectGrade(grade) {
    return {type: SELECT_GRADE, grade};
}

export function manageGrade(grade) {
    return (dispatch) => {
        dispatch(selectGrade(grade))
        dispatch(getStudents(grade.key))
    }
}

export function manageSchool(school) {
    return (dispatch) => {
        dispatch(selectSchool(school))
        dispatch(getGrades(school.key))
    }
}

export function setGradeActionType(gradeActionType) {
    return {type: SET_GRADE_ACTION_TYPE, gradeActionType};
}

export function newGrade() {
    return (dispatch) => {
        dispatch(selectGrade(null))
        dispatch(setGradeActionType(0))
    }
}

export function editGrade(grade) {
    return (dispatch) => {
        dispatch(selectGrade(grade))
        dispatch(setGradeActionType(1))
    }
}

export function selectStudent(student) {
    return {type: SELECT_STUDENT, student};
}

export function setStudentActionType(studentActionType) {
    return {type: SET_STUDENT_ACTION_TYPE, studentActionType};
}

export function newStudent() {
    return (dispatch) => {
        dispatch(selectStudent(null))
        dispatch(setStudentActionType(0))
    }
}

export function editStudent(student) {
    return (dispatch) => {
        dispatch(selectStudent(student))
        dispatch(setStudentActionType(1))
    }
}

export function runLottery(school) {
    return async (dispatch) => {
        await network.runLottery(school)
        dispatch(getSchools())
        dispatch(getGrades(school.key))
        dispatch(selectGrade(null))
    }
}

export function getSchools(account) {
    return async (dispatch) => {
        const schools = await network.getSchools(account)
        dispatch(receiveSchools(schools))
    };
}

export function createSchool(name) {
    return async (dispatch) => {
        await network.createSchool(name)
        dispatch(getSchools())
    };
}

export function modifySchool(school, name) {
    return async (dispatch) => {
        await network.modifySchool(school, name)
        dispatch(getSchools())
    };
}

export function deleteSchool(school) {
    return async (dispatch) => {
        await network.deleteSchool(school)
        dispatch(getSchools())
    };
}

export function saveGrade(school, gradeInfo) {
    return async (dispatch) => {
        await network.saveGrade(school, gradeInfo)
        dispatch(getGrades(school.key))
    };
}

export function updateGrade(grade, gradeInfo) {
    return async (dispatch) => {
        await network.updateGrade(grade, gradeInfo)
        dispatch(getGrades(grade.schoolfk))
    };
}

export function deleteGrade(grade) {
    return async (dispatch) => {
        await network.deleteGrade(grade)
        dispatch(getGrades(grade.schoolfk))
    };
}

export function getGrades(schoolfk) {
    return async (dispatch) => {
        const grades = await network.getGrades(schoolfk)
        dispatch(receiveGrades(grades))
    };
}

export function saveStudent(student, grade) {
    return async (dispatch) => {
        await network.saveStudent(student, grade)
        dispatch(getStudents(grade.key))
    };
}

export function updateStudent(student) {
    return async (dispatch) => {
        await network.updateStudent(student)
        dispatch(getStudents(student.gradefk))
    };
}

export function deleteStudent(student) {
    return async (dispatch) => {
        await network.deleteStudent(student)
        dispatch(getStudents(student.gradefk))
    };
}

export function getStudents(gradefk) {
    return async (dispatch) => {
        const students = await network.getStudents(gradefk)
        console.log("students with grade", gradefk, students)
        dispatch(receiveStudents(students))
    };
}

export function eos(state = initialState, action) {
  switch (action.type) {
    case SET_SCATTER:
        return Object.assign({}, state, {
            scatter: action.scatter
        }) 
    case SET_ACCOUNT:
        return Object.assign({}, state, {
            account: action.account
        })
    case SET_IDENTITY:
        return Object.assign({}, state, {
            identity: action.identity
        })
    case SET_USER_TYPE:
        return Object.assign({}, state, {
            userType: action.userType
        })             
    case SET_SCHOOLS:
        return Object.assign({}, state, {
            schools: action.schools
        })
    case SELECT_SCHOOL:
        return Object.assign({}, state, {
            selectedSchool: action.school
        })
    case SET_GRADES:
        return Object.assign({}, state, {
            grades: action.grades
        })
    case SELECT_GRADE:
        return Object.assign({}, state, {
            selectedGrade: action.grade
        }) 
    case SET_GRADE_ACTION_TYPE:
        return Object.assign({}, state, {
            gradeActionType: action.gradeActionType
        }) 
    case SET_STUDENT_ACTION_TYPE:
        return Object.assign({}, state, {
            studentActionType: action.studentActionType
        })        
    case SET_STUDENTS:
        return Object.assign({}, state, {
            students: action.students
        })
    case SELECT_STUDENT:
        return Object.assign({}, state, {
            selectedStudent: action.student
        })          
    default:
      return state;
  }
}