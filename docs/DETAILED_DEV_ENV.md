1. install node and npm:
  * [follow these instructions](http://blog.teamtreehouse.com/install-node-js-npm-mac)
2. install grunt: 
  * in a terminal window:
    * `npm install -g grunt-cli`
3. clone this repo:
  * in a termial window type:
    * `mkdir townhall-dev`
    * `git clone https://github.com/townhallproject/townHallProject` (will download the project)
    * `cd townHallProject`
    * `npm i` (a bunch of stuff will download)
    * `bower i`
4. open a new terminal tab (command + T)
  * run:
    * `grunt dist-css` (will make your css files)
    * `grunt watch` (will watch for changes)
5. Start local server:
  * In the first tab, run: `npm start`
  * open a new browser window and type in `localhost:3000`
  
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
