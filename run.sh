./unlock.sh
./compile.sh
./deploy.sh
cleos push action supervisor getgrade '["supervisor", 0]' -p supervisor@active
cleos push action supervisor getgrades '["supervisor"]' -p supervisor@active
cleos push action supervisor getstudents '["supervisor"]' -p supervisor@active
#cleos push action supervisor runlottery '["supervisor"]' -p supervisor@active
