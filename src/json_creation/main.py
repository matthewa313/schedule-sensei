import pandas as pd
import json

#check examplePreExcel to see how the pdf gets converted initially, and the 23-24 schedule excel to see how it needs to be formatted for this script to work
#possibly ask registrar to provide already formatted excel document next year
output = {}
output['o'] = []
data = pd.read_excel("schedule.xlsx") #change to current years master schedule
classes = []
options = []


class clas:
    def __init__(self, typ, name, period, term, teacher, room):
        self.typ = typ
        self.name = name
        self.period = period
        self.term = term
        self.teacher = teacher
        self.room = room

    def returnJson(self):
        return {
            "name": name,
            "semester": term,
            "period": period,
            "teacher": teacher,
            "room": room
        }


for val in data.values:
    typ = val[0].strip()[0]
    name = val[0].strip()[2:]
    period = int(val[1][0])
    term = "S1" if val[2] == "S1" else "S2" if val[2] == "S2" else "Year"
    teacher = val[3]
    room = val[4]
    pp = clas(typ, name, period, term, teacher, room)
    options.append([name, typ, 0 if term == "Year" else 1])
    classes.append(pp.returnJson())

op = []
[op.append(x) for x in options if x not in op]



def getPeriods(course,sem):
    periods = []
    for i in range(1, 9):
        for cork in classes:
            if cork["name"] == course and cork["period"] == i and cork["semester"] == sem:
                periods.append(i)
    periods = list(set(periods))
    return periods

def getMatches(course, sem, period):
    matches = []
    for cl in classes:
        if cl["name"] == course and cl["period"] == period and cl["semester"] == sem:
            matches.append(cl)
    return matches
    
def addPeriods(course,sem):
    obj = {}
    periods = getPeriods(course,sem)
    for per in periods:
        obj[str(per)] = getMatches(course,sem,per)
    return obj

for opt in op:
    match opt[2]:
        case 0:
            output['o'].append({
                "name": opt[0],
                "type": opt[1],
                "year": addPeriods(opt[0], "Year")
            })
        case 1:
            output['o'].append({
                "name": opt[0],
                "type": opt[1],
                "s1": addPeriods(opt[0], "S1"),
                "s2": addPeriods(opt[0], "S2")
            })

with open('data.json', 'w') as outfile:
    json.dump(output, outfile)
