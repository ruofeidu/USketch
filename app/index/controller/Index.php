<?php
namespace app\index\controller;
use think\Controller;
use think\Db;

class Index
{
	private function draw_rand_array($array, $draws) 
	{ 
        $lastIndex = count($array) - 1; 
        $returnArr = array(); 
        while ($draws >= 1) { 
			$rndIndex = rand(0, $lastIndex); 
			array_push($returnArr, array_splice($array, $rndIndex, 1)); 
			$draws--; 
			$lastIndex--; 
        } 

        return $returnArr; 
	}
	
	private function save_image($folder, $img)
	{			
		try
		{
			$task = input('param.task/d', 0);
			$suffix = input('param.suffix/s', "");
			//Get the base-64 string from data
			$filteredData = substr($img, strpos($img, ",")+1);
			//Decode the string
			$unencodedData = base64_decode($filteredData);
			//Save the image
			file_put_contents('backup' . $folder . '/'. $task . '_' . $suffix . '.png', $unencodedData);
			file_put_contents('results' . $folder . '/'. $task . '.png', $unencodedData);
			
			if ($folder === 1) {
				$json = input('param.json/s', "");
				$file = fopen('backup' . $folder . '/'. $task . '_' . $suffix . '.json', "w");
				fwrite($file, $json);
				fclose($file);
				$file = fopen('results' . $folder . '/'. $task . '.json', "w");
				fwrite($file, $json);
				fclose($file);
			}
			echo 1;	
		} catch (\Exception $e) {
			echo 0;
		}
	}
	
	private function load_json() {
		try {
			$task = input('param.task/d', 0);
			$backup = input('param.backup/d', 0);
			
			$filename = "results1/" . $task . ".json";
			if ($backup === 1) {
				$task = input('param.task/s', '');
				$filename = "backup1/" . $task . ".json";
			}
			
			if ( !file_exists($filename) ) {
				echo 0;
				return;
			}
			$file = fopen($filename, "r");
			$contents = fread($file, filesize($filename));
			fclose($file);
			echo $contents;
		} catch (\Exception $e) {
			echo 0;
		}
	}
	
	private function query_keywords($q) {
		// read the txt 
		try {
			$filename = "public/images/category.txt";
			$file = fopen($filename, "r");
			if ( !file_exists($filename) ) {
				echo 0;
				return;
			}
			
			$N = (int)fgets($file);
			$list = array(); 
			for ($i = 0; $i < $N; ++$i) {
				$cate = trim(fgets($file));
				
				$M = (int)fgets($file);
				for ($j = 0; $j < $M; ++$j) {
					$name = fgets($file);
					if ($cate === $q) {
						array_push($list, trim($name)); 
					}
				}
				if ($cate === $q) {
					break; 
				}
			}
			fclose($file);
			
			//echo json_encode($q); 
			$randlist = $this->draw_rand_array($list, 16); 
			
			echo json_encode($randlist); 
		} catch (\Exception $e) {
			echo 0;
		}
	}
	
	private function admin($passwd) {
		if ($passwd != config("app_password")
			&& $passwd != "check") {
			echo "Invalid user.";
			return; 
		} 
		$gen = input('param.gen/d', 0);
		$start = input('param.start/d', 1);
		if ($start < 1) $start = 1; 
		$N = config("total_tasks");
		$end = input('param.end/d', $N);
		if ($end > $N) $end = $N; 
		
		$list = array(); 
		$old_list = array(); 
		$completed = 0; 
		$done = 0;
		for ($i = $start; $i <= $end; ++$i) {
			$filename = "results1/" . $i . ".png";
			if ( file_exists($filename) ) {
				array_push($list, $i); 
				++$completed;
			}
			$filename = "results1/" . $i . ".json";
			if ( file_exists($filename) ) {
				array_push($old_list, $i); 
				++$done;
			}
		}
		if ($passwd == "check") 
		{
			return view("check", [
				'admin' => 'Admin',
				'total' => $N,
				'completed' => $completed,
				'percentage' => $done / $N * 100,
				'done' => $done,
				'list' => json_encode($list),
				'old_list' => json_encode($old_list),
				'passwd' => $passwd,
			]);
		}
		
		return view("admin", [
			'admin' => 'Admin',
			'total' => $N,
			'completed' => $completed,
			'done' => $done,
			'percentage' => $completed / $N * 100,
			'list' => $list,
			'passwd' => $passwd,
		]);
	}
	
