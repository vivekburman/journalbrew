# topselfnews
it is a news app

## Setup of Application
1. Git Clone
2. Run npm i and go to /webapp and run npm i
3. copy nginx conf file to nginx/conf
4. windows test cmd for nginx = tasklist /fi "imagename eq nginx.exe"
5. windows cmd to run nginx = nginx -c conf\topselfnews.conf

## setup for redis
1. After setting up everything from https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04
2. uncomment bind 127...
3. followed by space enter your ip or try next line bind <yourip>
4. redis-server cmd in windows to start
