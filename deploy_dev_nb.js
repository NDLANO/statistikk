// **** ftp-deploy config file

const sftp = require("node-sftp-deploy-i");

/**
 * * login_prefs should be an object with props user and password. Remember to not include file in repo!
 * * { user: "myUser", password: "mypassword123"}
 */
let login_prefs = require("./login_prefs");
login_prefs = login_prefs.login_prefs;

console.log("deploy_dev_nb");
console.log("login_prefs = ", login_prefs);

// to upload html files after all others
// const sortingFunction = function (a, b) {
//   return path.extname(a.path).toLowerCase() === '.html' ? 1 : -1;
// };

sftp({
  host: "cpanel76.proisp.no",
  port: "22",
  user: login_prefs.user,
  pass: login_prefs.password,
  remotePath: "/home/doublfkx/public_html/vaaland/alpha",
  sourcePath: "./dist/",
  // includePattern:  /.*\.(js|css|html)$/,  // optional, upload only js css and html files
  // sort: sortingFunction,                          // optional
  cacheFile: "sftp-cache.json", // optional
})
  .then(function() {
    console.log("deploy successful");
  })
  .catch(function(error) {
    console.log("deploy error: ", error);
  });

// Support Promise
// sftp(sftpConfig).then(function(){
//   //Success Callback
// });
