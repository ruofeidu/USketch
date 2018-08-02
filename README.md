# USketch
USketch is a web-driven tool for crowdsourcing the SketchyScene dataset. The corresponding paper is:

> SketchyScene: Richly-Annotated Scene Sketches. Changqing Zou, Qian Yu, Ruofei Du, Haoran Mo, Yi-Zhe Song, Tao Xiang, Chengying Gao, Baoquan Chen, Hao Zhang. In Proceedings of European Conference on Computer Vision (ECCV), 2018.

The entire repository of the databaset is held at: https://github.com/SketchyScene/SketchyScene

To boost the efficiency of human creators, we devised a customary, web-based application for sketch scene synthesis. We facilitated the creation of the sketchy scene images by allowing the worker to drag, rotate, scale, and deform the component sketch with the guidance of the reference image. 

![USketch Interface](USketch.jpg "Interface and work flow of \textit{USketch} for crowdsourcing the dataset. See areas of function buttons (upper left), component display (lower left), and canvas (right). ")

It's worth noting that:

1. We provided different sets of component sketches (even the same category) to different workers, to implicitly control the diversity of object sketches. Otherwise, workers tend to select the first several samples from the candidate pool; 
2. We required the workers to produce as various occlusions as possible during the scene synthesis. This is to simulate the real scenarios and facilitate the research in segmentation. Our server recorded the transformation and semantic labels of each scene item of resulting sketchy scenes. 

Live demo / toolbox is located at http://duruofei.com/sketest/?task=1

# Build

## Dependencies
* ThinkPHP 5.0, please clone the framework as follows:
```bash
    git clone https://github.com/top-think/framework thinkphp
```
* Python 3+

## Environments
* Apache + PHP + MySQL + Python
* Install the latest [XAMPP](https://www.apachefriends.org/index.html)

## Misc
* You may want to change the config.php under the App folder for renaming the repository.
* Please refer to https://github.com/SketchyScene/SketchyScene for the scene sketches, the candidate images, and the reference images. The default folder for candidate images is public/images/cateogory_ctrain, it's defined in the config.php
* You may need to run the scripts under public/images, e.g., create_tasks.py to generate new tasks.
* Feel free to contact me if you would like to use this toolbox for crowdsourcing other datasets.

## Author
[Ruofei Du](http://duruofei.com)

## Acknowledgement for ThirdParty libraries
* [jQuery](https://jquery.com/)
* [jQuery UI](https://jqueryui.com/)
* [jquery.ui.rotatable](https://github.com/godswearhats/jquery-ui-rotatable)
* [jQuery Simulate](https://github.com/jquery/jquery-simulate)
* [Mousetrap.js](https://craig.is/killing/mice)
* [HTML2Canvas](https://github.com/niklasvh/html2canvas)
* [Hermite-resize](https://github.com/viliusle/Hermite-resize)
* [SignaturePad](https://github.com/szimek/signature_pad)
* [MersenneTwister](https://github.com/pigulla/mersennetwister)
