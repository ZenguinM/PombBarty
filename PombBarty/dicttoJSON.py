dictl = []
onelpl = []
twolpl = []
thrlpl = []
thrlpj = {}
import json

with open ("1letterprompts.txt", "rt") as onel:
    for pro in onel:
        onelpl.append(pro.rstrip('\n'))
with open ("2letterprompts.txt", "rt") as twol:
    for pro in twol:
        twolpl.append(pro.rstrip('\n'))
with open ("3letterprompts.txt", "rt") as thrl:
    for pro in thrl:
        thrlpl.append(pro.rstrip('\n'))
with open ("dict.txt", "rt") as dict:
    for wor in dict:
        dictl.append(wor.rstrip('\n'))


print("In process...")
for pr in thrlpl:
    occur = 0
    for word in dictl:
        if str(word).count(str(pr).upper()):
            occur += 1   
    if occur > 0:
        print("\t\"", str(pr.upper()), "\": ", str(occur), ",", sep='')
        thrlpj.update({pr.upper():occur})
print("Finished!")

thrlpjs = json.dumps(thrlpj, indent=4)
with open ("dictoccurcopy.json", "w") as outfile:
    outfile.write(thrlpjs)

#print("{")
#for word in dictl:
#    print("\t\"", str(word.upper()), "\",", sep='')
#print("}")