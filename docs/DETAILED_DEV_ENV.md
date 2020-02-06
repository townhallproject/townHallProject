1. install node and npm:
  * [follow these instructions](http://blog.teamtreehouse.com/install-node-js-npm-mac)
2. clone this repo:
  * in a termial window type:
    * `mkdir townhall-dev` (makes a new folder called townhall-dev)
    * `cd townhall-dev` (moves you into this new folder, so the repo will be cloned here)
    * `git clone https://github.com/townhallproject/townHallProject` (or your own fork of the project if you dont have write permissions)
    * `cd townHallProject` (moves you into the repo folder)
    * `npm i` (a bunch of stuff will download)
4. open a new terminal tab (command + T)
  * run:
    * `npm run watch` (will watch for changes)
5. Open in the browser:
  * open a new browser window and type in `localhost:8080`
  
6. checkout branches:
  * open a new tab in the terminal your location should be `[your computer name]:townHallProject [your user name]$`
  * run `git checkout [BRANCHNAME]`, ex. `git checkout development`
  * refresh your browser
  
7. checkout pull requests:
  * run `git fetch`
  * you'll see a list of new branches
  * run `git checkout 'name-of-new-branch'
  * you'll get a response saying that your local branch is tracking remote branch
  * refresh your browser
