# townHallProject

## Goals:
Enable people to quickly find a relevant town hall meeting to show up to.

## User Features:
Look up by location
Filter/sort by other features (date/rep is going to be present or not)
Add to personal calendar
Join Facebook Event
Sign up for email alerts
Submit an event for review by researchers

## Contributing
- Open an issue in the repository describing the feature you intend to work on.
- Check out a new branch for this feature from the repository's `development` branch.
- Do your work on that branch.
- When your changes are ready to be merged, open a pull request from your feature branch to the repo's `development` branch.
- In the comments of your Pull Request, point out which issue you've resolved and how.

## Running Locally
- `npm install`
- `firebase serve`
- Open localhost:5000

## Tech

[Firebase](https://firebase.google.com/docs/) is both a real-time database and hosting platform. `firebase serve` will run the server.

In event.js, we initialize the server with a config object. Then we're able to access different locations using `.ref(<some string>)`.

To read the data at an endpoint once, we chain `.ref()` with `.once()`. This returns a promise. We can do things with the data in the resolve function of the promise.

Writing data follows a similar pattern. We chain `.ref()` with `.set(<some value>)`.

For more information, check out the Firebase [docs](https://firebase.google.com/docs/).


#### Style Changes
- In a second terminal window
- `bower i`
- Run `grunt watch`
- Make changes to customboot.less
- New changes will be written to bootstrap.min.css
