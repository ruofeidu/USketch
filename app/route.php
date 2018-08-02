<?php
use think\Route;
Route::rule('test/:id','index/Index/index');
Route::rule('fetchpano/','index/Pano/isDownloaded');
Route::rule('sd/','index/Pano/saveDepth');
Route::rule('ld/','index/Pano/loadDepth');
Route::rule('sp/','index/Pano/savePano');
Route::rule('lp/','index/Pano/loadPano');
Route::rule('bd/','index/Pano/batchDownload');
Route::rule('debug/','index/Index/debug_rename');


return [
    '__pattern__' => [
        'name' => '\w+',
    ],
    '[hello]'     => [
        ':id'   => ['index/hello', ['method' => 'get'], ['id' => '\d+']],
        ':name' => ['index/hello', ['method' => 'post']],
    ],

];
