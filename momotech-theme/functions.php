<?php
function momotech_theme_scripts() {
    $theme_dir_path = get_template_directory();
    $theme_url = get_template_directory_uri();

    // Enqueue JS
    $js_files = glob($theme_dir_path . '/dist/assets/*.js');
    if ($js_files) {
        foreach ($js_files as $js_file) {
            $js_filename = basename($js_file);
            wp_enqueue_script('momotech-theme-js-' . $js_filename, $theme_url . '/dist/assets/' . $js_filename, array(), '1.0.0', true);
        }
    }

    // Enqueue CSS
    $css_files = glob($theme_dir_path . '/dist/assets/*.css');
    if ($css_files) {
        foreach ($css_files as $css_file) {
            $css_filename = basename($css_file);
            wp_enqueue_style('momotech-theme-css-' . $css_filename, $theme_url . '/dist/assets/' . $css_filename, array(), '1.0.0');
        }
    }
}
add_action('wp_enqueue_scripts', 'momotech_theme_scripts');
