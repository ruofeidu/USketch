<?php
// +----------------------------------------------------------------------
// | Project USketch | Augmentarium Lab 
// | Author: Ruofei Du
// +----------------------------------------------------------------------

return [

    // +----------------------------------------------------------------------
    // | Custom App Config
    // +----------------------------------------------------------------------
	'site_title'			=>	'USketch | SketchyScene | Augmentarium Lab | UMIACS',
	'site_desc'				=>	'Project USketch | SketchyScene',
	'view_replace_str'  =>  [
		'__PUBLIC__'		=>	'/usketch/public',
		'__CSS__'			=>	'/usketch/public/css',
		'__JS__'			=>	'/usketch/public/js',
		'__ROOT__'			=>	'/usketch/',
		'__APP__'			=>	'/usketch/',
		'__FOLDER__'		=>	'cateogory_ctrain',
	],

    // +----------------------------------------------------------------------
    // | Configuration
    // +----------------------------------------------------------------------
    'app_password'           => 'admin',
    'total_tasks'            => 5596,
    'app_namespace'          => 'app',
    'app_debug'              => true,
    'app_trace'              => false,
    'app_status'             => '',
    'app_multi_module'       => true,
    'auto_bind_module'       => false,
    'root_namespace'         => [],
    'extra_file_list'        => [THINK_PATH . 'helper' . EXT],
    'default_return_type'    => 'html',
    'default_ajax_return'    => 'json',
    'default_jsonp_handler'  => 'jsonpReturn',
    'var_jsonp_handler'      => 'callback',
    'default_timezone'       => 'EST',
    'lang_switch_on'         => true,
    'default_filter'         => '',
    'default_lang'           => 'en-us',
    'class_suffix'           => false,
    'controller_suffix'      => false,
    'default_module'         => 'index',
    'deny_module_list'       => ['common'],
    'default_controller'     => 'Index',
    'default_action'         => 'index',
    'default_validate'       => '',
    'empty_controller'       => 'Error',
    'action_suffix'          => '',
    'controller_auto_search' => false,
    'var_pathinfo'           => 's',
    'pathinfo_fetch'         => ['ORIG_PATH_INFO', 'REDIRECT_PATH_INFO', 'REDIRECT_URL'],
    'pathinfo_depr'          => '/',
    'url_html_suffix'        => 'html',
    'url_common_param'       => false,
    'url_param_type'         => 0,
    'url_route_on'           => true,
    'route_complete_match'   => false,
    'route_config_file'      => ['route'],
    'url_route_must'         => false,
    'url_domain_deploy'      => false,
    'url_domain_root'        => '',
    'url_convert'            => true,
    'url_controller_layer'   => 'controller',
    'var_method'             => '_method',
    'var_ajax'               => '_ajax',
    'var_pjax'               => '_pjax',
    'request_cache'          => false,
    'request_cache_expire'   => null,

    // +----------------------------------------------------------------------
    // | Template
    // +----------------------------------------------------------------------

    'template'               => [
        'type'         => 'Think',
        'view_path'    => '',
        'view_suffix'  => 'html',
        'view_depr'    => DS,
        'tpl_begin'    => '{',
        'tpl_end'      => '}',
        'taglib_begin' => '{',
        'taglib_end'   => '}',
    ],

    'dispatch_success_tmpl'  => THINK_PATH . 'tpl' . DS . 'dispatch_jump.tpl',
    'dispatch_error_tmpl'    => THINK_PATH . 'tpl' . DS . 'dispatch_jump.tpl',

    // +----------------------------------------------------------------------
    // | Exceptions
    // +----------------------------------------------------------------------

    'exception_tmpl'         => THINK_PATH . 'tpl' . DS . 'think_exception.tpl',

    'error_message'          => '>_<b Please refresh again',
    'show_error_msg'         => false,
    'exception_handle'       => '',

    // +----------------------------------------------------------------------
    // | Log
    // +----------------------------------------------------------------------

    'log'                    => [
        'type'  => 'File',
        'path'  => LOG_PATH,
        'level' => [],
    ],

    // +----------------------------------------------------------------------
    // | Trace configurations
    // +----------------------------------------------------------------------
    'trace'                  => [
        'type' => 'Html',
    ],

    // +----------------------------------------------------------------------
    // | Cache
    // +----------------------------------------------------------------------

    'cache'                  => [
        'type'   => 'File',
        'path'   => CACHE_PATH,
        'prefix' => '',
        'expire' => 0,
    ],

    // +----------------------------------------------------------------------
    // | Session
    // +----------------------------------------------------------------------

    'session'                => [
        'id'             => '',
        'var_session_id' => '',
        'prefix'         => 'think',
        'type'           => '',
        'auto_start'     => true,
    ],

    // +----------------------------------------------------------------------
    // | Cookie
    // +----------------------------------------------------------------------
    'cookie'                 => [
        // cookie prefix
        'prefix'    => '',
        // cookie expire time
        'expire'    => 0,
        // cookie path
        'path'      => '/',
        // cookie effective domain
        'domain'    => '',
        // cookie secure transfer
        'secure'    => false,
        // httponly config
        'httponly'  => '',
        // whether to use setcookie
        'setcookie' => true,
    ],

    // page 
    'paginate'               => [
        'type'      => 'bootstrap',
        'var_page'  => 'page',
        'list_rows' => 15,
    ],
];
