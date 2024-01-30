dictocc = []
dict = []


with open ("dictoccur.json", "rt") as do:
    for entryocc in do:
        dictocc.append(entryocc)
with open ("dict.json", "rt") as d:
    for entry in do:
        dict.append(entry)
      
for i in dictocc:
    