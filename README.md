# The Terminal
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

The Terminal is a hacker game played in the terminal.

# Help / Feedback

Need Help? Want to give Feedback?

[Join the Discord chat!](https://discordapp.com/invite/Gg7ptD5)

# Accessing The Terminal

To access The Terminal, you will need to have `node.js` and an up to date version of `npm`, which includes the `npx` command.

Then run the command:

```bash
# Start The Terminal
npx the-terminal
```

Note: Windows users with a space in their username may run into problems. Try this if you have problems:

```bash
# fix for Windows issues
npm i -g the-terminal

# Start The Terminal
npx the-terminal
```

Follow the directions in *Create an Account* to start playing

# Create an Account

The security for the `root` account has recently been compromised by a security patch.

Quickly, before it re-secured, log into the `root` account using the password `admin123`.

```bash
Login as: root
root's password: admin123
```

Once you've signed into the `root` account, you will have access to create a user.

```bash
# Create an Account
root$ adduser <your-username>
```

Follow the prompts and then `exit`.

```bash
# exit The Terminal
exit
```

Log back into The Terminal using your newly created credentials.

```bash
npx the-terminal
Login as: <your-username>
<your-username>'s password: <your-password>
```

You will have an email waiting for you with further instructions.

```bash
# read your mail
mail
```

This box will serve as your entry point into The Network.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="http://joel.net"><img src="https://avatars3.githubusercontent.com/u/742630?v=4" width="100px;" alt="joelnet"/><br /><sub><b>joelnet</b></sub></a><br /><a href="https://github.com/joelnet/the-terminal-daemon/commits?author=joelnet" title="Code">💻</a></td>
    <td align="center"><a href="http://evanplaice.com"><img src="https://avatars1.githubusercontent.com/u/303159?v=4" width="100px;" alt="Evan Plaice"/><br /><sub><b>Evan Plaice</b></sub></a><br /><a href="https://github.com/joelnet/the-terminal-daemon/commits?author=evanplaice" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!