	private function get_name_before($task) {
		$file = fopen("public/images/references.txt", "r") or die("Unable to open file!");
		
		$N = (int)fgets($file);
		$NTotal= (int)fgets($file);
		
		$total = 0; 
		$name = "";
		
		for($i = 0; $i < $N; ++$i) {
			$cid = (int)fgets($file);
			$cate = fgets($file);
			$scene = fgets($file);
			$M = (int)fgets($file);
			for ($j = 0; $j < $M; ++$j) {
				$name = fgets($file);
				if ($total == $task) break;
				++$total; 
			}
			if ($total == $task) break;
		}
		fclose($file);
		return $name;
	}
	
	private function get_name_after($task) {
		$file = fopen("public/images/references.txt", "r") or die("Unable to open file!");
		
		$N = (int)fgets($file);
		$NTotal= (int)fgets($file);
		
		$total = 0; 
		$name = "";
		
		for($i = 0; $i < $N; ++$i) {
			$cid = (int)fgets($file);
			$cate = fgets($file);
			$scene = fgets($file);
			$M = (int)fgets($file);
			for ($j = 0; $j < $M; ++$j) {
				$name = fgets($file);
				++$total; 
				if ($total >= $task) break; 
			}
			if ($total >= $task) break; 
		}
		fclose($file);
		return $name;
	}
	
	private function debug_comparison() {
		$before = array();
		$after = array();
		$N = config("total_tasks");
		for ($task = 0; $task <= $N; ++$task) {
			$a = $this->get_name_before($task);
			$b = $this->get_name_after($task);
			array_push($before, $a);
			array_push($after, $b); 
			//if ($a !== $b) {
				echo $task . " ". $a . " " . $b . "<br/>";
			//}
		}
		//echo "----" . "<br/>";
		
		for ($task = $N; $task >= 0; --$task) {
			if ($before[$task] !== $after[$task]) {
				$flag = false; 
				for ($i = $task; $i >= 0; --$i) {
					if ($before[$i] === $after[$task]) {
						//echo $i . " ". $task. "<br/>";
						// if ( file_exists("results1/". $i .".json") )
							// copy("results1/". $i .".json", "results1/".$task.".json");
						// if ( file_exists("results1/". $i .".png") )
							// copy("results1/". $i .".png", "results1/".$task.".png");
						// if ( file_exists("results2/". $i .".png") )
							// copy("results2/". $i .".png", "results2/".$task.".png");
						$flag = true; 
					}
				}
				if (!$flag && $task < $N) {
					// if ( file_exists("results1/". $task .".json") )
						// unlink("results1/". $task .".json");
					// if ( file_exists("results1/". $task .".png") )
						// unlink("results1/". $task .".png");
					// if ( file_exists("results2/". $task .".png") )
						// unlink("results2/". $task .".png");
					echo $task . "<br/>";
				}
			}
		}
	}
	private function debug_output() {
		$before = array();
		$after = array();
		$N = config("total_tasks");
		for ($task = 0; $task <= $N; ++$task) {
			$a = $this->get_name_before($task);
			$b = $this->get_name_after($task);
			array_push($before, $a);
			array_push($after, $b); 
		}
		
		for ($task = 0; $task <= $N; ++$task) {
			if ($before[$task] !== $after[$task]) {
				$flag = false; 
				for ($i = $task; $i >= 0; --$i) {
					if ($before[$i] === $after[$task]) {
						$flag = true; 
					}
				}
				if (!$flag && $task <= $N) {
					$name = trim($before[$task]);
					//echo "public/images/references/" . $name . "<br/>";
					//echo "public/images/references/1801/1802_people/" . $task . substr($name, -4). "<br/>";
					copy("public/images/references/" . $name, 
					     "public/images/references/1801/1802_people/" . $task . substr($name, -4));
				}
			}
		}
	}
	
	private function debug_view() {
		$before = array();
		$after = array();
		$N = config("total_tasks");
		for ($task = 0; $task <= $N; ++$task) {
			$a = $this->get_name_before($task);
			//$b = $this->get_name_after($task);
			array_push($before, $a);
			//array_push($after, $b); 
		}
		
		for ($task = 1; $task <= $N; ++$task) {
			$flag = false; 
			// for ($i = 1; $i < $task; ++$i) {
				// if ($before[$i] === $before[$task]) {
					// $flag = true; 
				// }
			// }
			if ($flag && $task <= $N) {
				$name = trim($before[$task]);
				//echo $name . "<br/>";
				//echo $task . "<br/>";
			}
			echo  $before[$task]."<br/>";
		}
	}
	
