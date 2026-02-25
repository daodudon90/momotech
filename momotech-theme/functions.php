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
            
            // Pass PHP settings to JS
            wp_localize_script('momotech-theme-js-' . $js_filename, 'momotechSettings', array(
                'apiKey' => get_theme_mod('momotech_ai_api_key', '')
            ));
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

// Add Customizer Setting
function momotech_customize_register( $wp_customize ) {
    $wp_customize->add_section( 'momotech_ai_section' , array(
        'title'      => __( 'Momotech AI Settings', 'momotech-theme' ),
        'priority'   => 30,
    ) );

    $wp_customize->add_setting( 'momotech_ai_api_key' , array(
        'default'   => '',
        'transport' => 'refresh',
        'sanitize_callback' => 'sanitize_text_field',
    ) );

    $wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'momotech_ai_api_key', array(
        'label'      => __( 'Gemini API Key', 'momotech-theme' ),
        'section'    => 'momotech_ai_section',
        'settings'   => 'momotech_ai_api_key',
        'type'       => 'text',
        'description' => 'Enter your Google Gemini API Key here.',
    ) ) );
}
add_action( 'customize_register', 'momotech_customize_register' );
