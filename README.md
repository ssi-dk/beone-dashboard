# Installation
Currently, the BeONE Dashboard is only for running as a standalone app on a desktop computer. A component version for integration in a server platform is planned.

## Install NodeJS
The BeONE Dashboard depends on NodeJS, which is an environment for running JavaScript. So the first step is to install NodeJS on your computer. For this step you will need an administrator account on the computer.

- In a browser, to https://nodejs.org/en/
- Download a version of NodeJS for your operating system. Choose the version that is recommended for most users.
- Install Node using the downloaded installation file and your admin account.
- Open a console window on your computer and type `node --version` to verify the installation. This should return the node version number.

## Install Git
You also need Git on your computer. If you don't have Git installed already, download and install it from https://git-scm.org.

## Download BeOne Dashboard with Git
In a console window, in the location on your computer where you want the dashboard installed, type:
```
git clone https://github.com/ssi-dk/beone-dashboard
```

## Run BeONE Dashboard
In the same console window, you can now type:
```
cd beone-dashboard
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard in your browser.
