<?php
/**
 * The Unit Testing and Performance Testing Homepage
 *
 * This script tests the functionality and performance of the project based on the test
 * described in the "./tests" folder. This page provides detailed information on the sucess
 * and performance of each test.
* @author Martin Dale Lyness <martin.lyness@gmail.com>
* @version 0.1.0
* @package UnitTests
*/

// Get required test objects
$testHTML = "";
$testJS = "";
$importJS = array();
array_push($importJS, "<script type=\"text/javascript\" src=\"../lib/prototype.js\"></script>");
array_push($importJS, "<script type=\"text/javascript\" src=\"unittest.js\"></script>");
$handle = opendir("tests/");
if($handle!==false) {
	while(($file = readdir($handle))!==false) {
		if(strpos($file, ".js")!==false && strpos($file, ".js") == strlen($file)-3) {
			// create div and test runner
			$testHTML .= "<p class=\"testTitle\">".str_replace("_", " ", basename($file, ".js"))."</p>
					<div id=\"results_".basename($file, ".js")."\"></div>\n";
							
			$tmpJs = explode("/* end imports (DO NOT REMOVE THIS LINE!) */", file_get_contents("tests/".$file));
			$tmpJs2 = explode("\n", $tmpJs[0]);
			foreach($tmpJs2 as $v) {
				if(!in_array(trim($v), $importJS))
					array_push($importJS, trim($v));
			}
			$testJS .= "new Test.Unit.Runner({ \n".$tmpJs[1]." }, 'results_".basename($file, ".js")."');\n\n";
		}
	}
}
?> 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>JavaScript 3D :: Performance & Functional Testing</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<?php foreach($importJS as $v) echo $v."\n"; ?>
<style type="text/css">
	table {
		border-spacing: 2px;
	}
	th {
		padding: 5px;
	}
	td {
		padding: 5px;
	}
	p.testTitle {
		font-size: 24px;
	}
	.passed td{
		background-color: #AAFFAA;
		border: dashed thin black;
		margin: 2px;
	}
	.failed td {
		background-color: #FF6666;
		border: solid thin black;
		margin: 2px;
	}
	.error td {
		background-color: #FFAAAA;
		border: dashed thin black;
		margin: 2px;
	}
	td.nameCell {
		font-weight: bold;
	}
	div.panel {
		display: block;
		border: solid thin black;
		background-color: #e5e5e5;
	}
</style>
</head>
<body>
<div id="sandbox" style="display: none;">&nbsp;</div>
<h1>JavaScript 3D :: Performance and Functionality Tests</h1>

<div id="testResultContainer"  class="panel">
	<?php echo $testHTML; ?>
</div>
<script type="text/javascript">
<!--
	<?php echo $testJS; ?>
// -->
</script>
</body>
</html>
