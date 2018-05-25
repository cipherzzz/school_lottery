#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace CipherZ {
    using namespace eosio;
    using std::string;

    class PrintMe : public contract {
        using contract::contract;
        
        public:
            PrintMe(account_name self):contract(self) {}

            //@abi action
            void printmeplease() {
              print("Am I Printing?");
            }
    };

    EOSIO_ABI(PrintMe, (printmeplease))
}