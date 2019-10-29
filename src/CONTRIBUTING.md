# Contributing to the-terminal-daemon

## Getting Started

All work is tracked in the Issues

- if you want to work on an existing issue, leave a comment to claim it
- If you'd like to add a new feature, create a new issue outlining the details

## Workflow

1. Fork the repo
2. Clone your fork `git clone [fork-url]`
3. Implement your changes
4. Commit the changes
9. Create a PR to merge a branch from your fork
10. Add a link referencing your PR in the related issue

## Developing

### Install Dependencies

After you have successfully cloned the repo install the dependencies

```sh
git clone https://github.com/joelnet/the-terminal-daemon.git
cd the-terminal-daemon
npm ci
```

### Starting the Server

Next we want to start the server in development mode

```sh
npm run dev
```

By default, this should run the server on `http://localhost:18000

### Starting the Client

To play the demo, next we need to connect the client to our local server

```sh
npx the-terminal http://localhost:18000
```

*Note: Cloning and running the client locally isn't necessary unless we're working on changes in that repo as well.*

### Debugging

You can debug the server or client using VSCODE

1. Select 'Debug' from the sidebar
2. Select 'Launch Program' from the dropdown
3. Press the play button

Add breakpoints, watches, etc and press restart to activate them.