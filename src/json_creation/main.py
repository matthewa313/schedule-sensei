import pandas as pd
import json

#check examplePreExcel to see how the pdf gets converted initially, and the 23-24 schedule excel to see how it needs to be formatted for this script to work
#possibly ask registrar to provide already formatted excel document next year
output = {}
output['o'] = []
data = pd.read_excel("./excels/26-27_Website_MS.xlsx") #change to current years master schedule
classes = []
options = []


class clas:
    def __init__(self, typ, name, period, period_key, term, teacher, room):
        self.typ = typ
        self.name = name
        self.period = period
        self.period_key = period_key
        self.term = term
        self.teacher = teacher
        self.room = room

    def returnJson(self):
        return {
            "name": self.name,
            "semester": self.term,
            "period": self.period,
            "period_key": self.period_key,
            "teacher": self.teacher,
            "room": self.room
        }

DEBATE_PERIOD_LABELS = {
    1: 'Extemp',
    2: 'LD',
    3: 'OO/Interp',
    4: 'PF',
}

for val in data.values:
    typ = val[1].strip()[0]
    name = val[1].strip()[2:]
    period_str = val[2].strip()
    period_base = period_str.split('(')[0]  # e.g. "1-2" or "1"
    if '-' in period_base:
        period_key = period_base        # "1-2"
        period = int(period_base[0])   # 1
    else:
        period = int(period_base[0])
        period_key = period
    if name == '*Advanced Debate Honors' and period in DEBATE_PERIOD_LABELS:
        name = '*Advanced Debate Honors - ' + DEBATE_PERIOD_LABELS[period]
    term = "S1" if val[3] == "S1" else "S2" if val[3] == "S2" else "Year"
    teacher = val[4]
    room = val[5]
    pp = clas(typ, name, period, period_key, term, teacher, room)
    options.append([name, typ, 0 if term == "Year" else 1])
    classes.append(pp.returnJson())

op = []
[op.append(x) for x in options if x not in op]



def getPeriods(course, sem):
    periods = []
    for cork in classes:
        if cork["name"] == course and cork["semester"] == sem:
            pk = cork["period_key"]
            if pk not in periods:
                periods.append(pk)
    return periods

def getMatches(course, sem, period_key):
    matches = []
    for cl in classes:
        if cl["name"] == course and cl["period_key"] == period_key and cl["semester"] == sem:
            matches.append({k: v for k, v in cl.items() if k != "period_key"})
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

with open('../files/creekSchedule2627.json', 'w') as outfile:
    json.dump(output, outfile)
