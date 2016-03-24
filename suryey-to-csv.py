#!/usr/bin/env python

import json
from sys import argv



if __name__ == "__main__":

	if len(argv) != 2:
		print "must provide a file"
	else:
		labels = []
		with open(argv[1], "r") as inFile:
			for indx, line in enumerate(inFile):
				if indx > 0:
					idFull, objFull = line.split(", value=")

					idVal = idFull.split("=")[1]
					objVal = objFull
					objJson = json.loads(objVal)
			
					if indx == 1:
						result = u""
			
						for i, item in enumerate(objJson):
				
							result += item["key"]
							labels.append(item["key"]) 
							result += "\t"
						print result
				
					result = u""
					for label in labels:
# 						print label
						for i, item in enumerate(objJson):
							if item["key"]==label:
								result += item["value"].replace("\n", " ")
								result += "\t"
								break
 						else:
 							result +="\t"
					print result