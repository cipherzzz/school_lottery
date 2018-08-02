export default class Network {

    constructor(eos) {
        this.eos = eos
    }

    setAccount(account) {
        this.account = account
        this.options = { authorization: [ account.name + '@' + account.authority ] };
    }

    async init(){
        this.contract = await this.eos.contract('lottery.code')
    }

    /* Table Data - Begin */
    async getSchools() {
        const data = await this.eos.getTableRows({
                                "json": true,
                                "scope": "lottery.code",
                                "code": 'lottery.code',
                                "table": "school"
                                })                       
        return data?data.rows:[]                      
    }

    async getGrades(school_id) {
        const data = await this.eos.getTableRows({
          "json": true,
          "scope": 'lottery.code',
          "code": 'lottery.code',
          "table": "grade",
          "table_key": 'school_key',
          "lower_bound": school_id,
        })
        return data?data.rows.filter((grade)=> grade.schoolfk === school_id):[]
      }

      async getStudents(grade_id) {
        const data = await this.eos.getTableRows({
          "json": true,
          "scope": 'lottery.code',
          "code": 'lottery.code',
          "table": "student",
          "table_key": 'grade_key',
        })
        return data?data.rows.filter((student)=> student.gradefk === grade_id):[] 
      }

    /* Table Data - End */    


    async runLottery(){
        await this.contract.runlottery(this.account.name, this.options)
    }

    /* School */
    async modifySchool(school, name) {
        await this.contract.updateschool(this.account.name, school.key, name, this.options)
    }

    async createSchool(name) {
        await this.contract.addschool(this.account.name, name, this.options)
    }

    async deleteSchool(school) {
        await this.contract.remschool(this.account.name, school.key, this.options)
    }
    /* School */


    /* Student */
    async saveStudent(student, grade) {
        await this.contract.addstudent(this.account.name, grade.key, student.ssn, student.firstname, student.lastname, this.options)
    }

    async updateStudent(student) {
            await this.contract.updatestuden(this.account.name, student.key, student.ssn, student.firstname, student.lastname, student.gradefk, this.options)
    }

    async deleteStudent(student) {
        await this.contract.remstudent(this.account.name, student.key, this.options)
    }
    /* Student */


    /* Grade */
    async saveGrade(school, gradeInfo) {
        await this.contract.addgrade(this.account.name, school.key, Number(gradeInfo.grade_num), Number(gradeInfo.openings), this.options)
    }

    async updateGrade(grade, gradeInfo) {
        await this.contract.updategrade(this.account.name, grade.key, gradeInfo.openings, this.options)
    }

    async deleteGrade(grade) {
        await this.contract.remgrade(this.account.name, grade.key, this.options)
    }
    /* Grade */
}