# Installing BeONE Dashboard on Windows (non-admin)

These installation instructions assume that you are on a Windows
computer and that you don\'t have admin access to Windows.

As a prerequisite you must have Git installed on and be able to make a
local clone of a GitHub repository on your computer.

-   Open a 'cmd' terminal window on your computer and `cd` to the location where
    you want to clone the repository.

-   Type `git clone git@github.com:ssi-dk/beone-dashboard.git`
-   The command above will create a folder containing the dashboard. Below we will refer to the created folder
    as \<dashboard_folder\>.
-   Go to https://nodejs.org in a browser.
-   Select "Other downloads".
-   Download "Windows Binary (.zip)" and "64-bit".
-   Extract the content to a folder somewhere on your computer. Below we
    will refer to the extracted folder (containing \'node.exe\' etc.) as
    \<node_folder\>.
-   Create a text file named \'dashboard.bat\' somewhere on your computer
    containing (replace the placeholders with the actual paths):
    ```
    @cd <dashboard_folder>
    @set PATH=<node_folder>;%PATH%
    @cmd.exe /K
    ```
-   In the terminal, `cd` to the location where you placed the dashboard.bat file
    and type `dashboard.bat`. After this, the current directory should now be the location that contains the dashboard.
-   In the terminal, type `npm install`. This will install a number of libraries in a subfolder named ´node_modules´.

-   When the install has finished, type `npm start` to run the dashboard. The dashboard should automatically open as
http://localhost:3000 in your default browser (it migh take a while before it appears).

# Running the dashboard again later
When you want to run the dashboard later, first cd to the directory with dashboard.bat in a 'cmd' window and execute it.
Then, in the same window type `npm start` (you will not need to run `npm install` again).

# A note about Windows file and folder names

You _must_ type all Windows path elements with correct casing (e. g.:
\'Users\', not \'users\'). Node does not accept incorrect casing. Casing
errors will result in error messages from Node, for instance starting
with \'ERROR in Plugin \"react\" was conflicted between\...\'.

# Opening files in the dashboard
To see data in the dashboard you must open a tree file (\*.nwk) and some BeONE JSON files (\*.json) from inside the dashboard.
For testing you can use the test files provided in the test_data folder. For the JSON files you can select more than one file
at a time.
