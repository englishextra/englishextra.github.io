# http://stackoverflow.com/questions/19106284/how-do-you-uninstall-all-dependencies-listed-in-package-json-npm
# for package in `ls node_modules`; do npm uninstall $package; done;
npm uninstall `ls -1 node_modules | tr '/\n' ' '`
