// IMPORT PLUGINS //

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    wpPot = require('gulp-wp-pot'),
    // babel = require('gulp-babel'),
    newer = require('gulp-newer');


// PATHES //

// Set path to foundation files
const FOUNDATION = 'node_modules/foundation-sites';

// Source pathes
const SOURCE = {
	scripts: [
	    'node_modules/what-input/dist/what-input.js',
		// foundation core - needed for all components
		FOUNDATION + '/dist/js/plugins/foundation.core.js',
		FOUNDATION + '/dist/js/plugins/foundation.util.*.js',
		// only needed components
		FOUNDATION + '/dist/js/plugins/foundation.abide.js',
		FOUNDATION + '/dist/js/plugins/foundation.accordion.js',
		FOUNDATION + '/dist/js/plugins/foundation.accordionMenu.js',
		FOUNDATION + '/dist/js/plugins/foundation.drilldown.js',
		FOUNDATION + '/dist/js/plugins/foundation.dropdown.js',
		FOUNDATION + '/dist/js/plugins/foundation.dropdownMenu.js',
		FOUNDATION + '/dist/js/plugins/foundation.equalizer.js',
		FOUNDATION + '/dist/js/plugins/foundation.interchange.js',
		FOUNDATION + '/dist/js/plugins/foundation.magellan.js',
		FOUNDATION + '/dist/js/plugins/foundation.offcanvas.js',
		FOUNDATION + '/dist/js/plugins/foundation.orbit.js',
		FOUNDATION + '/dist/js/plugins/foundation.responsiveAccordionTabs.js',
		FOUNDATION + '/dist/js/plugins/foundation.responsiveMenu.js',
		FOUNDATION + '/dist/js/plugins/foundation.responsiveToggle.js',
		FOUNDATION + '/dist/js/plugins/foundation.reveal.js',
		FOUNDATION + '/dist/js/plugins/foundation.slider.js',
		FOUNDATION + '/dist/js/plugins/foundation.smoothScroll.js',
		FOUNDATION + '/dist/js/plugins/foundation.sticky.js',
		FOUNDATION + '/dist/js/plugins/foundation.tabs.js',
		FOUNDATION + '/dist/js/plugins/foundation.toggler.js',
		FOUNDATION + '/dist/js/plugins/foundation.tooltip.js',
		// other assets
		'src/scripts/assets/**/*.js',
		// theme scripts
		'src/scripts/theme/**/*.js',
    ],
   
	styles: 'src/styles/**/*.scss',
		
	// Images placed here will be optimized
	images: 'src/images/**/*',

	php: '**/*.php',
};

// Destination pathes
const DEST = {
	styles: 'assets',
	scripts: 'assets',
	maps: 'maps',
	images: 'assets/images',
	translate: 'languages/translation.pot',
};

// Translation
const TRANSLATE = {
	textdomain: 'wp_foundation_theme',
	packageName: 'WP Foundation Theme',
};

// STYLE TASKS //

gulp.task('styles', function(){
	return gulp.src(SOURCE.styles)
		.pipe(sourcemaps.init())
		.pipe(sass({ 
			errLogToConsole: true,
			includePaths: [
				'node_modules'
			]
		}))
		.pipe(autoprefixer({
		    browsers: [
		    	'last 2 versions',
		    	'ie >= 9',
				'ios >= 7'
		    ],
		    cascade: false
		}))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write(DEST.maps))
		.pipe(gulp.dest(DEST.styles))
		.pipe(notify({
            message: 'Successfully compiled SASS'
        }));
});

// SCRIPT TASKS //

gulp.task('scripts', function() {
    return gulp.src(SOURCE.scripts)
        .pipe(sourcemaps.init())
        // .pipe(babel({
        // 	presets: ['env'],
        // 	compact: true,
        // 	ignore: ['what-input.js']
        // }))
        .pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write(DEST.maps))
        .pipe(gulp.dest(DEST.scripts))
        .pipe(notify({
            message: 'Successfully compiled JS'
        }));
});


// WORDPRESS TRANSLATION TASKS //

gulp.task( 'translate', function () {
     return gulp.src( SOURCE.php )
         .pipe(wpPot( {
             domain: TRANSLATE.textdomain,
             package: TRANSLATE.packageName
         } ))
        .pipe(gulp.dest(DEST.translate))
        .pipe(notify({
            message: 'Successfully translated'
        }));;
 });

// IMAGE TASKS //

gulp.task('images', function() {
	return gulp.src(SOURCE.images)
		// minify only changed files 
		.pipe(newer(DEST.images))
		.pipe(imagemin())
		.pipe(gulp.dest(DEST.images))
		.pipe(notify({
            message: 'Successfully minified images'
        }));
});

// WATCH TASKS //

gulp.task('watch', function(){
	gulp.watch(SOURCE.styles, ['styles']);
	gulp.watch(SOURCE.scripts, ['scripts']);
	gulp.watch(SOURCE.php, ['translate']);
	gulp.watch(SOURCE.images, ['images']);
});

// DEFAULT TASKS //

gulp.task('default', ['watch', 'styles', 'scripts', 'translate', 'images']);