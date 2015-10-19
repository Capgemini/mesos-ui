/*jshint esnext: true */
import path from 'path';
import cp from 'child_process';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import mkdirp from 'mkdirp';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import minimist from 'minimist';
let config = require('./src/config/config')
let buildType = config['buildType']
var buildConfig = config['buildConfig'][buildType]

const $ = gulpLoadPlugins();
const argv = minimist(process.argv.slice(2));
const src = Object.create(null);

let watch = false;
let browserSync;

// The default task
gulp.task('default', ['sync']);

// Clean output directory
gulp.task('clean', cb => {
  del(['.tmp', 'build/*', '!build/.git'], {dot: true}, () => {
    mkdirp('build/' + buildConfig['publicFolder'], cb);
  });
});

// Static files
gulp.task('assets', () => {
  src.assets = 'src/public/**';
  return gulp.src(src.assets)
    .pipe($.changed('build/' + buildConfig['publicFolder']))
    .pipe(gulp.dest('build/' + buildConfig['publicFolder']))
    .pipe($.size({title: 'assets'}));
});

// Resource files
gulp.task('resources', () => {
  src.resources = [
    'src/templates/' + buildConfig['templateFolder'] + '/**',
    'package.json'
  ];

  gulp.src('src/templates/' + buildConfig['templateFolder'] + '/**')
    .pipe($.changed('build'))
    .pipe(gulp.dest('build/' + buildConfig['templateTargetFolder']))
    .pipe($.size({title: 'resources'}));

  return gulp.src('package.json')
    .pipe($.changed('build'))
    .pipe(gulp.dest('build'))
    .pipe($.size({title: 'resources'}));
});

// Bundle
gulp.task('bundle', cb => {
  const config = require('./webpack.config.js');
  const bundler = webpack(config);
  const verbose = !!argv.verbose;
  let bundlerRunCount = 0;

  function bundle(err, stats) {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    console.log(stats.toString({
      colors: $.util.colors.supportsColor,
      hash: verbose,
      version: verbose,
      timings: verbose,
      chunks: verbose,
      chunkModules: verbose,
      cached: verbose,
      cachedAssets: verbose
    }));

    if (++bundlerRunCount === (watch ? config.length : 1)) {
      return cb();
    }
  }

  if (watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});

// Build the app from source code
gulp.task('build', cb => {
  runSequence(['assets', 'resources'], ['bundle'], cb);
});

// Build and start watching for modifications
gulp.task('build:watch', cb => {
  watch = true;
  runSequence('build', () => {
    gulp.watch(src.assets, ['assets']);
    gulp.watch(src.resources, ['resources']);
    cb();
  });
});

// Launch a Node.js/Express server
gulp.task('serve', ['build:watch'], cb => {
  src.server = [
    'build/server.js',
    'build/' + buildConfig['templateTargetFolder'] + '/**/*'
  ];
  let started = false;
  let server = (function startup() {
    const child = cp.fork('build/server.js', {
      env: Object.assign({NODE_ENV: 'development'}, process.env)
    });
    child.once('message', message => {
      if (message.match(/^online$/)) {
        if (browserSync) {
          browserSync.reload();
        }
        if (!started) {
          started = true;
          gulp.watch(src.server, function() {
            $.util.log('Restarting development server.');
            server.kill('SIGTERM');
            server = startup();
          });
          cb();
        }
      }
    });
    return child;
  })();

  process.on('exit', () => server.kill('SIGTERM'));
});

// Launch BrowserSync development server
gulp.task('sync', ['serve'], cb => {
  browserSync = require('browser-sync');

  browserSync({
    logPrefix: 'RSK',
    notify: false,
    // Run as an https by setting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    https: false,
    // Informs browser-sync to proxy our Express app which would run
    // at the following location
    proxy: 'localhost:5000'
  }, cb);

  process.on('exit', () => browserSync.exit());

  gulp.watch(['build/**/*.*'].concat(
    src.server.map(file => '!' + file)
  ), file => {
    browserSync.reload(path.relative(__dirname, file.path));
  });
});
