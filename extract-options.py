with open("src/index.html", "r") as inFile:
	for line in inFile:
		if 'id=' in line:
			id = line.split('id="')[1].split('"')[0]
			print id
		
		if 'value=' in line:
			val = line.split('value="')[1].split('"')[0]
			print "\t- " + val
			