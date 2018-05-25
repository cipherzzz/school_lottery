#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace CipherZ {
    using namespace eosio;
    using std::string;

    class Lottery : public contract {
        using contract::contract;
        
        public:
            Lottery(account_name self):contract(self) {}

            //@abi action
            void addstudent(const account_name account, uint64_t ssn, string firstname, string lastname, uint64_t grade) {
            require_auth(account);
            studentMultiIndex students(_self, _self);
            auto iterator = students.find(ssn);
            eosio_assert(iterator == students.end(), "student already exists");
            students.emplace(account, [&](auto& student) {
                student.account_name = account;
                student.ssn = ssn;
                student.firstname = firstname;
                student.lastname = lastname;
                student.grade = grade;
            });
            }

            //@abi action
            void addgrade(const account_name account, uint64_t grade_num, uint64_t openings) {
                require_auth(account);
                gradeIndex grades(_self, _self);
                auto iterator = grades.find(grade_num);
                eosio_assert(iterator == grades.end(), "grade already exists");
                grades.emplace(account, [&](auto& _grade) {
                    _grade.account_name = account;
                    _grade.openings = openings;
                    _grade.grade_num = grade_num;
                });
            }

            //@abi action
            void getstudent(const uint64_t ssn) {
                studentMultiIndex students(_self, _self);
                auto iterator = students.find(ssn);
                eosio_assert(iterator != students.end(), "student not found");
                auto student = students.get(ssn);
                print(" **SSN: ", student.ssn, 
                        " First Name: ", student.firstname.c_str(), 
                        " Last Name: ", student.lastname.c_str(),
                        " Grade: ", student.grade,
                        " Result: ", student.result, "** ");
            }

            //@abi action
            void getgrade(const account_name account, uint64_t grade_num) {
                require_auth(account);
                gradeIndex grades(_self, _self);
                auto iterator = grades.find(grade_num);
                eosio_assert(iterator != grades.end(), "grade does not exist");
                auto current_grade = (*iterator);
                print(" **Grade: ", current_grade.grade_num, 
                        " Openings: ", current_grade.openings, "** ");
            }

            //@abi action
            void getstudents(const account_name account) {
                require_auth(account);
                studentMultiIndex students(_self, _self);
                auto iterator = students.begin();
                eosio_assert(iterator != students.end(), "no students exists");
                while (iterator != students.end()) {
                    auto student = (*iterator);
                    print(" **SSN: ", student.ssn, 
                        " First Name: ", student.firstname.c_str(), 
                        " Last Name: ", student.lastname.c_str(),
                        " Grade: ", student.grade,
                        " Result: ", student.result, "** ");
                    iterator++;
                }
            }

            //@abi action
            void getgrades(const account_name account) {
                require_auth(account);
                gradeIndex grades(_self, _self);
                auto iterator = grades.begin();
                eosio_assert(iterator != grades.end(), "no grades exists");
                while (iterator != grades.end()) {
                    auto current_grade = (*iterator);
                    print(" **Grade: ", current_grade.grade_num, 
                        " Openings: ", current_grade.openings, "** ");
                    iterator++;
                }
            }

            //@abi action
            void runlottery(account_name account) {
                require_auth(account);
                studentMultiIndex students(_self, _self);
                //auto grade_index = students.template get_index<N(bygrade)>();
                uint64_t current_grade = 0;
                while(current_grade <= 12) {
                auto iterator = students.begin();
                while (iterator != students.end()) {
                    auto current_student = (*iterator);
                    if(current_student.grade == current_grade) {
                        students.modify(iterator, account, [&](auto& student) {
                        print(" **SSN: ", student.ssn, 
                        " First Name: ", student.firstname.c_str(), 
                        " Last Name: ", student.lastname.c_str(),
                        " Grade: ", student.grade,
                        " Result: ", student.result, "** ");
                        student.result = 200;
                    });
                    } else {
                        print("Students not in grade: ", current_grade);
                    }
                    iterator++;
                }
                 current_grade++;
                }

                // studentIndex students(_self, _self);
                // auto iterator = students.begin();
                // while (iterator != students.end()) {
                //     students.modify(iterator, account, [&](auto& student) {
                //     print("Username: ", student.ssn, 
                //     " First Name: ", student.firstname.c_str(), 
                //     " Last Name: ", student.lastname.c_str(),
                //     " Grade: ", student.grade,
                //     " Result: ", student.result);
                //     student.result = 200;
                // });
                //     iterator++;
                // }
            }


        private:

            //@abi table student i64
            struct student {
                uint64_t account_name;
                uint64_t ssn;
                string firstname;
                string lastname;
                uint64_t grade;
                uint64_t result;

                uint64_t primary_key() const { return ssn; }
                uint64_t secondary_key() const { return grade; }

                EOSLIB_SERIALIZE(student, (account_name)(ssn)(firstname)(lastname)(grade)(result))
            };

            typedef multi_index<N(student), student, indexed_by<N(bygrade), const_mem_fun<student, uint64_t, &student::secondary_key>>> studentMultiIndex;
    
            //@abi table grade i64
            struct grade {
                uint64_t account_name;
                uint64_t grade_num;
                uint64_t openings;

                uint64_t primary_key() const { return grade_num; }

                EOSLIB_SERIALIZE(grade, (account_name)(grade_num)(openings))
            };

            //typedef multi_index<N(student), student> studentIndex;
            typedef multi_index<N(grade), grade> gradeIndex;
    };

    EOSIO_ABI(Lottery, (addstudent)(addgrade)(getstudents)(getgrades)(getstudent)(getgrade)(runlottery))
}