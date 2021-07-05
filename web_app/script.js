document.getElementById('participation-file')
//  .addEventListener('change', readFileParticipation)
document.getElementById('gradebook-file')
//  .addEventListener('change', readFileGradebook)
document.getElementById('calculate-button')
  .addEventListener('click', calculateGrades)

results_gb = [];
results_ps = [];
roster_idkey_arr = [];
roster_grade_arr = [];
var str_gb = '';
var str_ps = '';
function calculateGrades() {
	//console.clear();
	//console.log("clicked");
	//console.log(document.getElementById('dropdown_number').value);
	sel_index = document.getElementById('dropdown_number').value;
	sel_text = document.getElementById('dropdown_number').options[document.getElementById('dropdown_number').selectedIndex].text;
	//console.log(document.getElementById('gradebook-file').value);
	//console.log(document.getElementById('participation-file').value);

	const input_ps = document.getElementById('participation-file');
	if (input_ps.files && input_ps.files[0]) {
		let file_ps = input_ps.files[0];
		let fileReader = new FileReader(); 
		fileReader.onload = function(e) {
			str_ps = e.target.result;
			results_ps = str_ps.split("\r\n");
			for (i=1; i<results_ps.length-1; i++) {
				//console.log(results_ps[i].split(",")[1].replace("@colorado.edu",""),results_ps[i].split(",")[2]);
				roster_idkey = results_ps[i].split(",")[1].replace("@colorado.edu","");
				roster_idkey_arr.push(roster_idkey);
				roster_grade = results_ps[i].split(",")[2];
				roster_grade_arr.push(roster_grade);
				//console.log(roster_idkey,roster_grade);
			}

			const input_gb = document.getElementById('gradebook-file');
			if (input_gb.files && input_gb.files[0]) {
				let file_gb = input_gb.files[0];
				let fileReader = new FileReader(); 
				fileReader.onload = function(e) {
					output = [];
					str_gb = e.target.result;
					results_gb = str_gb.split("\n");
					//console.log(str_gb);
					first_line = '';
					for (i=0; i<5; i++) {
						first_line += results_gb[0].split(",")[i];
						first_line += ",";
					}
					for (i=0; i<results_gb[0].split(",").length; i++) {
						if (results_gb[0].split(",")[i] == sel_text) {
							first_line += sel_text;
						}
					}
					first_line += "\n";
					//console.log(first_line);
					output.push(first_line);
					blank_line = ",,,,,";
					blank_line += "\n";
					//console.log(blank_line);
					output.push(blank_line);
					for (i=3; i<results_gb.length-2; i++) {
						this_line = ''
						//console.log(results_gb[i]);
						//console.log(results_gb[i].split(","));
						//console.log(results_gb[i].split(",")[4]);
						gradebook_name = results_gb[i].split(",")[0]+","+results_gb[i].split(",")[1];
						gradebook_ids = results_gb[i].split(",")[2];
						gradebook_sis = results_gb[i].split(",")[3];
						gradebook_idkey = results_gb[i].split(",")[4];
						gradebook_course = results_gb[i].split(",")[5];
						this_line += gradebook_name+",";
						this_line += gradebook_ids+",";
						this_line += gradebook_sis+",";
						student_exists = false;
						for (ii=0; ii<results_ps.length-1; ii++) {
							if (gradebook_idkey == roster_idkey_arr[ii]) {
								student_exists = true;
								this_line += roster_idkey_arr[ii]+",";
								this_line += gradebook_course+",";
								if (roster_grade_arr[ii]>=50) {
									this_line += "4";
								} else {
									this_line += Math.floor(5*roster_grade_arr[ii]/50);
								}
								this_line += "\n";
								//console.log(this_line);
								output.push(this_line);
							}
						}
						if (student_exists == false) {
							this_line += gradebook_idkey+",";
							this_line += gradebook_course+",";
							this_line += "0";
							this_line += "\n";
							//alert(gradebook_idkey+" missing");
							output.push(this_line);
						}
					}
					//console.log(output);
					//window.alert(output);
					string = output.join();
				    fileName = "Grades-PHYS_1120_Sm21-Updated";
					let csvData = new Blob(output, { type: 'text/csv' });
					//let csvData = new Blob([string], { type: 'text/csv' });
					let csvUrl = URL.createObjectURL(csvData);

					let hiddenElement = document.createElement('a');
					hiddenElement.href = csvUrl;
					hiddenElement.target = '_blank';
					hiddenElement.download = fileName + '.csv';
					hiddenElement.click();
				};
				fileReader.readAsText(file_gb);
			} else {
				alert("Missing gradebook!");
			}
		};
		fileReader.readAsText(file_ps);
	} else {
		alert("Missing participation!");
	}
}
