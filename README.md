# Installation
Currently, the BeONE Dashboard is only for running as a standalone app on a desktop computer. A component version for integration in a server platform is planned.

These installation instructions will presume that you are on a Windows computer, but BeONE Dashboard should run on other platforms as well.

## Install NodeJS
The BeONE Dashboard depends on NodeJS, which is an environment for running JavaScript. So the first step is to install NodeJS on your computer. For this step and the next one you will need to be logged in with an administrator account on the computer.

- In a browser, to https://nodejs.org/en/
- Download a version of NodeJS for your operating system. Choose the version that is recommended for most users.
- Install Node using the downloaded installation file and your admin account.
- Open a terminal window (such as Windows PowerShell) on your computer and type `node --version` to verify the installation. This should return the node version number.

## Install Git
You also need Git on your computer. If you don't have Git installed already, download and install it from https://git-scm.org.

## Download BeOne Dashboard
Now login to your normal user account. If you were logged in already, first logout and then login again.

Open a terminal window, and verify that Node is working in your account with `node --version`.

In the terminal window, in the location on your computer where you want the dashboard installed, type:
```
git clone https://github.com/ssi-dk/beone-dashboard
```

## Run BeONE Dashboard
In the same console window, you can now type:
```
cd beone-dashboard
npm start
```

This should automatically open [http://localhost:3000](http://localhost:3000) in your default browser.
