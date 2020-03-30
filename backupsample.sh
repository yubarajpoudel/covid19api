# backupsample.sh
# sample curl request to backup data to firestore

curl http://127.0.0.1:8019/backup \
    -H "User-Agent: Mozilla/2.2" \
    -d type=global \
    -d data="{'name':'sample'}"