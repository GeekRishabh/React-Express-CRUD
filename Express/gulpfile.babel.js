import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import path from "path";
import del from "del";
import runSequence from "run-sequence";
// import babelCompiler from 'babel-core/register';
import * as isparta from "isparta";

const plugins = gulpLoadPlugins();

const paths = {
  js: ["./**/*.js", "!dist/**", "!node_modules/**", "!coverage/**"],
  nonJs: ["./package.json", "./.gitignore"],
  tests: "./server/tests/*.js"
};

gulp.task("heroku:production", function() {
  console.log("hello"); // the task does not need to do anything.
});

gulp.task("heroku:development", function() {
  console.log("hello development"); // the task does not need to do anything.
});
// Clean up dist and coverage directory
gulp.task("clean", () => del(["dist/**", "coverage/**", "!dist", "!coverage"]));

// Set env variables
gulp.task("set-env", () => {
  plugins.env({
    vars: {
      NODE_ENV: "test"
    }
  });
});

// Lint Javascript
gulp.task("lint", () =>
  gulp
    .src(paths.js)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(plugins.eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(plugins.eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(plugins.eslint.failAfterError())
);

// Copy non-js files to dist
gulp.task("copy", () =>
  gulp
    .src(paths.nonJs)
    .pipe(plugins.newer("dist"))
    .pipe(gulp.dest("dist"))
);

// Compile ES6 to ES5 and copy to dist
gulp.task("babel", () =>
  gulp
    .src([...paths.js, "!gulpfile.babel.js"], { base: "." })
    .pipe(plugins.newer("dist"))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(
      plugins.sourcemaps.write(".", {
        includeContent: false,
        sourceRoot(file) {
          return path.relative(file.path, __dirname);
        }
      })
    )
    .pipe(gulp.dest("dist"))
);

// Start server with restart on file changes
gulp.task("nodemon", ["copy", "babel"], () =>
  plugins.nodemon({
    script: path.join("dist", "index.js"),
    ext: "js",
    ignore: ["node_modules/**/*.js", "dist/**/*.js"],
    tasks: ["copy", "babel"]
  })
);

// gulp serve for development
gulp.task("serve", ["clean"], () => runSequence("nodemon"));

// default task: clean dist, compile js files and copy non-js files.
gulp.task("default", ["clean"], () => {
  runSequence(["copy", "babel"]);
});
