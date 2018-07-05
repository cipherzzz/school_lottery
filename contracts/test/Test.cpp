#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace CipherZ {
    using namespace eosio;
    using std::string;

    class Test : public contract {
        using contract::contract;
        
        public:
            Test(account_name self):contract(self) {}

            //@abi action
            void testaction() {
              print("Called testaction from eosjs");
            }
    };

    EOSIO_ABI(Test, (testaction))
}