# topselfnews
it is a news app

## Setup of Application
1. Git Clone
2. Run npm i and go to /webapp and run npm i
3. copy nginx conf file to nginx/conf
4. windows test cmd for nginx is running = tasklist /fi "imagename eq nginx.exe"
5. windows cmd to run nginx = nginx -c conf\topselfnews.conf

## setup for redis
1. run `sudo apt-add-repository ppa:redislabs/redis`
2. run `sudo apt-get update` -> `sudo apt-get upgrade`
3. run `sudo apt-get install redis-server`
3. After setting up everything from https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04
4. uncomment bind 127...
5. followed by space enter your ip or try next line bind <yourip>
6. redis-server or redis-server --requirepass <password> cmd in windows to start

## Run in dev mode:
1. Run npm run start-dev in topselfnews and topselfnews/webapp folders.
2. Make sure all _internal folders in webapp are ok

## Run in prod mode
1. Run npm run build-prod in topselfnews/webapp
2. Start nginx as shown above
3. Run npm run start-prod in topselfnews
4. Go to localhost:80
