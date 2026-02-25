<?php
/**
 * Plugin Name: Momotech AI Assistant
 * Description: Embeds the Momotech AI Assistant React app via shortcode [momotech_assistant].
 * Version: 1.0.0
 * Author: Momotech
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

function momotech_assistant_enqueue_scripts() {
    $plugin_dir_path = plugin_dir_path(__FILE__);
    $plugin_url = plugin_dir_url(__FILE__);

    // Enqueue JS
    // We need to find the JS file in dist/assets because Vite hashes filenames
    $js_files = glob($plugin_dir_path . 'dist/assets/*.js');
    if ($js_files) {
        foreach ($js_files as $js_file) {
            $js_filename = basename($js_file);
            wp_enqueue_script('momotech-assistant-js-' . $js_filename, $plugin_url . 'dist/assets/' . $js_filename, array(), '1.0.0', true);
        }
    }

    // Enqueue CSS
    $css_files = glob($plugin_dir_path . 'dist/assets/*.css');
    if ($css_files) {
        foreach ($css_files as $css_file) {
            $css_filename = basename($css_file);
            wp_enqueue_style('momotech-assistant-css-' . $css_filename, $plugin_url . 'dist/assets/' . $css_filename, array(), '1.0.0');
        }
    }
}
add_action('wp_enqueue_scripts', 'momotech_assistant_enqueue_scripts');

function momotech_assistant_shortcode() {
    return '<div id="momotech-assistant-root"></div>';
}
add_shortcode('momotech_assistant', 'momotech_assistant_shortcode');
