# Installing the BeONE Dashboard

The BeONE DashBoard (standalone sdition) depends on the Node.js platform and
related software packages. It runs inside a browser and can run on both Windows,
MacOS, and Linux desktop computers. It is tested with Google Chrome and Mozilla
Firefox in recent versions.

## Main installation steps

Regardless of which of the above mentioned operating systems you use,
the installation procedure is roughly the same and includes these major
steps:

-   Install Git
-   Clone the BeONE Dashboard GitHub repository
-   Install Node.js
-   Modify the PATH environment variable
-   Install dependency packages
-   Start Node.js in the folder where you cloned BeONE Dashboard

The installation procedure described here does not require that you have
admin access to your computer. If you do have admin access you might
prefer to install Node.js in other ways then mentioned here; however,
make sure that the version of Node.js you install is not too old.
The same applies if you use a package manager like Conda and want to install
Node.js using that package manager. The dashboard is tested with Node.js version
16.13.2.

## Detailed installation instructions

### Install Git

If you don't have Git installed already, download it from
<http://git-scm.com> and follow the installation instructions.

### Clone the BeONE Dashboard GitHub repository

Open a terminal and use the 'git clone' command for this step. Place
your local copy of the dashboard anywhere on your computer. If cloning
with the SSH protocol does not work for you, use the HTTPS protocol for
cloning. It doesn't matter which protocol you use.

### Install Node.js

Go to <https://nodejs.org/en/download/> in a browser. Download the
Windows Binary (.zip) package, the macOS Binary (.tar.gz) package, or
the Linux Binaries (x64) package depending on tour operating system.
Extract the content to a folder somewhere on your computer (but not the
same as the folder containing the dashboard).

### Modify the PATH environment variable

The PATH environment variable must be modified to include the path where
the Node.js command executable is installed.

On Mac and Linux there is typically already a file that sets PATH for
the user, so on these platforms you will normally not need to create a
file yourself. If you are in doubt which file to modify, please check
the documentation for your OS.

Below is an instruction for setting PATH on Windows without admin
access. \<node_folder\> is the folder that contains the file node.exe.

-   Create a text file named \'dashboard.bat\' somewhere on your
    computer. Make sure your text editor is configured to use Windows
    (not UNIX) line endings.
-   Enter these commands into the file: (replace the placeholders with
    the actual paths):
    ```
    @cd <dashboard_folder>
    @set PATH=<node_folder>;%PATH%
    @cmd.exe /K
    ```
-   Save the file and quit your text editor.
-   Run the file, f. ex. by double-clicking it. This will create a
    terminal window where PATH is modified.
-   Leave the terminal window open as you will need it in the next
    steps.

### Install dependency packages

-   In the terminal window, type (this step might or might not be necessary.):
    ```
    npm config set registry http://registry.npmjs.org
    ```
-   Next, type:
    ```
    npm install
    ```
    This will install a number of libraries in
    a subfolder named node_modules.
-   When the install has finished, type
    ```
    npm start
    ```
    The dashboard should automatically open as
    <http://localhost:3000> in your default browser (it might take a while
    before it appears).

# Running the dashboard again later

After install you can run the dashboard again following these step:

-   Make sure you have the PATH environment variable setup according to
    the instructions above
-   In a terminal window, `cd` to the directory that contains the
    dashboard
-   In the terminal window, type `git pull` to download the newest version of the dashboard.
-   In the terminal window, type `npm install` to update the packages to the newest version.
-   In the terminal window, type `npm start` to start the dashboard.

# A note about Windows file and folder names

You *must* type all Windows path elements with correct casing (e. g.:
\'Users\', not \'users\'). Node does not accept incorrect casing. Casing
errors will result in error messages from Node, for instance starting
with \'ERROR in Plugin \"react\" was conflicted between\...\'.

# Opening files in the dashboard

To see data in the dashboard you must open a tree file (\*.nwk) and some
BeONE JSON files (\*.json) from inside the dashboard. For testing you
can use the test files provided in the test_data folder. For the JSON
files you can select more than one file at a time.