	// private function debug_retrieve_backup2() {
		// $N = config("total_tasks");
		// $dir    = 'backup2/';
		// $files = scandir($dir);
		
		// foreach ($files as $file) {
			// if (substr($file, -3) !== 'png')
				// continue;
			// dump($file);
			// $pos = strpos($file, '_');
			// $task = intval(substr($file, 0, $pos));
			// dump(filemtime($dir . $file));
		// }
	// }
	
	private function debug_rename() {
		for ($task = 2003; $task <= 2006; ++$task) {						
			// if ( file_exists("results1/". $task .".json") )
				// copy("results1/". $task .".json", "results1/".($task-1).".json");
			// if ( file_exists("results1/". $task .".png") )
				// copy("results1/". $task .".png", "results1/".($task-1).".png");
			if ( file_exists("results2/". $task .".png") )
				copy("results2/". $task .".png", "results2/".($task-1).".png");
			echo $task;
		}
	}
	
	private function restore($task, $file_name) {
		if ( file_exists("backup1/". $file_name .".png") )
			copy("backup1/". $file_name .".png", "results1/". $task . ".png");
		if ( file_exists("backup1/". $file_name .".json") )
			copy("backup1/". $file_name .".json", "results1/". $task . ".json");
		if ( file_exists("backup2/". $file_name .".png") )
			copy("backup2/". $file_name .".png", "results2/". $task . ".png");
		if ( file_exists("backup3/". $file_name .".png") )
			copy("backup3/". $file_name .".png", "results3/". $task . ".png");
	}
	
	private function history() {
		$task = input('param.history/d', 0);
		$ans = glob("backup1/" . $task ."_*.json"); 
		if (empty($ans)) return;
		usort($ans, create_function('$a,$b', 'return filemtime($b) - filemtime($a);'));
		
		foreach ($ans as &$filename) {
			$filename = substr(substr($filename, 8), 0, -5);
		}
		echo json_encode($ans); 
	}
	
    public function index()
    {
		$task = input('param.task/d', 0);
		if ($task <= 0) $task = 0; 
		
        $load = input('param.load/d', -1);
		if ($load !== -1) {
			return $this->load_json();
		}
		
        $history = input('param.history/d', -1);
		if ($history !== -1) {
			return $this->history();
		}
		
        $debug = input('param.debug/d', -1);
		if ($debug !== -1) {
			return $this->debug_view();
		}
		
        $save = input('param.save/d', -1);
		if ($save !== -1) {
			return $this->save_image($save, $_POST['img_val']);
		}
		
        $query = input('param.query/s', null);
		if ($query != null) {
			return $this->query_keywords($query); 
		}
		
        $user = input('param.user/s', null);
		if ($user != null) {
			return $this->admin($user); 
		}
		// read the txt 
		$file = fopen("public/images/references.txt", "r") or die("Unable to open file!");
		
		$N = (int)fgets($file);
		$NTotal= (int)fgets($file);
		// $done = false; 
		$total = 0; 
		for($i = 0; $i < $N; ++$i) {
			$cid = (int)fgets($file);
			$cate = fgets($file);
			$scene = fgets($file);
			$M = (int)fgets($file);
			for ($j = 0; $j < $M; ++$j) {
				$name = fgets($file);
				if ($total >= $task) break; 
				// This is an intended bug...
				++$total; 
			}
			if ($total >= $task) break; 
		}
		fclose($file);
		
		
		return view('index', [
			'task' => $task, 
			'scene' => trim($scene), 
			'reference' => trim($name),
			'ver' => '19'
		]);
	}
	
	public function fetch($type = -1)
	{
		//$res = db('label',[],false)->where('valid', 1)->find();
		if ($type < 0) {
			$res = db('label')->where('valid', 1)->select();
		} else {
			$res = db('label')->where('valid', 1)->where('type', $type)->select();
		}
		echo json_encode($res); 
		return;
	}
	
	public function save()
	{
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		  $data = json_decode(file_get_contents("php://input"));
		}
		
		foreach ($data as $item) {
			$data = array(
				"posx" => $item->posx,
				"posy" => $item->posy,
				"posz" => $item->posz,
				"rotx" => $item->rotx,
				"roty" => $item->roty,
				"rotz" => $item->rotz,
				"scax" => $item->scax,
				"scay" => $item->scay,
				"scaz" => $item->scaz,
			);
			db('label')->where('id', $item->id)->update($data);
			echo 1; 
		}
		return; 
	}
}
