with open("src/index.html", "r") as inFile:
	for line in inFile:
		if '<h1>Q' in line:
			id = line.split('>')[1].split('<')[0]
			print id
			print "\n"
			