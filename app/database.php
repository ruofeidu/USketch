<?php
// +----------------------------------------------------------------------
// | Project USketch | Augmentarium Lab 
// | Author: Ruofei Du
// +----------------------------------------------------------------------

return [
    'type'            => 'mysql',
    'hostname'        => '127.0.0.1',
    'database'        => 'apollo',
    'username'        => '',
    'password'        => '',
    'hostport'        => '',
    'dsn'             => '',
    'params'          => [],
    'charset'         => 'utf8',
    'prefix'          => 'ap_',
    'debug'           => false,
	// 0 for central, 1 for distributed
    'deploy'          => 0,
    'rw_separate'     => false,
    'master_num'      => 1,
    'slave_no'        => '',
    'fields_strict'   => true,
    'resultset_type'  => 'array',
    'auto_timestamp'  => false,
    'datetime_format' => 'Y-m-d H:i:s',
    'sql_explain'     => false,
    'builder'         => '',
    'query'           => '\\think\\db\\Query',
];
