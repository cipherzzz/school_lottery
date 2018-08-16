# python3 ./tests/lottery.spec.py

import setup
import eosf
import node
import unittest
from termcolor import cprint
import time

setup.set_verbose(False)
setup.use_keosd(False)

class Test1(unittest.TestCase):

    def run(self, result=None):
        """ Stop after first error """      
        if not result.failures:
            super().run(result)


    @classmethod
    def setUpClass(cls):
        CONTRACT_NAME = "/Users/markmathis/Projects/EOS/lottery/src/contracts/Lottery"
        testnet = node.reset()
        assert(not testnet.error)

        wallet = eosf.Wallet()
        assert(not wallet.error)

        account_master = eosf.AccountMaster()
        wallet.import_key(account_master)
        assert(not account_master.error)

        global account_admin
        account_admin = eosf.account(account_master)
        wallet.import_key(account_admin)
        assert(not account_admin.error)

        global account_parent
        account_parent = eosf.account(account_master)
        wallet.import_key(account_parent)
        assert(not account_parent.error)

        global account_deploy 
        account_deploy = eosf.account(account_master, name="lotteryxcode")
        wallet.import_key(account_deploy)
        assert(not account_deploy.error)

        global contract
        cprint(""" Create a reference to the new contract """, 'magenta')
        contract = eosf.ContractBuilder(CONTRACT_NAME)

        cprint(""" Not Building the contract abi/wast due to jankyness """, 'magenta')

        # cprint(""" Build the contract abi """, 'magenta')
        # assert(not contract.build_abi().error)
        
        # cprint(""" Build the contract wast """, 'magenta')
        # assert(not contract.build_wast().error)

        cprint(""" Associate the contract with an account """, 'magenta')
        contract = eosf.Contract(account_deploy, CONTRACT_NAME)

        cprint(""" Deploy the contract """, 'magenta')
        assert(not contract.deploy().error)
    
        cprint(""" Confirm `account_deploy` contains code """, 'magenta')
        assert(not account_deploy.code().error)


    def setUp(self):
        pass

    def removeSchool(self, account, schoolkey):
        #
        # Description: Remove School as Admin
        # Expectation: Succeed and record removed
        #
            time.sleep(1) # Do this to prevent duplicate transaction in same block
            cprint(""" Action contract.push_action("remschool") """, 'magenta')
            action = contract.push_action(
                "remschool", "[" + str(account) + ", "+str(schoolkey)+"]", account)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("school", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"], [])
        #

    def removeGrade(self, account, gradekey):
        #
        # Description: Remove Grade as Admin
        # Expectation: Succeed and record removed
        #
            cprint(""" Action contract.push_action("remgrade") """, 'magenta')
            action = contract.push_action(
                "remgrade", "[" + str(account) + ", "+str(gradekey)+"]", account)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("grade", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"], [])
        #

    def removeStudent(self, account, studentkey): 
        #
        # Description: Remove Student as Parent
        # Expectation: Succeed and record removed
        #
            cprint(""" Action contract.push_action("remstudent") """, 'magenta')
            action = contract.push_action(
                "remstudent", "[" + str(account) + ", "+str(studentkey)+"]", account)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("student", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"], [])
        #   

    def testSchool(self):

        #
        # Description: Add School as Admin
        # Expectation: Succeed and Data exist
        #
            cprint(""" Action contract.push_action("addschool") """, 'magenta')
            action = contract.push_action(
                "addschool", "[" + str(account_admin) + ", hogwarts]", account_admin)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("school", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"][0]["name"], 'hogwarts')
            self.assertEqual(t.json["rows"][0]["status"], 0)
            self.assertEqual(t.json["rows"][0]["key"], 0)
        #
        #


            self.removeSchool(account_admin, 0)

    def testGrade(self):

        #
        # Description: Add School as Admin
        # Expectation: Succeed and Data exist
        #
            cprint(""" Action contract.push_action("addschool") """, 'magenta')
            action = contract.push_action(
                "addschool", "[" + str(account_admin) + ", harvard]", account_admin)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("school", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"][0]["name"], 'harvard')
            self.assertEqual(t.json["rows"][0]["status"], 0)
            self.assertEqual(t.json["rows"][0]["key"], 0)
        #
        #

        #
        # Description: Add Grade as Admin
        # Expectation: Succeed and Data exist
        #
            cprint(""" Action contract.push_action("addgrade") """, 'magenta')
            action = contract.push_action(
                "addgrade", "[" + str(account_admin) + ",0, 1, 25]", account_admin)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("grade", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"][0]["key"], 0)
            self.assertEqual(t.json["rows"][0]["schoolfk"], 0)
            self.assertEqual(t.json["rows"][0]["grade_num"], 1)
            self.assertEqual(t.json["rows"][0]["openings"], 25)
        #
        #


            self.removeGrade(account_admin, 0)
            self.removeSchool(account_admin, 0)

    def testStudent(self):

        #
        # Description: Add School as Admin
        # Expectation: Succeed and Data exist
        #
            cprint(""" Action contract.push_action("addschool") """, 'magenta')
            action = contract.push_action(
                "addschool", "[" + str(account_admin) + ", harvard]", account_admin)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("school", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"][0]["name"], 'harvard')
            self.assertEqual(t.json["rows"][0]["status"], 0)
            self.assertEqual(t.json["rows"][0]["key"], 0)
        #
        #

        
        #
        # Description: Add Grade as Admin
        # Expectation: Succeed and Data exist
        #
            cprint(""" Action contract.push_action("addgrade") """, 'magenta')
            action = contract.push_action(
                "addgrade", "[" + str(account_admin) + ", 0, 2, 30]", account_admin)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("grade", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"][0]["grade_num"], 2)
            self.assertEqual(t.json["rows"][0]["openings"], 30)
        #
        #

        #
        # Description: Add Student as Parent
        # Expectation: Succeed and Data exist
        #
            cprint(""" Action contract.push_action("addstudent") """, 'yellow')
            action = contract.push_action(
                "addstudent", '["' + str(account_parent) + '", 0, 123456789, jimmy, stewart]', account_parent)
            print(action)
            self.assertFalse(action.error)
            t = contract.table("student", account_deploy)
            self.assertFalse(t.error)
            self.assertEqual(t.json["rows"][0]["gradefk"], 0)
            self.assertEqual(t.json["rows"][0]["ssn"], 123456789)
            self.assertEqual(t.json["rows"][0]["firstname"], "jimmy")
            self.assertEqual(t.json["rows"][0]["lastname"], "stewart")
        #

            self.removeStudent(account_parent, 0)
            self.removeGrade(account_admin, 0)
            self.removeSchool(account_admin, 0)   

    def tearDown(self):
        pass


    @classmethod
    def tearDownClass(cls):
        node.stop()


if __name__ == "__main__":
    unittest.main()