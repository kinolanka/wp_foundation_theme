<?php

add_action( 'after_setup_theme', 'theme_setup' );

function theme_setup(){
	load_theme_textdomain( 'wp_foundation_theme', 'languages' );
}

add_action( 'wp_enqueue_scripts', 'enqueue_scripts' );

function enqueue_scripts() {
	wp_enqueue_style( 'theme_css', get_theme_file_uri( '/assets/bundle.css' ), array(), false, 'all' );
	wp_enqueue_script( 'theme_scripts', get_theme_file_uri( '/assets/bundle.js' ), array('jquery'), false, true );
}