# backupsample.sh
# sample curl request to backup data to firestore
# @author: Yubaraj Poudel
# @email: yubarajpouddel708@gmail.com
set -e
BASEURL="http://127.0.0.1:8019"
#backup global count
RESPONSE=$(echo $(curl "$BASEURL/count"))
echo $RESPONSE
DATE=$(date +%F_%H-%M-%S)
SUCCESS=$(echo $(curl "$BASEURL/backup" \
    -H "User-Agent: Mozilla/2.2" \
    -d type=global \
    -d data="$RESPONSE"))
echo -e "\n /global => $SUCCESS ----------------------------------------$DATE--" >> cronlog.txt 

#backup all country data
RESPONSE=$(echo $(curl "$BASEURL/stat"))
echo $RESPONSE
SUCCESS=$(echo $(curl "$BASEURL/backup" \
    -H "User-Agent: Mozilla/2.2" \
    -d type=country_wise \
    -d data="$RESPONSE"))
echo -e "\n /stat => $SUCCESS ----------------------------------------$DATE-----" >> cronlog.txt 

#backup nepal only data
RESPONSE=$(echo $(curl "$BASEURL/country?name=nepal"))
echo $RESPONSE
SUCCESS=$(echo $(curl "$BASEURL/backup" \
    -H "User-Agent: Mozilla/2.2" \
    -d type=nepal \
    -d data="$RESPONSE"))
echo -e "\n /nepal => $SUCCESS ----------------------------------------$DATE-----" >> cronlog.txt 
echo -e "\n=========================================================================================\n" >> cronlog.txt
